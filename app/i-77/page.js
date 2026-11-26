// The I-77 highway page, the master's highway page pattern: the
// anchor interstate's own page, owning the "I-77 road conditions"
// query cluster. Hero heading in the master's heading classes,
// verdict first, cameras directly under the verdict under the
// camera count rule, then the answer sentence and the segment
// stack, message signs when the feed carries them, corridor
// facts, editorial, and FAQs.

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
  title: "I-77 Road Conditions: Interstate 77 at Fancy Gap, Virginia | i77pass.com",
  description:
    "Interstate 77 road conditions for the Fancy Gap corridor: live fog status, closures, restrictions, message signs, and webcams from the North Carolina line to Hillsville, Virginia, from VDOT via 511 Virginia.",
  alternates: { canonical: siteUrl("/i-77") },
  openGraph: { title: "I-77 Road Conditions | i77pass.com", description: "Live Interstate 77 conditions at Fancy Gap, Virginia, from VDOT via 511 Virginia.", images: ["/og-image.png"] },
};

const WEATHER_POINTS = [
  { name: "Mount Airy", slug: "mount-airy", lat: 36.4995, lon: -80.6073 },
  { name: "Cana", slug: "cana", lat: 36.5833, lon: -80.6681 },
  { name: "Fancy Gap", slug: "fancy-gap", lat: 36.6681, lon: -80.7017 },
  { name: "Hillsville", slug: "hillsville", lat: 36.7622, lon: -80.7345 },
];

export default async function HighwayPage() {
  const [corridor, weather] = await Promise.all([getCorridor(), getPointWeather(WEATHER_POINTS)]);
  const segments = SEGMENTS.map((s) => corridor.segments[s.key]);
  const combined = {
    ...corridor.combined,
    name: "Interstate 77",
    statusLine:
      corridor.combined.statusWord === "STATUS UNAVAILABLE"
        ? segments[0].statusLine
        : `Interstate 77, North Carolina line to Hillsville: ${corridor.combined.statusWord.toLowerCase()} based on the worst segment right now.`,
  };
  const sentence = corridorStatusSentence(corridor, segments);

  const faqs = [
    {
      q: "What are the road conditions on I-77 right now?",
      a: `${sentence} Segment by segment detail is in the stack on this page, and each segment page carries its own events, cameras, and weather. On this corridor, read the cameras with the verdict: the fog does not always generate a posting.`,
    },
    {
      q: "How long is Interstate 77?",
      a: "About 610 miles, from Columbia, South Carolina to Cleveland, Ohio. This site covers the 15 Virginia miles where it climbs the Blue Ridge at Fancy Gap, from the North Carolina line (milepost 0) to Hillsville (Exit 14), the stretch drivers mean when they ask about I-77 conditions.",
    },
    {
      q: "What is the elevation change on this stretch of I-77?",
      a: "The road climbs about 1,400 feet in six miles, from roughly 1,400 feet at the North Carolina line to about 2,800 feet at the top of the escarpment near Fancy Gap, then rolls across the plateau to Hillsville at about 2,506 feet. That climb, at a steady four percent grade, is the whole story of this corridor.",
    },
    {
      q: "Does I-77 have chain controls in winter?",
      a: "No. Virginia runs no chain control system, on this corridor or anywhere else. The state posts restrictions, advisories, variable speed limits, and closures, and this site reports those posts in the state's own language. There are no chain tiers here, and this site will never post one.",
    },
    {
      q: "Why does this stretch of I-77 close?",
      a: "Fog crashes first: the climb's pileup record includes 96 vehicles in one morning in March 2013. Winter storms close it when the plateau ices, wind advisories stop high profile vehicles, and any serious crash on the grade can close a direction while it clears. Closure and restriction events appear on this page from the VDOT feed as the state posts them.",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/i-77", title: metadata.title, description: metadata.description, dateModified: corridor.fetchedAt.toISOString() }),
          roadConditionSchema({ path: "/i-77", name: "Interstate 77 Road Conditions", seg: combined, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "I-77", path: "/i-77" },
          ]),
          placeSchema({ name: "Interstate 77, Fancy Gap, Virginia", lat: 36.66, lon: -80.73, elevationFt: 2800, description: "Interstate 77 from the North Carolina line to Hillsville, Virginia, over Fancy Gap on the Blue Ridge." }),
          ...(CAMERAS.length ? [cameraListSchema(CAMERAS.slice(0, 3), "I-77 Webcams")] : []),
          faqSchema(faqs),
        ]}
      />
      <h1 className="text-xl md:text-2xl font-black text-on-surface mb-4 tracking-wide uppercase">
        I-77 Road Conditions
      </h1>
      <VerdictBar seg={combined} fetchedAt={corridor.fetchedAt} label="Interstate 77 current status" />

      <CameraStrip
        cameras={CAMERAS}
        heading="I-77 webcams"
        sub={CAMERA_COUNT ? `${CAMERA_COUNT} VDOT cameras on the corridor, in driving order. The full set, grouped by segment, is on the cameras page.` : "VDOT cameras on the corridor, in driving order. The full set, grouped by segment, is on the cameras page."}
        seeAllHref="/cameras"
        emptyText="No cameras are listed for this corridor yet. The verdict above comes from the VDOT event feed and does not depend on the cameras."
      />

      <AdSlot slot="belowCameras" />

      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-10">{sentence}</p>

      <section aria-label="Segment status" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">The corridor in three segments</h2>
        <div className="space-y-3">
          {segments.map((seg) => (
            <SegmentRow key={seg.key} seg={seg} />
          ))}
        </div>
      </section>

      <section aria-label="All VDOT events on I-77" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">All events on Interstate 77</h2>
        <EventsList
          events={corridor.combined.events}
          emptyText={
            corridor.ok
              ? "VDOT posts no events on Interstate 77 on this corridor right now."
              : "No VDOT events can be shown right now, because the live feed is not answering."
          }
        />
      </section>

      <WeatherStrip points={weather} />

      <section aria-label="About Interstate 77" className="mt-10 space-y-6">
        <div>
          <h2 className="text-headline-sm text-on-surface mb-2">The Midwest to Florida road, at its highest climb</h2>
          <p className="text-body-md text-secondary leading-relaxed">
            Interstate 77 runs about 610 miles from Columbia, South Carolina to Cleveland, Ohio, and it is the
            route the Midwest takes to the Southeast: Ohio, Michigan, and western Pennsylvania traffic bound
            for Charlotte, Columbia, and Florida funnels through two states of mountains to get there. Most of
            the Virginia miles are honest mountain interstate, tunnels at Big Walker and East River included.
            The 15 miles this site covers are the ones drivers remember: the climb up the Blue Ridge
            escarpment at Fancy Gap, where the road gains about 1,400 feet in six miles and the weather at the
            top belongs to a different climate than the weather at the bottom. About 40,000 vehicles a day make
            the climb, roughly a quarter of them trucks, and there is no parallel interstate to absorb the
            flow when it stops.
          </p>
        </div>
        <div>
          <h2 className="text-headline-sm text-on-surface mb-2">Why this page splits the corridor</h2>
          <p className="text-body-md text-secondary leading-relaxed">
            A single conditions line for this corridor would be wrong most of the time, because the corridor's
            whole character is that its ends disagree. The segments on this site follow the climb's real
            breaks: the state line and Lambsburg at the foot, the steep miles and the fog bank up to Fancy Gap,
            and the plateau run to Hillsville on top. Each boundary is a place where the drive genuinely
            changes. The{" "}
            <Link href="/compare" className="text-primary font-semibold hover:underline">comparison page</Link>{" "}
            puts the three side by side, and the{" "}
            <Link href="/mount-airy-to-hillsville" className="text-primary font-semibold hover:underline">route page</Link>{" "}
            reads them as one drive. The mountain itself has its own page: the{" "}
            <Link href="/fancy-gap" className="text-primary font-semibold hover:underline">Fancy Gap page</Link>.
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
