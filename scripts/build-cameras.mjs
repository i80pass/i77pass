#!/usr/bin/env node
// Build lib/cameras.json for i77pass.com from the live VDOT 511
// camera layer (keyless, published by VDOT's own 511 Virginia
// platform). Corridor: I-77 mileposts 0 to 15.6, the Fancy Gap
// climb, North Carolina line to north of Hillsville's Exit 14.
// Stills and streams are hot linked from VDOT servers with
// credit; nothing is downloaded or rehosted.
//
// Run: node scripts/build-cameras.mjs
// Writes lib/cameras.json only when the registry answers with a
// plausible corridor set (10 or more cameras); otherwise it
// leaves the snapshot unchanged and exits non-zero.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "lib", "cameras.json");
const URL = "https://511.vdot.virginia.gov/services/511/map/layers/map/cams";
const UA = "i77pass.com/1.0 (contact@i77pass.com)";

const SEGMENTS = [
  { key: 1, slug: "state-line-to-lambsburg", name: "North Carolina Line to Lambsburg", lo: 0.0, hi: 4.5 },
  { key: 2, slug: "lambsburg-to-fancy-gap", name: "Lambsburg to Fancy Gap", lo: 4.5, hi: 9.0 },
  { key: 3, slug: "fancy-gap-to-hillsville", name: "Fancy Gap to Hillsville", lo: 9.0, hi: 15.6 },
];
const TOWNS = [["Lambsburg", 1.0], ["Fancy Gap", 8.0], ["Hillsville", 14.0]];

function segFor(mp) {
  for (const s of SEGMENTS) if (mp >= s.lo && mp < s.hi) return s;
  return SEGMENTS[SEGMENTS.length - 1];
}
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
const fmtMp = (mp) => String(Number(mp.toFixed(1)));

async function main() {
  const res = await fetch(URL, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) {
    console.error(`[build-cameras] registry returned ${res.status}; snapshot unchanged.`);
    process.exit(1);
  }
  const data = await res.json();
  const cams = [];
  for (const f of data.features || []) {
    const p = f.properties || {};
    if (String(p.route || "").trim().toUpperCase() !== "I-77") continue;
    const desc = String(p.description || "");
    if (desc.includes("WV MM")) continue;
    const coords = f.geometry?.coordinates || [];
    const lon = Number(coords[0]);
    const lat = Number(coords[1]);
    if (!(lat >= 36.54 && lat <= 36.76)) continue;
    const m = desc.match(/MM\s+(\d+(?:\.\d+)?)/);
    if (!m) continue;
    const mp = parseFloat(m[1]);
    if (!(mp >= 0 && mp <= 15.6)) continue;
    const dirRaw = String(p.direction || "").trim();
    const direction = { NB: "Northbound", SB: "Southbound", Median: "Median" }[dirRaw] || dirRaw || null;
    const mpLabel = fmtMp(mp);
    const name = `I-77 at Milepost ${mpLabel}` + (direction && direction !== "Median" ? `, ${direction}` : direction === "Median" ? ", Median" : "");
    const seg = segFor(mp);
    const [town, townMp] = TOWNS.reduce((a, b) => (Math.abs(b[1] - mp) < Math.abs(a[1] - mp) ? b : a), TOWNS[0]);
    cams.push({
      registryId: Number(p.id),
      slug: slugify(`i77-mm${mpLabel}-${dirRaw || "cam"}`),
      name,
      location: name,
      roadway: "I-77",
      milepost: mp,
      nearestMilepostMarker: mp,
      markerDistanceMiles: null,
      direction,
      latitude: lat,
      longitude: lon,
      imageUrl: p.image_url || null,
      videoUrl: p.https_url || null,
      source: "VDOT",
      segment: seg.key,
      segmentSlug: seg.slug,
      segmentName: seg.name,
      elevationFt: null,
      nearestTown: town,
      nearestTownMiles: Math.round(Math.abs(mp - townMp) * 10) / 10,
    });
  }
  cams.sort((a, b) => a.milepost - b.milepost);
  if (cams.length < 10) {
    console.error(`[build-cameras] only ${cams.length} corridor cameras returned; snapshot unchanged.`);
    process.exit(1);
  }
  const n = cams.length;
  cams.forEach((c, i) => {
    const prev = i > 0 ? cams[i - 1] : null;
    const next = i < n - 1 ? cams[i + 1] : null;
    const mpLabel = fmtMp(c.milepost);
    c.index = i + 1;
    c.prevSlug = prev ? prev.slug : null;
    c.nextSlug = next ? next.slug : null;
    c.prevName = prev ? prev.name : null;
    c.nextName = next ? next.name : null;
    c.prevMiles = prev ? Math.round((c.milepost - prev.milepost) * 10) / 10 : null;
    c.nextMiles = next ? Math.round((next.milepost - c.milepost) * 10) / 10 : null;
    c.caption = `${c.name} webcam on Interstate 77, near milepost marker ${mpLabel}, ${c.segmentName} segment. Still image from VDOT via 511 Virginia.`;
    const about1 = `The ${c.name} camera is camera ${i + 1} of ${n} on this corridor's registry snapshot, standing on the ${c.segmentName} segment of Interstate 77, near milepost marker ${mpLabel}. The nearest town is ${c.nearestTown}, about ${c.nearestTownMiles} miles away by milepost. The still above is published by the Virginia Department of Transportation through 511 Virginia and is served live from the agency feed on every view; this site hot links it with credit and never stores or rehosts camera image files.`;
    const about2 = c.imageUrl
      ? "Read this frame together with the segment status banner on this page. On this mountain the camera is the fog report: if the frame is white or grey, visibility on the climb is gone at this milepost whatever the forecast said. The banner carries the segment's live verdict from the state event feed, which is the word on closures and restrictions."
      : "The agency feed currently lists this camera's image as unavailable, so this page shows the camera by name with an unavailable notice instead of a frame. The feed restores the image address when the camera streams again, and this snapshot picks it up on the next refresh. The segment status banner on this page carries the live verdict from the state event feed in the meantime.";
    c.about = [about1, about2];
    const neigh = prev && next
      ? `South (toward the North Carolina line) is the ${prev.name} camera. North (toward Hillsville) is the ${next.name} camera. Both are linked at the bottom of this page.`
      : next
        ? `This is the southernmost camera in the snapshot, at the foot of the climb. North (toward Hillsville) is the ${next.name} camera, linked at the bottom of this page.`
        : `This is the northernmost camera in the snapshot. South (toward the North Carolina line) is the ${prev.name} camera, linked at the bottom of this page.`;
    c.faqs = [
      { q: `What does the ${c.name} camera show?`, a: `The current VDOT via 511 Virginia still at ${c.name} on Interstate 77, on the ${c.segmentName} segment near milepost marker ${mpLabel}. Most corridor cameras also stream live video on 511 Virginia; this page carries the still, refreshed by the agency.` },
      { q: "Is this camera image live?", a: "It is the agency's current published still, served from the agency feed on every view. Refresh timing is the agency's; on Fancy Gap, read the frame for fog first, then read the segment verdict, which comes from the live event feed." },
      { q: "Where are the cameras on either side of this one?", a: neigh },
    ];
  });
  fs.writeFileSync(OUT, JSON.stringify(cams, null, 1) + "\n");
  console.log(`[build-cameras] wrote ${n} cameras to lib/cameras.json`);
}

main().catch((err) => {
  console.error("[build-cameras] failed", err);
  process.exit(1);
});
