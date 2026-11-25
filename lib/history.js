// Status history wiring for i77pass.com.
//
// The status history logger is scripts/log-status.mjs: it reads
// the corridor verdict from the VDOT layer, builds a signature
// per segment, and appends a JSON line to data/status-log.jsonl
// only when a signature changes (baseline on first run). The
// runner is scheduled at launch, not during the build, so until
// entries exist this module reports the honest empty state and
// /status-history renders it as such. Nothing is backfilled and
// nothing is invented.
//
// This follows the newest sister's approach to the history wiring:
// no hosted database pointer is carried over from the master, no
// table name, no credentials. The log is a file the logger owns.

import fs from "node:fs";
import path from "node:path";

export function historyEnabled() {
  try {
    return fs.existsSync(path.join(process.cwd(), "data", "status-log.jsonl"));
  } catch {
    return false;
  }
}

export function getHistoryEntries(limit = 200) {
  try {
    const file = path.join(process.cwd(), "data", "status-log.jsonl");
    if (!fs.existsSync(file)) return { enabled: false, entries: [] };
    const lines = fs.readFileSync(file, "utf8").split("\n").filter(Boolean);
    const entries = lines
      .map((line) => {
        try { return JSON.parse(line); } catch { return null; }
      })
      .filter(Boolean)
      .slice(-limit)
      .reverse();
    return { enabled: true, entries };
  } catch {
    return { enabled: false, entries: [] };
  }
}
