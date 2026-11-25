#!/usr/bin/env node
// Status history logger for i77pass.com, the Gold Standard
// scripts/log-status.mjs pattern.
//
// Reads the corridor's segment verdicts from the published VDOT
// 511 Virginia datasets (keyless: the incidents and work zones
// dataset plus the minor incidents GeoJSON, the same reads
// lib/feeds.js makes), builds a status signature per segment,
// and appends one JSON line to data/status-log.jsonl ONLY when a
// signature changes. The first run records the baseline. The
// runner is scheduled at launch (hourly); the public
// /status-history page renders the honest empty state until real
// entries exist.
//
// Verdict rules match lib/feeds.js: a full closure event means
// CLOSED, any other event with a posted restriction, a lane
// closure, a weather posting, or a high severity posting means
// RESTRICTED, otherwise OPEN. This corridor has no chain
// controls, so no chain signature exists here. If both datasets
// fail to answer, the logger exits quietly without writing
// anything, because an unavailable read is not a status.
//
// Run: node scripts/log-status.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOG = path.join(ROOT, "data", "status-log.jsonl");
const UA = "i77pass.com/1.0 (contact@i77pass.com)";

const EVENTS_URL =
  "https://data.511-atis-ttrip-prod.iteriscloud.com/datasets/icons/incidents_wz.json";
const MINOR_URL =
  "https://data.511-atis-ttrip-prod.iteriscloud.com/datasets/incidentUnfiltered/minor_incidents.geojson";

// Milepost bands matching lib/segments.js.
const SEGMENTS = [
  { slug: "state-line-to-lambsburg", lo: 0, hi: 4.5 },
  { slug: "lambsburg-to-fancy-gap", lo: 4.5, hi: 9 },
  { slug: "fancy-gap-to-hillsville", lo: 9, hi: 15.6 },
];

function segmentForMp(mp) {
  if (mp == null || !Number.isFinite(mp)) return null;
  return SEGMENTS.find((s) => mp >= s.lo && mp < s.hi) || SEGMENTS[SEGMENTS.length - 1];
}

function classify(description, label) {
  const d = String(description || "");
  const l = String(label || "");
  const rampOnly = /\bramp\b/i.test(d) && !/mainline|travel lanes/i.test(d);
  const full =
    !rampOnly &&
    (/road closed|roadway closed|all lanes closed|both directions closed|interstate (?:is )?closed/i.test(d) ||
      /\b(?:northbound|southbound|north|south) (?:is )?closed\b/i.test(d) ||
      /full closure/i.test(l));
  if (full) return "CLOSED";
  const restricted =
    /lane[s]? closed|lanes blocked|lane blocked|shoulder closed|road work|construction|maintenance/i.test(d) ||
    /WZ|work zone|construction/i.test(l) ||
    /fog|snow|ice on|flooding|high wind/i.test(d) ||
    /weather|snow|ice|fog|flood|wind|storm/i.test(l) ||
    /restriction|advisory|variable speed|reduced speed/i.test(d);
  return restricted ? "RESTRICTED" : "OPEN";
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`feed returned ${res.status}`);
  return res.json();
}

async function main() {
  const [mainData, minorData] = await Promise.all([
    fetchJson(EVENTS_URL).catch(() => null),
    fetchJson(MINOR_URL).catch(() => null),
  ]);
  if (mainData == null && minorData == null) {
    console.log("[log-status] VDOT datasets did not answer; nothing recorded.");
    return;
  }
  const signatures = {};
  for (const s of SEGMENTS) signatures[s.slug] = "OPEN";
  const rank = { OPEN: 0, RESTRICTED: 2, CLOSED: 3 };
  const apply = (mp, sig) => {
    const seg = segmentForMp(mp);
    if (!seg) return;
    if (rank[sig] > rank[signatures[seg.slug]]) signatures[seg.slug] = sig;
  };
  if (mainData && typeof mainData === "object") {
    for (const raw of Object.values(mainData)) {
      const route = String(raw?.route || "").toUpperCase().replace(/\s+/g, "");
      if (!/^I-?77[NS]?$/.test(route)) continue;
      const mp = Number(raw?.mrm);
      if (!Number.isFinite(mp) || mp < 0 || mp > 15.6) continue;
      apply(mp, classify(raw?.description, raw?.label));
    }
  }
  if (minorData && Array.isArray(minorData.features)) {
    for (const f of minorData.features) {
      const p = f?.properties || {};
      const route = String(p.route || "").toUpperCase().replace(/\s+/g, "");
      if (!/^I-?77[NS]?$/.test(route)) continue;
      const mp = Number(p.mrm);
      if (!Number.isFinite(mp) || mp < 0 || mp > 15.6) continue;
      apply(mp, classify(p.message_511 || p.location, p.type));
    }
  }

  let last = null;
  if (fs.existsSync(LOG)) {
    const lines = fs.readFileSync(LOG, "utf8").split("\n").filter(Boolean);
    if (lines.length) {
      try { last = JSON.parse(lines[lines.length - 1]); } catch { last = null; }
    }
  }
  const same = last && SEGMENTS.every((s) => last.segments?.[s.slug] === signatures[s.slug]);
  if (same) {
    console.log("[log-status] no signature change; nothing appended.");
    return;
  }
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  const entry = { at: new Date().toISOString(), segments: signatures };
  fs.appendFileSync(LOG, JSON.stringify(entry) + "\n");
  console.log(`[log-status] recorded: ${JSON.stringify(signatures)}`);
}

main().catch((err) => {
  console.error("[log-status] failed", err);
  process.exit(1);
});
