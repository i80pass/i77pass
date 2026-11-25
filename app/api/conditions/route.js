// Conditions API, in the master's /api/conditions shape: a JSON
// read of the corridor verdict with a fresh lastUpdated stamp and
// the master's CDN cache headers. Unlike the master's route (a
// mock with hardcoded statuses, flagged in the master inventory),
// this route serves the real VDOT layer: when the feed is not
// answering it returns the honest unavailable state, and it
// never invents a status.

import { getCorridor } from "@/lib/feeds";
import { SEGMENTS } from "@/lib/segments";

export const dynamic = "force-dynamic";

export async function GET() {
  const corridor = await getCorridor();
  const conditions = SEGMENTS.map((meta) => {
    const seg = corridor.segments[meta.key];
    return {
      segment: meta.slug,
      name: meta.name,
      mileposts: `${meta.mpFrom} to ${meta.mpTo}`,
      status: seg.statusWord,
      statusLine: seg.statusLine,
      closed: seg.closed,
      restricted: seg.restricted,
      events: seg.events.length,
    };
  });
  return Response.json(
    {
      configured: corridor.configured,
      ok: corridor.ok,
      corridor: corridor.combined.statusWord,
      conditions,
      signs: corridor.signs,
      alerts: corridor.alerts,
      lastUpdated: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
