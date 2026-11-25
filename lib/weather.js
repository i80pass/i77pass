// National Weather Service weather for the I-77 corridor towns.
// Keyless, the way the i80pass master does it: resolve the grid
// once per point through api.weather.gov/points (cached in memory
// for the life of the process), then read the daily and hourly
// forecasts with next revalidate 900. All temperatures are
// Fahrenheit, which is what the NWS returns for US points.
// Server side only. Never throws: a dead NWS read degrades to a
// null result and the page renders its honest unavailable block.

const UA = "i77pass.com/1.0 (contact@i77pass.com)";
const CACHE_MS = 120_000;

const gridCache = new Map();
let forecastCache = { at: 0, promise: null, key: "" };

async function getGrid(lat, lon) {
  const key = `${lat},${lon}`;
  if (gridCache.has(key)) return gridCache.get(key);
  const res = await fetch(`https://api.weather.gov/points/${lat},${lon}`, {
    headers: { "User-Agent": UA, Accept: "application/geo+json" },
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`NWS points returned ${res.status}`);
  const d = await res.json();
  const grid = {
    forecastUrl: d.properties?.forecast || null,
    hourlyUrl: d.properties?.forecastHourly || null,
    zone: d.properties?.forecastZone || null,
  };
  gridCache.set(key, grid);
  return grid;
}

function parseIcon(url = "") {
  const m = String(url).match(/icons\/land\/(day|night)\/([^,?/]+)/);
  return { day: m?.[1] !== "night", code: m?.[2] || "skc" };
}

// Material Symbols names, restricted to the glyphs present in the
// master's subset icon font (the same set the master weather route
// maps into, minus the names the subset does not carry).
export function iconFor(code, day = true) {
  const c = (code || "").toLowerCase();
  if (/^skc|hot|clear/.test(c)) return day ? "sunny" : "bedtime";
  if (/^few|sct|partly/.test(c)) return day ? "partly_cloudy_day" : "partly_cloudy_night";
  if (/^bkn|ovc|cloudy|overcast/.test(c)) return "cloud";
  if (/^rain|fzra|mix|shower/.test(c)) return "rainy";
  if (/^snow|blizzard|cold|sleet|flurr/.test(c)) return "ac_unit";
  if (/^tsra|thunder/.test(c)) return "thunderstorm";
  if (/^fog|haze/.test(c)) return "foggy";
  if (/^wind|dust|smoke/.test(c)) return "warning";
  return day ? "sunny" : "bedtime";
}

async function fetchForecast(lat, lon) {
  const grid = await getGrid(lat, lon);
  const [dRes, hRes] = await Promise.all([
    fetch(grid.forecastUrl, { headers: { "User-Agent": UA, Accept: "application/geo+json" }, next: { revalidate: 900 }, signal: AbortSignal.timeout(10000) }),
    fetch(grid.hourlyUrl, { headers: { "User-Agent": UA, Accept: "application/geo+json" }, next: { revalidate: 900 }, signal: AbortSignal.timeout(10000) }),
  ]);
  if (!dRes.ok) throw new Error(`NWS forecast returned ${dRes.status}`);
  const daily = await dRes.json();
  const hourlyData = hRes.ok ? await hRes.json() : { properties: { periods: [] } };
  const dPeriods = daily.properties?.periods || [];
  const hPeriods = hourlyData.properties?.periods || [];
  const days = [];
  for (let i = 0; i < dPeriods.length; i += 2) {
    const day = dPeriods[i];
    const night = dPeriods[i + 1];
    if (!day) break;
    const dayPart = day.isDaytime ? day : night;
    const nightPart = day.isDaytime ? night : day;
    const src = dayPart || nightPart;
    if (!src) continue;
    const { day: isDay, code } = parseIcon(src.icon);
    days.push({
      name: src.name,
      highF: dayPart ? dayPart.temperature : null,
      lowF: nightPart ? nightPart.temperature : null,
      shortForecast: src.shortForecast || "",
      detailedForecast: src.detailedForecast || "",
      windSpeed: src.windSpeed || "",
      windDirection: src.windDirection || "",
      precipChance: src.probabilityOfPrecipitation?.value ?? null,
      icon: iconFor(code, isDay),
    });
    if (days.length >= 7) break;
  }
  const hourly = hPeriods.slice(0, 24).map((p) => {
    const { day: isDay, code } = parseIcon(p.icon);
    return {
      time: p.startTime,
      tempF: p.temperature ?? null,
      shortForecast: p.shortForecast || "",
      windSpeed: p.windSpeed || "",
      precipChance: p.probabilityOfPrecipitation?.value ?? null,
      icon: iconFor(code, isDay),
    };
  });
  const current = hourly[0]
    ? { tempF: hourly[0].tempF, shortForecast: hourly[0].shortForecast, icon: hourly[0].icon, windSpeed: hourly[0].windSpeed }
    : null;
  return { current, hourly, days, updatedAt: daily.properties?.updated || null };
}

// Full forecast for one town page, with the master's two layer
// cache discipline (fetch revalidate plus a short in memory cache
// with inflight dedupe).
export async function getTownWeather(town) {
  const key = town.slug;
  const now = Date.now();
  if (forecastCache.promise && forecastCache.key === key && now - forecastCache.at < CACHE_MS) {
    try { return await forecastCache.promise; } catch { return null; }
  }
  const promise = fetchForecast(town.lat, town.lon).catch(() => null);
  forecastCache = { at: now, promise, key };
  return promise;
}

// Lightweight current conditions for a set of points, used by the
// homepage and segment weather strips. One read per point, all in
// parallel, each degrading independently.
export async function getPointWeather(points) {
  const results = await Promise.allSettled(points.map((p) => fetchForecast(p.lat, p.lon)));
  return points.map((p, i) => {
    const r = results[i];
    if (r.status !== "fulfilled" || !r.value) {
      return { ...p, tempF: null, label: "Conditions unavailable", icon: "cloud", highF: null, lowF: null };
    }
    const v = r.value;
    return {
      ...p,
      tempF: v.current?.tempF ?? null,
      label: v.current?.shortForecast || "Conditions unavailable",
      icon: v.current?.icon || "cloud",
      highF: v.days[0]?.highF ?? null,
      lowF: v.days[0]?.lowF ?? null,
    };
  });
}
