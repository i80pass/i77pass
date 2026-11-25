// TEMPORARY launch diagnostic: reports how the VDOT dataset fetches
// behave from inside the production runtime. Remove after launch.
export const dynamic = "force-dynamic";

const UA = "i77pass.com/1.0 (contact@i77pass.com)";
const URLS = {
  events:
    "https://data.511-atis-ttrip-prod.iteriscloud.com/datasets/icons/incidents_wz.json",
  minor:
    "https://data.511-atis-ttrip-prod.iteriscloud.com/datasets/incidentUnfiltered/minor_incidents.geojson",
  signs: "https://511.vdot.virginia.gov/services/511/map/layers/map/dms",
  roadConditions:
    "https://data.511-atis-ttrip-prod.iteriscloud.com/datasets/roadCondition/road_conditions_table.json",
};

async function probe(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    const text = await res.text();
    let parsed = null;
    try {
      const j = JSON.parse(text);
      parsed = Array.isArray(j) ? `array(${j.length})` : `object(${Object.keys(j).length} keys)`;
    } catch (e) {
      parsed = `parse error: ${e.message}`;
    }
    return {
      status: res.status,
      ms: Date.now() - t0,
      bytes: text.length,
      contentType: res.headers.get("content-type"),
      parsed,
      head: text.slice(0, 120),
    };
  } catch (e) {
    return { error: `${e.name}: ${e.message}`, cause: e.cause ? `${e.cause.name || ""} ${e.cause.message || ""} ${e.cause.code || ""}`.trim() : null, ms: Date.now() - t0 };
  }
}

export async function GET() {
  const out = {};
  for (const [k, u] of Object.entries(URLS)) out[k] = await probe(u);
  return Response.json({ at: new Date().toISOString(), region: process.env.AWS_REGION || null, out });
}
