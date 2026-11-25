// Status history API, in the master's /api/history shape:
// { enabled, days } with the master's CDN cache headers. The
// history logger (scripts/log-status.mjs) starts at launch, so
// until it has run, enabled is false and days is empty: the honest
// empty state, never backfilled.

import { getHistoryEntries } from "@/lib/history";

export const dynamic = "force-dynamic";

export async function GET() {
  const { enabled, entries } = getHistoryEntries(500);
  const byDay = new Map();
  for (const e of entries) {
    const day = String(e.at || "").slice(0, 10);
    if (!day) continue;
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(e);
  }
  const days = [...byDay.entries()].map(([date, items]) => ({ date, entries: items }));
  return Response.json(
    { enabled, days },
    {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
