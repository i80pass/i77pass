// The I-40 highway page, the master's highway page pattern: the
// anchor interstate's own page, owning the "I-40 road conditions"
// query cluster. Hero heading in the master's heading classes,
// verdict first, cameras directly under the verdict under the
// camera count rule, then the answer sentence and the segment
// stack, message signs and weather stations when the feed carries
// them, corridor facts, editorial, and FAQs.

import Link from "next/link";
import VerdictBar from "@/components/VerdictBar";
import SegmentRow from "@/components/SegmentRow";
import EventsList from "@/components/EventsList";
import CameraStrip from "@/components/CameraStrip";
import WeatherStrip from "@/components/WeatherStrip";
import FaqBlock from "@/components/FaqBlock";
import StormAlerts from "@/components/StormAlerts";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { getPointWeather } from "@/lib/weather";
import { SEGMENTS } from "@/lib/segments";
import { CAMERAS, CAMERA_COUNT } from "@/lib/cameras";
import { corridorStatusSentence } from "@/lib/verdict";
import { webPageSchema, faqSchema, roadConditionSchema, cameraListSchema, breadcrumbSchema, placeSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "I-40 Road Conditions: Interstate 40, Asheville to Knoxville | i40pass.com",
  description:
    "Interstate 40 road conditions for the Asheville to Knoxville corridor: live closures, restrictions, message signs, weather stations, and webcams through the Pigeon River Gorge, from DriveNC and TDOT SmartWay.",
  alternates: { canonical: siteUrl("/i-40") },
  openGraph: { title: "I-40 Road Conditions | i40pass.com", description: "Live Interstate 40 conditions, Asheville to Knoxville, from DriveNC and TDOT SmartWay.", images: ["/og-image.png"] },
};

const WEATHER_POINTS = [
  { name: "Asheville", slug: "asheville", lat: 35.5956, lon: -82.5547 },
  { name: "Waynesville", slug: "waynesville", lat: 35.4887, lon: -82.9884 },
  { name: "Newport", slug: "newport", lat: 35.967, lon: -83.1876 },
  { name: "Knoxville", slug: "knoxville", lat: 35.9606, lon: -83.9207 },
];

export default async function HighwayPage() {
  const [corridor, weather] = await Promise.all([getCorridor(), getPointWeather(WEATHER_POINTS)]);
  const segments = SEGMENTS.map((s) => corridor.segments[s.key]);
  const combined = {
    ...corridor.combined,
    name: "Interstate 40",
    statusLine:
      corridor.combined.statusWord === "STATUS UNAVAILABLE"
        ? (segments.find((s) => !s.ok) || segments[0]).statusLine
        : `Interstate 40, Asheville to Knoxville: ${corridor.combined.statusWord.toLowerCase()} based on the worst segment right now.`,
  };
  const sentence = corridorStatusSentence(corridor, segments);

  const faqs = [
    {
      q: "What are the road conditions on I-40 right now?",
      a: `${sentence} Segment by segment detail is in the stack on this page, and each segment page carries its own events, cameras, and weather.`,
    },
    {
      q: "How long is Interstate 40?",
      a: "About 2,555 miles coast to coast, from Barstow, California to Wilmington, North Carolina, the third longest interstate in the country. This site covers the mountain stretch where it crosses from North Carolina into Tennessee: North Carolina mileposts 0 to 50 and Tennessee mileposts 379 to 451, Asheville to Knoxville.",
    },
    {
      q: "What is the elevation change on this stretch of I-40?",
      a: "The road falls from about 2,641 feet at Waynesville to about 1,467 feet at the Pigeon River at the state line, then rolls through the Tennessee foothills to about 886 feet in Knoxville. The gorge floor is the low point of the drive, which is part of why fog settles there.",
    },
    {
      q: "Does I-40 have chain controls in winter?",
      a: "No. Neither North Carolina nor Tennessee runs a chain control system, on this corridor or anywhere else. Both states post restrictions, advisories, and closures, and this site reports those posts in the states' own language. There are no chain tiers here, and this site will never post one.",
    },
    {
      q: "Why does this stretch of I-40 close so often?",
      a: "The gorge section is cut into steep, wet rock directly above the Pigeon River, with almost no shoulder. Rockslides have closed it since 1969, flooding closed it in 2024 and again in 2025, and with one lane each way until late 2028, even minor crashes stop a direction. Closure and restriction events appear on this page from the state feeds as the DOTs post them.",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/i-40", title: metadata.title, description: metadata.description, dateModified: corridor.fetchedAt.toISOString() }),
          roadConditionSchema({ path: "/i-40", name: "Interstate 40 Road Conditions", seg: combined, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "I-40", path: "/i-40" },
          ]),
          placeSchema({ name: "Interstate 40, North Carolina and Tennessee", lat: 35.85, lon: -83.0, elevationFt: 2641, description: "Interstate 40 from Asheville, North Carolina to Knoxville, Tennessee, through the Pigeon River Gorge." }),
          ...(CAMERAS.length ? [cameraListSchema(CAMERAS.slice(0, 3), "I-40 Webcams")] : []),
          faqSchema(faqs),
        ]}
      />
      <h1 className="text-xl md:text-2xl font-black text-on-surface mb-4 tracking-wide uppercase">
        I-40 Road Conditions
      </h1>
      <VerdictBar seg={combined} fetchedAt={corridor.fetchedAt} label="Interstate 40 current status" />

      <CameraStrip
        cameras={CAMERAS}
        heading="I-40 webcams"
        sub={CAMERA_COUNT ? `${CAMERA_COUNT} state DOT cameras on the corridor, in driving order. The full set, grouped by segment, is on the cameras page.` : "State DOT cameras on the corridor, in driving order. The full set, grouped by segment, is on the cameras page."}
        seeAllHref="/cameras"
        emptyText="No cameras are listed for this part of the corridor yet. The camera inventory is pulled from the DriveNC registry, with TDOT SmartWay cameras for the Tennessee side, and this section fills in from those registries when the feed connection is live. The verdict above comes from the state event feeds and does not depend on the cameras."
      />

      <AdSlot slot="belowCameras" />

      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-10">{sentence}</p>

      <section aria-label="Segment status" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">The corridor in five segments</h2>
        <div className="space-y-3">
          {segments.map((seg) => (
            <SegmentRow key={seg.key} seg={seg} />
          ))}
        </div>
      </section>

      <section aria-label="All state events on I-40" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">All events on Interstate 40</h2>
        <EventsList
          events={corridor.combined.events}
          emptyText={
            corridor.ok
              ? "The state feeds post no events on Interstate 40 right now."
              : "No state events can be shown yet, because the live DriveNC feed is not connected. The feed fills this list the moment the developer key is set."
          }
        />
      </section>

      {corridor.stations.length > 0 && (
        <section aria-label="Road weather stations" className="mt-10">
          <h2 className="text-headline-sm text-on-surface mb-3">Road weather stations on I-40</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {corridor.stations.map((s) => (
              <div key={s.id} className="rounded-2xl border border-outline-variant/40 bg-white p-4">
                <p className="font-bold text-on-surface">{s.name}</p>
                <p className="text-sm text-secondary mt-1">
                  {s.airTempF != null ? `Air ${s.airTempF}°F` : "Air temperature not reported"}
                  {s.surfaceTempF != null ? ` · Surface ${s.surfaceTempF}°F` : ""}
                  {s.windMph != null ? ` · Wind ${s.windMph} mph` : ""}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-secondary mt-2">Temperatures are Fahrenheit, as the state platform reports them.</p>
        </section>
      )}

      {corridor.restAreas.length > 0 && (
        <section aria-label="Rest areas" className="mt-10">
          <h2 className="text-headline-sm text-on-surface mb-3">Rest areas on I-40</h2>
          <div className="space-y-2">
            {corridor.restAreas.map((r) => (
              <p key={r.id} className="rounded-2xl border border-outline-variant/40 bg-white p-4 font-semibold text-on-surface">{r.name}</p>
            ))}
          </div>
        </section>
      )}

      <WeatherStrip points={weather} />

      <section aria-label="About Interstate 40" className="mt-10 space-y-6">
        <div>
          <h2 className="text-headline-sm text-on-surface mb-2">The cross country road, at its narrowest</h2>
          <p className="text-body-md text-secondary leading-relaxed">
            Interstate 40 is one of the great American cross country roads, running about 2,555 miles from
            Barstow, California to Wilmington, North Carolina. Most of it is wide, fast, and forgettable. The
            stretch this site covers is none of those things. Between Asheville and Knoxville the interstate
            threads the Pigeon River Gorge, cut into the mountains on the edge of Great Smoky Mountains National
            Park, where the river, the rock walls, and the traffic all compete for the same narrow shelf. It is
            a primary east coast to midwest freight route, carrying about 26,500 vehicles a day with a truck
            share of 23 percent, and there is no parallel interstate to absorb the flow when it stops. The
            detour, I-26 to I-81, adds about an hour.
          </p>
        </div>
        <div>
          <h2 className="text-headline-sm text-on-surface mb-2">Why this page splits the corridor</h2>
          <p className="text-body-md text-secondary leading-relaxed">
            A single conditions line for 122 miles of this road would be wrong most of the time. The segments on
            this site follow the corridor&apos;s real breaks: the Asheville metro edge, Canton and the upper
            Pigeon River valley, Waynesville and the fall toward the gorge, the state line inside the gorge
            itself, Hartford and Newport on the Tennessee side, and the run in to Knoxville. Each boundary is a
            place where the drive genuinely changes. The{" "}
            <Link href="/compare" className="text-primary font-semibold hover:underline">comparison page</Link>{" "}
            puts the five side by side, and the{" "}
            <Link href="/asheville-to-knoxville" className="text-primary font-semibold hover:underline">route page</Link>{" "}
            reads them as one drive. The gorge itself has its own page: the{" "}
            <Link href="/pigeon-river-gorge" className="text-primary font-semibold hover:underline">Pigeon River Gorge page</Link>.
          </p>
        </div>
      </section>

      <div className="mt-10">
        <StormAlerts />
      </div>

      <FaqBlock faqs={faqs} />

      <AdSlot slot="lowerPage" />

      <p className="text-xs text-secondary mt-10">{SITE.dataCredit}</p>
    </main>
  );
}
