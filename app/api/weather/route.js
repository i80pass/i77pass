// Weather API, in the i80pass master's /api/weather shape: lat
// and lon query params, the NWS grid resolved through
// api.weather.gov/points and cached in memory for the life of the
// process, hourly (24) and daily forecasts fetched with next
// revalidate 900, sunrise and sunset computed locally, and the
// master's CDN cache headers. Icon names are the subset safe
// Material Symbols names from lib/weather.js. The corridor is
// in the Eastern time zone, so the sun times use the
// America/New_York offset for the date, daylight saving included.

import { NextResponse } from "next/server";
import { iconFor } from "@/lib/weather";

const gridCache = new Map();
const UA = "i77pass.com/1.0 (contact@i77pass.com)";

async function getGrid(lat, lon) {
  const key = `${lat},${lon}`;
  if (gridCache.has(key)) return gridCache.get(key);
  const res = await fetch(`https://api.weather.gov/points/${lat},${lon}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) throw new Error("NWS points failed");
  const d = await res.json();
  const result = { forecastUrl: d.properties.forecast, hourlyUrl: d.properties.forecastHourly };
  gridCache.set(key, result);
  return result;
}

function parseIcon(url = "") {
  const m = String(url).match(/icons\/land\/(day|night)\/([^,?/]+)/);
  return { day: m?.[1] !== "night", code: m?.[2] || "skc" };
}

function sunTimes(lat, lon) {
  const now = new Date();
  const toR = (d) => (d * Math.PI) / 180;
  const D = Math.round((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const B = toR((360 / 365) * (D - 81));
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const TC = 4 * lon + EoT;
  const noon = 720 - TC;
  const decl = toR(23.45 * Math.sin(B));
  const cosH = -Math.tan(toR(lat)) * Math.tan(decl);
  if (Math.abs(cosH) > 1) return { sunrise: "--", sunset: "--" };
  const H = (Math.acos(cosH) * 180) / Math.PI;
  // Eastern offset in minutes for today, DST aware.
  const tzName = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", timeZoneName: "shortOffset" }).format(now);
  const m = tzName.match(/GMT([+-]\d+)(?::(\d+))?/);
  const etOff = m ? (Number(m[1]) * 60 + (m[1].startsWith("-") ? -1 : 1) * Number(m[2] || 0)) : -5 * 60;
  const fmt = (m2) => {
    const t = (((m2 + etOff) % 1440) + 1440) % 1440;
    const h = Math.floor(t / 60), min = Math.floor(t % 60);
    return `${h % 12 || 12}:${min.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };
  return { sunrise: fmt(noon - H * 4), sunset: fmt(noon + H * 4) };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  if (!lat || !lon) return NextResponse.json({ error: "lat/lon required" }, { status: 400 });

  try {
    const grid = await getGrid(lat, lon);
    const [hRes, dRes] = await Promise.all([
      fetch(grid.hourlyUrl, { headers: { "User-Agent": UA }, next: { revalidate: 900 } }),
      fetch(grid.forecastUrl, { headers: { "User-Agent": UA }, next: { revalidate: 900 } }),
    ]);
    const [hData, dData] = await Promise.all([hRes.json(), dRes.json()]);

    const hPeriods = hData.properties.periods;
    const dPeriods = dData.properties.periods;

    const hourly = hPeriods.slice(0, 24).map((p) => {
      const { day, code } = parseIcon(p.icon);
      return {
        time: p.startTime,
        temp: p.temperature,
        icon: iconFor(code, day),
        shortForecast: p.shortForecast,
        windSpeed: p.windSpeed,
        humidity: p.relativeHumidity?.value ?? null,
      };
    });

    const todayDay = dPeriods.find((p) => p.isDaytime);
    const todayNight = dPeriods.find((p) => !p.isDaytime);

    const daily = [];
    for (let i = 0; i < dPeriods.length && daily.length < 6; i++) {
      const p = dPeriods[i];
      if (!p.isDaytime) continue;
      const night = dPeriods[i + 1];
      const { day, code } = parseIcon(p.icon);
      daily.push({
        name: p.name,
        high: p.temperature,
        low: night?.temperature ?? null,
        icon: iconFor(code, day),
        shortForecast: p.shortForecast,
      });
    }

    const cur = hourly[0];
    const sun = sunTimes(Number(lat), Number(lon));

    return NextResponse.json(
      {
        current: {
          temp: cur.temp,
          icon: cur.icon,
          shortForecast: cur.shortForecast,
          high: todayDay?.temperature ?? null,
          low: todayNight?.temperature ?? null,
          windSpeed: cur.windSpeed,
          humidity: cur.humidity,
          sunrise: sun.sunrise,
          sunset: sun.sunset,
        },
        hourly,
        daily,
      },
      { headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=1800" } }
    );
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
