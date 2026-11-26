// Route page: the Mount Airy to Hillsville drive as one trip.
// Live status rows for every segment, camera groups per segment
// under the camera count rule, written segments, and FAQs, in
// the master's route page pattern.

import Link from "next/link";
import VerdictBar from "@/components/VerdictBar";
import SegmentRow from "@/components/SegmentRow";
import CameraStrip from "@/components/CameraStrip";
import WeatherStrip from "@/components/WeatherStrip";
import FaqBlock from "@/components/FaqBlock";
import StormAlerts from "@/components/StormAlerts";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { getPointWeather } from "@/lib/weather";
import { SEGMENTS } from "@/lib/segments";
import { camerasForSegment } from "@/lib/cameras";
import { corridorStatusSentence } from "@/lib/verdict";
import { webPageSchema, faqSchema, roadConditionSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mount Airy to Hillsville Drive: I-77 Conditions, Cameras, and Time | i77pass.com",
  description:
    "The Mount Airy to Hillsville drive on Interstate 77: live status for all three segments, Fancy Gap climb cameras, weather at both ends, and what to expect on the drive over the Blue Ridge.",
  alternates: { canonical: siteUrl("/mount-airy-to-hillsville") },
  openGraph: { title: "Mount Airy to Hillsville Drive | i77pass.com", description: "Live I-77 status for the full Mount Airy to Hillsville drive, segment by segment.", images: ["/og-image.png"] },
};

const WEATHER_POINTS = [
  { name: "Mount Airy", slug: "mount-airy", lat: 36.4995, lon: -80.6073 },
  { name: "Cana", slug: "cana", lat: 36.5833, lon: -80.6681 },
  { name: "Fancy Gap", slug: "fancy-gap", lat: 36.6681, lon: -80.7017 },
  { name: "Hillsville", slug: "hillsville", lat: 36.7622, lon: -80.7345 },
];

const DRIVE_NOTES = {
  1: "Leave Mount Airy northbound and the Piedmont lets go quickly: a short run to the state line, then Cana and Lambsburg farmland with the escarpment wall filling the windshield. Fuel and food are easy in Mount Airy and scarce on the mountain, so sort both out before the line.",
  2: "The climb itself. Six miles of four percent, trucks crawling up and riding brakes down, the variable speed signs, and the fog bank's home ground between mileposts 5 and 9. Exit 8 at the top is the first door since Exit 1. Whatever the summit cameras show is what you are driving into.",
  3: "Across the top. The plateau run from Fancy Gap to Hillsville is rolling farmland at 2,500 feet and change, easier driving with its own weather: first to freeze in winter, windy in every season. Hillsville at Exit 14 ends the corridor with full services.",
};

export default async function RoutePage() {
  const [corridor, weather] = await Promise.all([getCorridor(), getPointWeather(WEATHER_POINTS)]);
  const segments = SEGMENTS.map((s) => corridor.segments[s.key]);
  const combined = {
    ...corridor.combined,
    name: "Mount Airy to Hillsville",
    statusLine:
      corridor.combined.statusWord === "STATUS UNAVAILABLE"
        ? segments[0].statusLine
        : `The Mount Airy to Hillsville drive is ${corridor.combined.statusWord.toLowerCase()} based on the worst segment right now.`,
  };
  const sentence = corridorStatusSentence(corridor, segments);

  const faqs = [
    {
      q: "How long does the drive from Mount Airy to Hillsville take?",
      a: "About 25 miles all in, roughly 10 miles from Mount Airy to the state line and 15 more to Hillsville's Exit 14. In clear conditions it is about a 30 minute drive. In fog, behind a slow truck platoon, or in a closure queue, it can take far longer, and the climb segment decides which trip you get.",
    },
    {
      q: "Where should I check conditions before starting?",
      a: "At either end, before the climb. Northbound, check from Mount Airy or at Exit 1; southbound, check from Hillsville before Exit 14. The summit cameras at mileposts 7.5 and 8.7 answer the fog question that neither town's weather can.",
    },
    {
      q: "Is there a way around the climb if it closes?",
      a: "No short one. US 52 parallels the interstate as a slow two lane mountain road and fogs in too. The interstate level reroute runs far west and south via I-81 and I-26 or I-40 and adds hours. For closures measured in hours, waiting at Hillsville, Fancy Gap, or Mount Airy usually beats rerouting.",
    },
    {
      q: "Which direction is harder, up or down?",
      a: "They are hard differently. Northbound is the climb: slow trucks, wide speed differences, engines working. Southbound is the descent: six miles of braking, runaway risk for heavy vehicles, and the same fog at the top. Both directions share the fog bank, which does not care which way you are pointed.",
    },
    {
      q: "What is the Blue Ridge Parkway connection on this drive?",
      a: "The Parkway crosses I-77 at Fancy Gap, near Parkway milepost 199.5, reached from Exit 8. It is a beautiful connection and a slow one: Parkway speeds are mostly 45 mph and it closes its own sections in winter weather. Do not treat it as an interstate detour.",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/mount-airy-to-hillsville", title: metadata.title, description: metadata.description, dateModified: corridor.fetchedAt.toISOString() }),
          roadConditionSchema({ path: "/mount-airy-to-hillsville", name: "Mount Airy to Hillsville, Interstate 77", seg: combined, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Mount Airy to Hillsville", path: "/mount-airy-to-hillsville" },
          ]),
          faqSchema(faqs),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        Mount Airy to Hillsville: The I-77 Drive
      </h1>
      <div className="mt-4">
        <VerdictBar seg={combined} fetchedAt={corridor.fetchedAt} label="Mount Airy to Hillsville current status" />
      </div>

      {/* The first segment's cameras sit directly under the verdict
          bar (the master's hard rule: no text between the status
          block and the first camera). The same strip is skipped
          in the per segment loop below. */}
      <CameraStrip
        cameras={camerasForSegment(1)}
        heading={`Cameras: ${SEGMENTS[0].name}`}
        sub={camerasForSegment(1).length ? `${camerasForSegment(1).length} VDOT ${camerasForSegment(1).length === 1 ? "camera" : "cameras"} on this part of the drive.` : undefined}
        seeAllHref="/cameras"
        emptyText="No cameras are listed on this part of the drive yet. The verdict above, from the VDOT event feed, is the live picture here."
      />

      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-10">{sentence}</p>

      <section aria-label="Live status for every segment" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">Live status, segment by segment</h2>
        <div className="space-y-3">
          {segments.map((seg) => (
            <SegmentRow key={seg.key} seg={seg} />
          ))}
        </div>
      </section>

      <WeatherStrip points={weather} heading="Weather along the drive" />

      {SEGMENTS.map((meta) => {
        const cams = camerasForSegment(meta.key);
        return (
          <div key={meta.key}>
            <section aria-label={`The drive: ${meta.name}`} className="mt-10">
              <h2 className="text-headline-sm text-on-surface mb-2">
                {meta.key}. {meta.name}
              </h2>
              <p className="text-sm font-semibold text-secondary">
                Mileposts {meta.mpFrom} to {meta.mpTo} · {meta.elevFromLabel} to {meta.elevToLabel}
              </p>
              <p className="text-body-md text-secondary leading-relaxed mt-2">{DRIVE_NOTES[meta.key]}</p>
              <p className="text-body-md text-secondary leading-relaxed mt-2">{meta.sections[0].body}</p>
            </section>
            {meta.key !== 1 && (
              <CameraStrip
                cameras={cams}
                heading={`Cameras: ${meta.name}`}
                sub={cams.length ? `${cams.length} VDOT ${cams.length === 1 ? "camera" : "cameras"} on this part of the drive.` : undefined}
                seeAllHref="/cameras"
                emptyText="No cameras are listed on this part of the drive yet. The segment status row above, from the VDOT event feed, is the live picture here."
              />
            )}
          </div>
        );
      })}

      <AdSlot slot="belowCameras" />

      <section aria-label="Planning the drive" className="mt-10 space-y-6">
        <div>
          <h2 className="text-headline-sm text-on-surface mb-2">Mount Airy to the foot of the climb</h2>
          <p className="text-body-md text-secondary leading-relaxed">
            The drive north from Mount Airy starts as a Piedmont trip: a Surry County city of antique shops and
            Andy Griffith fame, full services, and mild weather at about 1,100 feet. I-74 and I-77 bring you to
            the state line in about ten minutes, past Cana's produce stands to Lambsburg at Exit 1. Nothing
            about this stretch warns you about the mountain, which is the point of checking before it: the
            summit can be in a white fog bank while Mount Airy sits in sunshine. Fuel up here, check the
            verdict and the cameras here, and treat Exit 1 as the last free decision.
          </p>
        </div>
        <div>
          <h2 className="text-headline-sm text-on-surface mb-2">The climb itself</h2>
          <p className="text-body-md text-secondary leading-relaxed">
            From the state line the road gains about 1,400 feet in six miles at a near constant four percent.
            Trucks slow to a crawl northbound and ride their brakes southbound; cars run at full speed; the
            closing speeds are the widest on the corridor. Somewhere around milepost 5 the climb enters the
            fog's home ground, where moist Piedmont air condenses against the escarpment, and VDOT's variable
            speed signs take over the speed limit. Hold the posted speed, leave real space, and let the cameras
            you checked at the bottom speak for the top. The{" "}
            <Link href="/fancy-gap" className="text-primary font-semibold hover:underline">Fancy Gap page</Link>{" "}
            tells the mountain's story in full, including the pileup record that makes this advice more than a
            formality.
          </p>
        </div>
        <div>
          <h2 className="text-headline-sm text-on-surface mb-2">Across the top to Hillsville</h2>
          <p className="text-body-md text-secondary leading-relaxed">
            North of Exit 8 the road leaves the escarpment edge and crosses the Blue Ridge plateau: rolling
            farmland, long views, and weather that belongs to the mountains, colder and windier than either
            valley. Six miles brings you to Hillsville at Exit 14, the Carroll County seat, with full services
            and the corridor's hospital. If you have come up through fog, resist relaxing completely at the
            summit: the plateau has its own fog in the dips and its own ice in winter, and it is the first part
            of the corridor to freeze.
          </p>
        </div>
        <div>
          <h2 className="text-headline-sm text-on-surface mb-2">The return trip is the same road, read backwards</h2>
          <p className="text-body-md text-secondary leading-relaxed">
            Everything on this page reads in reverse for the Hillsville to Mount Airy drive. The segment pages
            do not change with direction, because VDOT's events carry their own direction when the state posts
            one, and the segment verdicts cover both directions of the same pavement. Southbound drivers meet
            the descent instead of the climb: six miles down at four percent, brakes hot, trucks slow, and the
            fog bank waiting at the top before any of it. The{" "}
            <Link href="/compare" className="text-primary font-semibold hover:underline">segment comparison</Link>{" "}
            is the fastest way to see where today&apos;s problem sits before you join it.
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
