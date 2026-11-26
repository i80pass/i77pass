// Data layer for i77pass.com (Interstate 77, North Carolina line
// to Hillsville, Virginia, over Fancy Gap).
//
// AGENCY: the Virginia Department of Transportation (VDOT) via
// 511 Virginia, https://511.vdot.virginia.gov.
//
// FEED SHAPE (researched live Nov 25, 2026; full notes in the
// project FEED-NOTES.md): VDOT publishes no developer API program
// and no key. Its own 511 Virginia platform (an Iteris TTRIP
// deployment) serves the same datasets its public map and tables
// render from open, keyless addresses, and this layer reads those
// published datasets server side only:
//   Events and work zones: the incidents_wz dataset on VDOT's
//     data host (an object keyed by event id; fields description,
//     jurisdiction, location, route in the form "I-77S", mrm as a
//     string, label, update_time in Unix seconds, coords1 and
//     coords2 as [lon, lat]).
//   Minor incidents: the incidentUnfiltered minor incidents
//     GeoJSON on the same host (properties icon, priority, route
//     in the form "I-77N", mrm as a number, type, location,
//     message_511, id; point geometry).
//   Message signs: the dms map layer on the 511 host (GeoJSON;
//     properties sign_type, DMS_id, DMS_name, text, route, dir,
//     mrm; point geometry). An empty text means the sign is
//     blank; blank signs are never shown.
//   County road conditions: the road_conditions_table dataset
//     (an object keyed by county and city names; an empty object
//     means the county has filed no report, which is missing
//     data, not a clear road).
//   Cameras: inventories come from the bundled snapshot in
//     lib/cameras.json, refreshed by scripts/build-cameras.mjs
//     from the cams map layer on the 511 host, never from a live
//     call during a render. Still URLs are VDOT's own addresses,
//     hot linked per view with credit to VDOT, never stored or
//     rehosted.
//
// THROTTLE: VDOT publishes no rate limit for these datasets. This
// layer polls politely anyway: one call per dataset, server side
// only, every response cached (see the caching contract below),
// far slower than the 511 site's own refresh.
//
// FIELD MAP (from live responses, Nov 25, 2026):
//   incidents_wz record: description (full public sentence text,
//     includes road, county, mile marker, times, and lane
//     effects), route ("I-77S" style: route plus direction
//     letter), mrm (string milepost, can be empty), label (a
//     dash joined classification, for example "Planned Event -
//     WZ - ..." for work zones), update_time (Unix seconds),
//     coords1/coords2 ([lon, lat] ends of the event).
//   minor incident feature: type (for example "Disabled
//     Vehicle", "Crash"), priority ("Minor" seen; higher values
//     treated as severity signals), message_511 (the public
//     sentence), route, mrm, location.
//   Units: neither dataset publishes temperatures. Weather on
//     this site comes from the National Weather Service
//     (lib/weather.js), Fahrenheit native.
//
// CACHING CONTRACT (the master data layer pattern, with the cache
// floor set to the Gold Standard Phase 2 discipline):
//   Layer 1, Next.js fetch cache: every agency fetch uses next
//     revalidate 300 seconds, an AbortSignal timeout, and the site
//     User-Agent below.
//   Layer 2, in memory stale while revalidate: a module Map plus
//     an inflight Map for dedupe. A fresh hit returns instantly, a
//     stale hit returns instantly and refreshes in the background,
//     concurrent renders share one outbound request, and on an
//     upstream error the stale copy (or a cached negative result)
//     is served. Negative results are cached only briefly (30
//     seconds), so a transient failure recovers on the next
//     render instead of poisoning the process; every read also
//     retries with backoff before it is allowed to fail. No
//     fallback chain ever fires a second endpoint when the first
//     call returns empty or errors.
//
// VERDICT LOGIC: Virginia has NO chain control system. There are
// no chain tiers anywhere in this file or on this site, and none
// are ever derived. A segment is CLOSED when a feed event on it
// is a full closure. It is RESTRICTED when it carries any other
// event with a posted restriction, a lane closure, a weather
// posting (fog above all on this mountain), or a high severity
// posting. Otherwise it is OPEN. With no feed or no data the
// verdict is the honest STATUS UNAVAILABLE fallback, never a
// guessed OPEN.
// FAIL CLOSED RULE (network standard, Nov 19, 2026): an OPEN
// verdict requires a successful events read. If both event
// datasets fail to answer, the corridor verdict is STATUS
// UNAVAILABLE, even if the signs read answered. A failed read of
// the closure source must never render as an empty road.

import { SEGMENTS, segmentForLat, segmentForMilepost } from "./segments";

const UA = "i77pass.com/1.0 (contact@i77pass.com)";
const FEED_REVALIDATE = 300;
const TTL_MS = 300_000;
// A failed read is cached only briefly. A transient upstream
// failure (a dropped connection or a slow first answer from a
// cold region) must not poison this process for the full TTL:
// the next render retries within half a minute instead of
// serving the failure for five.
const NEG_TTL_MS = 30_000;
// STALENESS GUARD (status audit, Nov 25, 2026): cached data may be
// served while it revalidates only up to this age. Beyond it, a
// verdict built on the copy would be stale, so cachedFetch waits
// for a real refresh and fails closed (null, which renders STATUS
// UNAVAILABLE) when the refresh cannot answer. Cap: 60 minutes,
// the network standard for this guard.
const STALE_MAX_MS = 3_600_000;
const TIMEOUT_MS = 20_000;
const FETCH_ATTEMPTS = 3;

const EVENTS_URL =
  "https://data.511-atis-ttrip-prod.iteriscloud.com/datasets/icons/incidents_wz.json";
const MINOR_INCIDENTS_URL =
  "https://data.511-atis-ttrip-prod.iteriscloud.com/datasets/incidentUnfiltered/minor_incidents.geojson";
const SIGNS_URL = "https://511.vdot.virginia.gov/services/511/map/layers/map/dms";
const ROAD_CONDITIONS_URL =
  "https://data.511-atis-ttrip-prod.iteriscloud.com/datasets/roadCondition/road_conditions_table.json";

// Corridor box: the Fancy Gap climb and the Hillsville plateau.
const CORRIDOR = { latMin: 36.5, latMax: 36.82, lonMin: -80.85, lonMax: -80.6, mpMin: 0, mpMax: 15.6 };

// Text cleaning, the same job the master splits across its feed
// parsers: agency strings pass through here before render, so live
// feed text can never put a banned character (em dash, en dash, or
// their HTML entities), raw HTML, or sloppy whitespace on a page.
export function cleanText(value) {
  if (value == null) return "";
  let t = String(value);
  t = t.replace(/&(?:mdash|ndash);|&#(?:8212|8211);|&#x(?:2014|2013);/gi, ", ");
  t = t.replace(/[\u2014\u2013]/g, ", ");
  t = t.replace(/<[^>]*>/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

export function vaConfigured() {
  return true; // keyless published datasets; kept for interface parity
}

const _cache = new Map();
const _inflight = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// One dataset read with retries. The production failure this
// guards against: a cold server process whose first upstream
// reads fail or time out while the same datasets answer fine
// seconds later, which used to bake STATUS UNAVAILABLE into
// every page the process rendered. A single read now retries
// with backoff before it is allowed to fail, and a 4xx answer
// (a genuinely wrong address) fails fast instead of retrying.
async function doFetch(url) {
  let lastErr = null;
  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: FEED_REVALIDATE },
        headers: { "User-Agent": UA, Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) {
        console.error(`[feeds] ${url} returned HTTP ${res.status} (attempt ${attempt})`);
        throw new Error(`feed returned ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (/feed returned 4\d\d/.test(err?.message || "")) break;
      if (attempt < FETCH_ATTEMPTS) await sleep(attempt === 1 ? 600 : 1800);
    }
  }
  throw lastErr || new Error("feed fetch failed");
}

// Layer 2: in memory stale while revalidate with inflight dedupe,
// following the master's cachedFetch shape. Returns null on a
// cached negative result or a failed first fetch.
async function cachedFetch(url, { ttl = TTL_MS } = {}) {
  const now = Date.now();
  const hit = _cache.get(url);
  if (hit && now - hit.at < (hit.neg ? NEG_TTL_MS : ttl)) return hit.value;
  // The guard: a positive hit older than STALE_MAX_MS is never
  // served. It falls through to a real refresh, and a failed
  // refresh returns null instead of the ancient copy.
  const servableHit = hit && (hit.neg || now - hit.at <= STALE_MAX_MS) ? hit : null;
  if (_inflight.has(url)) {
    const pending = _inflight.get(url);
    if (servableHit) {
      pending.catch(() => {});
      return servableHit.value;
    }
    try {
      return await pending;
    } catch {
      return servableHit ? servableHit.value : null;
    }
  }
  const promise = doFetch(url)
    .then((value) => {
      _cache.set(url, { at: Date.now(), value });
      _inflight.delete(url);
      return value;
    })
    .catch((err) => {
      _inflight.delete(url);
      console.error(`[feeds] fetch failed for ${url}: ${err && err.name} ${err && err.message}`);
      if (!hit) _cache.set(url, { at: Date.now(), value: null, neg: true });
      throw err;
    });
  _inflight.set(url, promise);
  if (servableHit) {
    promise.catch(() => {});
    return servableHit.value;
  }
  try {
    return await promise;
  } catch {
    return null;
  }
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function unixToDate(v) {
  const n = toNumber(v);
  if (n == null) return null;
  const d = new Date(n > 1e12 ? n : n * 1000);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Route labels arrive as "I-77S" or "I-77N" (route plus direction
// letter) on the events dataset and the same style on the minor
// incidents GeoJSON. Only Interstate 77 belongs to this corridor.
function parseRoute(route) {
  const r = cleanText(route || "").toUpperCase().replace(/\s+/g, "");
  const m = r.match(/^I-?77([NSEW])?$/);
  if (!m) return null;
  const dir = { N: "Northbound", S: "Southbound", E: "Eastbound", W: "Westbound" }[m[1]] || "";
  return { roadway: "I-77", direction: dir };
}

function segmentFor(mp, lat) {
  return segmentForMilepost(mp) || segmentForLat(lat);
}

function buildEvent(fields) {
  const seg = segmentFor(fields.milepost, fields.lat);
  const description = fields.description || "";
  const typeText = `${fields.type} ${fields.label}`;
  // Full closure: the description or label closes the road, a
  // direction, or all lanes outright. A lane or shoulder closure
  // ("1 right lane closed", "the south right shoulder is closed")
  // never counts here; those are restrictions. A ramp closure is
  // a restriction on the segment, not a closed mainline.
  const rampOnly = /\b(?:off-ramp|on-ramp|exit ramp|entrance ramp|ramp)\b/i.test(description) && !/mainline|travel lanes/i.test(description);
  const fullClosure =
    !rampOnly &&
    (/road closed|roadway closed|all lanes closed|both directions closed|interstate (?:is )?closed/i.test(description) ||
      /\b(?:northbound|southbound|north|south) (?:is )?closed\b/i.test(description) ||
      /full closure/i.test(typeText));
  const laneClosed =
    !fullClosure &&
    (/lane[s]? closed|lanes blocked|lane blocked|shoulder closed|road work|construction|maintenance/i.test(description) ||
      /WZ|work zone|construction/i.test(fields.label || ""));
  const isWeather = /weather|snow|ice|fog|flood|wind|storm/i.test(typeText) || /fog|snow|ice on|flooding|high wind/i.test(description);
  const fog = /fog/i.test(typeText) || /fog/i.test(description);
  const highSeverity = /major|severe|high|critical/i.test(fields.priority || "") || fullClosure;
  const hasRestrictions =
    laneClosed || fog || /restriction|advisory|variable speed|reduced speed|speed limit (?:reduced|lowered)/i.test(description);
  return {
    id: fields.id,
    source: "VDOT",
    type: fields.type || "",
    typeLabel: fields.typeLabel || fields.type || "Event",
    description,
    roadway: "I-77",
    direction: fields.direction || "",
    lat: fields.lat,
    lon: fields.lon,
    lanesAffected: fields.lanesAffected || "",
    isFullClosure: fullClosure,
    isWeather,
    severity: fields.priority || "",
    highSeverity,
    restrictions: fields.restrictions || "",
    hasRestrictions,
    laneClosed,
    reported: fields.reported || null,
    updated: fields.updated || null,
    segmentKey: seg ? seg.key : null,
    segmentSlug: seg ? seg.slug : null,
  };
}

// The main events dataset: incidents and work zones keyed by id.
async function fetchMainEvents() {
  const data = await cachedFetch(EVENTS_URL);
  if (!data || typeof data !== "object") return null;
  const out = [];
  for (const [id, raw] of Object.entries(data)) {
    const route = parseRoute(raw?.route);
    if (!route) continue;
    const mp = toNumber(raw?.mrm);
    const c1 = Array.isArray(raw?.coords1) ? raw.coords1 : null;
    const lon = c1 ? toNumber(c1[0]) : null;
    const lat = c1 ? toNumber(c1[1]) : null;
    if (mp != null && (mp < CORRIDOR.mpMin || mp > CORRIDOR.mpMax)) continue;
    if (mp == null && (lat == null || lat < CORRIDOR.latMin || lat > CORRIDOR.latMax)) continue;
    const label = cleanText(raw?.label || "");
    const labelParts = label.split(" - ").map((x) => x.trim()).filter(Boolean);
    const isWz = /WZ/i.test(label) || /work zone/i.test(label);
    const type = isWz ? "roadwork" : "accidentsAndIncidents";
    const typeLabel = labelParts.length > 1 ? labelParts[labelParts.length - 1] : isWz ? "Work zone" : "Incident";
    out.push(
      buildEvent({
        id: String(id),
        type,
        typeLabel,
        label,
        description: cleanText(raw?.description || ""),
        direction: route.direction,
        milepost: mp,
        lat,
        lon,
        priority: "",
        updated: unixToDate(raw?.update_time),
        reported: unixToDate(raw?.update_time),
      })
    );
  }
  return out;
}

// The minor incidents GeoJSON: disabled vehicles, minor crashes,
// debris. Same normalizer, lighter severity.
async function fetchMinorIncidents() {
  const data = await cachedFetch(MINOR_INCIDENTS_URL);
  if (!data || !Array.isArray(data.features)) return null;
  const out = [];
  for (const f of data.features) {
    const p = f?.properties || {};
    const route = parseRoute(p.route);
    if (!route) continue;
    const mp = toNumber(p.mrm);
    const coords = f?.geometry?.coordinates || [];
    const lon = toNumber(coords[0]);
    const lat = toNumber(coords[1]);
    if (mp != null && (mp < CORRIDOR.mpMin || mp > CORRIDOR.mpMax)) continue;
    if (mp == null && (lat == null || lat < CORRIDOR.latMin || lat > CORRIDOR.latMax)) continue;
    const type = cleanText(p.type || "Incident");
    out.push(
      buildEvent({
        id: String(p.id || f?.id || `${lat},${lon},${type}`),
        type: "accidentsAndIncidents",
        typeLabel: type,
        label: type,
        description: cleanText(p.message_511 || p.location || ""),
        direction: route.direction,
        milepost: mp,
        lat,
        lon,
        priority: cleanText(p.priority || ""),
      })
    );
  }
  return out;
}

// Corridor message signs from the dms map layer. Blank signs
// (empty text) are the physical sign showing nothing and are
// dropped, per the feed research rule.
async function fetchSigns() {
  const data = await cachedFetch(SIGNS_URL);
  if (!data || !Array.isArray(data.features)) return null;
  return data.features
    .map((f) => {
      const p = f?.properties || {};
      const route = parseRoute(p.route);
      if (!route) return null;
      const mp = toNumber(p.mrm);
      if (mp == null || mp < CORRIDOR.mpMin || mp > CORRIDOR.mpMax + 1) return null;
      const text = cleanText(p.text || "");
      if (!text) return null;
      const coords = f?.geometry?.coordinates || [];
      return {
        id: String(p.id || p.DMS_id || Math.random()),
        name: cleanText(p.DMS_name || "Message sign"),
        roadway: "I-77",
        messages: [text],
        lat: toNumber(coords[1]),
        lon: toNumber(coords[0]),
      };
    })
    .filter(Boolean);
}

// County road conditions for Carroll County (the corridor's
// county). An empty county object means no report filed; the
// caller surfaces that as no report, never as a clear road.
async function fetchRoadConditions() {
  const data = await cachedFetch(ROAD_CONDITIONS_URL);
  if (!data || typeof data !== "object") return null;
  const carroll = data["Carroll (County)"];
  if (!carroll || typeof carroll !== "object") return null;
  const lines = [];
  for (const [k, v] of Object.entries(carroll)) {
    if (v == null || v === "") continue;
    lines.push(`${cleanText(k)}: ${cleanText(typeof v === "object" ? JSON.stringify(v) : v)}`);
  }
  return lines;
}

function segmentVerdict(meta, events) {
  const closures = events.filter((e) => e.isFullClosure);
  const cautionEvents = events.filter(
    (e) => !e.isFullClosure && (e.hasRestrictions || e.laneClosed || e.isWeather || e.highSeverity)
  );
  const closed = closures.length > 0;
  const restricted = !closed && cautionEvents.length > 0;
  const rank = closed ? 3 : restricted ? 2 : 0;
  return {
    ...meta,
    ok: true,
    closed,
    restricted,
    rank,
    statusWord: closed ? "CLOSED" : restricted ? "RESTRICTED" : "OPEN",
    statusLine: closed
      ? `I-77 is closed on the ${meta.name} segment.`
      : restricted
        ? `Restrictions or events are posted on the ${meta.name} segment. Drive with care.`
        : `I-77 is open on the ${meta.name} segment with no closures or restrictions posted.`,
    events,
    closures,
    majors: cautionEvents,
  };
}

function unavailableVerdict(meta) {
  return {
    ...meta,
    ok: false,
    closed: false,
    restricted: false,
    rank: -1,
    statusWord: "STATUS UNAVAILABLE",
    statusLine:
      "The live VDOT feed for this segment is not answering, so no current status can be shown. Check 511 Virginia before you drive.",
    events: [],
    closures: [],
    majors: [],
  };
}

function unavailableCorridor(fetchedAt) {
  const segments = {};
  for (const s of SEGMENTS) segments[s.key] = unavailableVerdict(s);
  return {
    ok: false,
    configured: true,
    fetchedAt,
    segments,
    combined: { closed: false, restricted: false, rank: -1, statusWord: "STATUS UNAVAILABLE", events: [] },
    signs: [],
    stations: [],
    restAreas: [],
    alerts: [],
    roadConditions: null,
  };
}

// The corridor read: all three segments plus the combined verdict
// (worst segment decides, and the corridor only claims a verdict
// when the events read answered), message signs, and the county
// road conditions report. Never throws.
// FAIL CLOSED RULE: if both event datasets fail, every segment is
// unavailable, never open. If either answers, the corridor reads
// from what answered.
export async function getCorridor() {
  const fetchedAt = new Date();
  try {
    const [mainEvents, minorEvents, rawSigns, roadConditions] = await Promise.all([
      fetchMainEvents(),
      fetchMinorIncidents(),
      fetchSigns(),
      fetchRoadConditions(),
    ]);
    if (mainEvents == null && minorEvents == null) {
      return unavailableCorridor(fetchedAt);
    }
    // The stamp on a verdict is the time the data behind it was
    // actually fetched from VDOT (the cache time of the event
    // datasets that answered), never the render time. The guard
    // in cachedFetch bounds that age to STALE_MAX_MS.
    const dataTimes = [];
    if (mainEvents != null) { const t = _cache.get(EVENTS_URL)?.at; if (t) dataTimes.push(t); }
    if (minorEvents != null) { const t = _cache.get(MINOR_INCIDENTS_URL)?.at; if (t) dataTimes.push(t); }
    const dataFetchedAt = dataTimes.length ? new Date(Math.min(...dataTimes)) : fetchedAt;
    const allEvents = [...(mainEvents || []), ...(minorEvents || [])];
    const segments = {};
    for (const s of SEGMENTS) {
      segments[s.key] = { ...segmentVerdict(s, allEvents.filter((e) => e.segmentKey === s.key)), fetchedAt: dataFetchedAt };
    }
    const list = SEGMENTS.map((s) => segments[s.key]);
    const worst = list.reduce((a, b) => (b.rank > a.rank ? b : a), list[0]);
    const alerts = allEvents
      .filter((e) => e.isFullClosure || e.isWeather || e.highSeverity)
      .map((e) => ({ id: e.id, headline: e.typeLabel, description: e.description }));
    return {
      ok: true,
      configured: true,
      fetchedAt: dataFetchedAt,
      segments,
      combined: {
        ok: true,
        closed: list.some((s) => s.closed),
        restricted: list.some((s) => s.restricted),
        rank: worst.rank,
        statusWord: worst.statusWord,
        events: allEvents,
      },
      signs: rawSigns || [],
      stations: [],
      restAreas: [],
      alerts,
      roadConditions,
    };
  } catch (err) {
    console.error("[feeds] corridor fetch failed", err);
    return unavailableCorridor(fetchedAt);
  }
}

export async function getSegmentStatus(segmentKey) {
  const corridor = await getCorridor();
  return corridor.segments[segmentKey];
}
