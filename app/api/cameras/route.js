// Cameras API, in the master's /api/cameras shape: a { cameras }
// payload with the master's CDN cache headers. The inventory is
// the bundled 511 Virginia registry snapshot (lib/cameras.json), never a
// live agency call, per the network API usage discipline. Still
// URLs are the agency's own public image addresses and carry no
// key.

import { CAMERAS } from "@/lib/cameras";

export const dynamic = "force-dynamic";

export async function GET() {
  const cameras = CAMERAS.map((c) => ({
    slug: c.slug,
    name: c.name,
    location: c.location,
    imageUrl: c.imageUrl,
    nearestMilepostMarker: c.nearestMilepostMarker,
    elevationFt: c.elevationFt,
    latitude: c.latitude,
    longitude: c.longitude,
    segment: c.segmentName,
    url: `/cameras/${c.slug}`,
  }));
  return Response.json(
    { cameras },
    {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
