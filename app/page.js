// Homepage: the whole I-77 Fancy Gap corridor, North Carolina
// line to Hillsville. Section order follows the i80pass master
// and the Gold Standard canonical order: hero heading in the
// master's heading classes, then the verdict box (full width,
// largest type, timestamp, server rendered), then webcams
// directly under the verdict under the camera count rule, then
// the one line answer sentence and the segment status stack in
// the editorial flow, restrictions in the slot the master
// reserves for chain controls (named exception: Virginia has no
// chain control system, so the slot carries restrictions and
// advisories in the state's own language), road conditions,
// weather, storm alerts, editorial, and FAQs. Nothing sits
// between the corridor bar and the verdict box. ISR revalidate
// 60, as the master homepage, over the 300 second cached feed
// layer beneath it.

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
import { camerasForSegment, CAMERA_COUNT } from "@/lib/cameras";
import { corridorStatusSentence } from "@/lib/verdict";
import { webPageSchema, webSiteSchema, organizationSchema, faqSchema, roadConditionSchema, cameraListSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const revalidate = 60;

export const metadata = {
  title: "I-77 Road Conditions Today: Fancy Gap, Virginia | i77pass.com",
  description:
    "Is I-77 open over Fancy Gap? Live Interstate 77 conditions, fog status, closures, restrictions, and webcams from the North Carolina line to Hillsville, Virginia, updated from VDOT via 511 Virginia.",
  alternates: { canonical: siteUrl("/") },
  openGraph: { title: "I-77 Road Conditions Today: Fancy Gap, Virginia | i77pass.com", description: "Live I-77 conditions, fog status, closures, restrictions, and webcams over Fancy Gap, Virginia, from VDOT via 511 Virginia.", images: ["/og-image.png"] },
};

const WEATHER_POINTS = [
  { name: "Mount Airy", slug: "mount-airy", lat: 36.4995, lon: -80.6073 },
  { name: "Cana", slug: "cana", lat: 36.5833, lon: -80.6681 },
  { name: "Fancy Gap", slug: "fancy-gap", lat: 36.6681, lon: -80.7017 },
  { name: "Hillsville", slug: "hillsville", lat: 36.7622, lon: -80.7345 },
];

export default async function HomePage() {
  const [corridor, weather] = await Promise.all([getCorridor(), getPointWeather(WEATHER_POINTS)]);
  const segments = SEGMENTS.map((s) => corridor.segments[s.key]);
  const combined = { ...corridor.combined, name: "North Carolina Line to Hillsville", statusLine: corridor.combined.statusWord === "STATUS UNAVAILABLE" ? segments[0].statusLine : `Interstate 77, North Carolina line to Hillsville: ${corridor.combined.statusWord.toLowerCase()} based on the worst segment right now.` };
  const sentence = corridorStatusSentence(corridor, segments);
  const climbCameras = camerasForSegment(2);
  const topCameras = camerasForSegment(3);

  const faqs = [
    {
      q: "Is I-77 open over Fancy Gap right now?",
      a: `${sentence} The verdict box at the top of this page is built from VDOT events on Interstate 77 between the North Carolina line and Hillsville and refreshes every few minutes. On this mountain, open is only half the answer: check the cameras for fog before you climb.`,
    },
    {
      q: "Why is Fancy Gap so foggy?",
      a: "Moist air from the North Carolina Piedmont is pushed up the Blue Ridge escarpment and cools into cloud right at road level near the top of the climb. By VDOT's account the mountain is fogged in roughly a third of the year, and the fog is hyper local: Mount Airy and Hillsville can be clear while the summit is white. A forecast cannot settle it. The cameras near mileposts 7 to 9 can.",
    },
    {
      q: "How steep and how long is the Fancy Gap climb?",
      a: "About six miles at a near constant four percent grade, gaining roughly 1,400 feet from the North Carolina line to the top of the escarpment near Exit 8. It is one of the longest steady climbs on any interstate in Virginia, and about a quarter of the traffic climbing it is trucks.",
    },
    {
      q: "Do I need chains on I-77 in Virginia?",
      a: "No. Virginia does not run a chain control system, and there are no chain laws, chain tiers, or traction checkpoints on this corridor. In winter weather Virginia posts advisories, speed reductions, and restrictions instead, and closes the road when it has to. See the restrictions and winter traction page for how the system works.",
    },
    {
      q: "Where are the cameras on I-77 over Fancy Gap?",
      a: CAMERA_COUNT
        ? `VDOT lists ${CAMERA_COUNT} cameras on this corridor between mileposts 0.1 and 15, and every camera has its own page on this site. Stills are VDOT images served live from the agency feed and credited to VDOT. The densest coverage is on the climb itself, mileposts 4.3 to 8.7, where the fog sits.`
        : "The corridor cameras are published by VDOT through 511 Virginia, and this site hot links the stills with credit to VDOT, never rehosting them.",
    },
    {
      q: "What is the worst thing that has happened on this climb?",
      a: "Fog pileups. About 56 vehicles crashed in February 1997, 50 in September 2005, and more than 70 in November 2010. On March 31, 2013, 96 vehicles were involved in 18 crashes in fog on the climb, and three people died. That record is why this page leads with a verdict and cameras instead of a forecast.",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webSiteSchema(),
          organizationSchema(),
          webPageSchema({ path: "/", title: metadata.title, description: metadata.description, dateModified: corridor.fetchedAt.toISOString() }),
          roadConditionSchema({ path: "/", name: "Interstate 77 Road Conditions, North Carolina Line to Hillsville", seg: combined, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          faqSchema(faqs),
          ...(climbCameras.length ? [cameraListSchema(climbCameras.slice(0, 3), "I-77 Webcams, the Fancy Gap Climb")] : []),
        ]}
      />
      <h1 className="text-xl md:text-2xl font-black text-on-surface mb-4 tracking-wide uppercase">
        I-77 Road Conditions: Fancy Gap, Virginia
      </h1>
      <VerdictBar seg={combined} fetchedAt={corridor.fetchedAt} label="Interstate 77 current status" />

      <CameraStrip
        cameras={climbCameras}
        priorityFirst
        heading="I-77 webcams, the Fancy Gap climb"
        sub="VDOT cameras on the steepest miles, in driving order. On this mountain the camera is the fog report. Still images from 511 Virginia, credited to VDOT."
        seeAllHref="/segments/lambsburg-to-fancy-gap/cameras"
        emptyText="No cameras are listed for this part of the corridor yet. The verdict above comes from the VDOT event feed and does not depend on the cameras."
      />

      <CameraStrip
        cameras={topCameras}
        heading="I-77 webcams, Fancy Gap to Hillsville"
        sub="VDOT cameras across the top of the Blue Ridge, in driving order. Still images from 511 Virginia, credited to VDOT."
        seeAllHref="/segments/fancy-gap-to-hillsville/cameras"
        emptyText="No cameras are listed for this part of the corridor yet. The verdict above comes from the VDOT event feed and does not depend on the cameras."
      />

      {/* Ad slot 1 of 2: below the webcams. Renders nothing until
          AdSense is activated (the AdSlot gate). */}
      <AdSlot slot="belowCameras" />

      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-10">{sentence}</p>

      <section aria-label="Segment status" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">I-77 segment by segment</h2>
        <div className="space-y-3">
          {segments.map((seg) => (
            <SegmentRow key={seg.key} seg={seg} />
          ))}
        </div>
      </section>

      <section aria-label="Restrictions and advisories on I-77" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-2">Restrictions and advisories on I-77</h2>
        <p className="text-body-md text-secondary leading-relaxed">
          Virginia does not run chain controls. There are no checkpoints, no chain tiers, and no law that
          requires you to carry chains for this drive. What the state posts instead are restrictions,
          advisories, and closures: variable speed limits that drop when the fog comes down, wind advisories
          for high profile vehicles on the climb, winter advisories and treatment reports, and full closures
          when a crash or a storm shuts the mountain. Read the{" "}
          <Link href="/restrictions" className="text-primary font-semibold hover:underline">restrictions and winter traction page</Link>{" "}
          before a trip to learn how to read each posting.
        </p>
      </section>

      <section aria-label="VDOT events on I-77" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">Closures, restrictions, and events on I-77</h2>
        <EventsList
          events={corridor.combined.events}
          emptyText={
            corridor.ok
              ? "VDOT posts no events on Interstate 77 on this corridor right now. The road is running clear from the state line to Hillsville. Fog can still form faster than any posting, so read the cameras before the climb."
              : "No VDOT events can be shown right now, because the live feed is not answering. Nothing is posted here in the meantime, and the verdict above says STATUS UNAVAILABLE rather than guessing."
          }
        />
        <p className="text-sm text-secondary mt-3">
          Full detail on the{" "}
          <Link href="/alerts" className="text-primary font-semibold hover:underline">alerts and closures page</Link>,
          including message signs when VDOT is posting to them. For shutdowns specifically, see
          the{" "}
          <Link href="/shutdown" className="text-primary font-semibold hover:underline">I-77 shutdown and closures page</Link>.
        </p>
      </section>

      {corridor.signs.length > 0 && (
        <section aria-label="Message signs" className="mt-10">
          <h2 className="text-headline-sm text-on-surface mb-3">What the highway signs say</h2>
          <div className="space-y-3">
            {corridor.signs.slice(0, 4).map((s) => (
              <div key={s.id} className="rounded-2xl border border-outline-variant/40 bg-[#0f172a] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400/80">{s.name}</p>
                {s.messages.map((m, i) => (
                  <p key={i} className="font-mono font-bold text-amber-300 text-lg leading-snug mt-1">{m}</p>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      <WeatherStrip points={weather} />

      <div className="mt-10">
        <StormAlerts />
      </div>

      <section aria-label="The drive" className="mt-10 space-y-6">
        <div>
          <h2 className="text-headline-sm text-on-surface mb-2">One mountain, one answer</h2>
          <p className="text-body-md text-secondary leading-relaxed">
            Interstate 77 over Fancy Gap is the main line between the Midwest and the Southeast: Ohio and
            Cleveland traffic bound for Columbia, Charlotte, and Florida crosses the Blue Ridge here, about
            40,000 vehicles a day, a quarter of them trucks. The crossing is a six mile climb at four percent,
            up the face of the escarpment from the North Carolina line to the plateau at Fancy Gap. This site
            exists to answer one question in plain language before you leave: is the mountain open, restricted,
            or closed today, and can you see where you are going when you get there. The verdict at the top of
            this page is built from the official VDOT feed, with the corridor&apos;s cameras, current
            restrictions, and weather for the same drive on the same page.
          </p>
        </div>
        <div>
          <h2 className="text-headline-sm text-on-surface mb-2">Why this mountain needs a check every time</h2>
          <p className="text-body-md text-secondary leading-relaxed">
            Most interstates only need checking in a storm. Fancy Gap needs checking in every season, because
            its hazard is fog, and fog here does not follow the calendar. The mountain is fogged in roughly a
            third of the year, the fog forms at the top while the ends of the corridor sit in sunshine, and it
            has produced the worst pileup record on any corridor this network covers, up to 96 vehicles in a
            single morning in 2013. Add wind advisories for high profile vehicles, winter storms that hit the
            plateau hours before the valley, and crash closures on a grade where trucks and cars run at very
            different speeds, and the habit writes itself: check the verdict, read the summit cameras, then
            decide whether to climb, wait at Exit 1 or Exit 8, or plan around the mountain. Driving the whole
            route? The{" "}
            <Link href="/mount-airy-to-hillsville" className="text-primary font-semibold hover:underline">Mount Airy to Hillsville route page</Link>{" "}
            lines the segments up as one drive, the{" "}
            <Link href="/fancy-gap" className="text-primary font-semibold hover:underline">Fancy Gap page</Link>{" "}
            tells the mountain&apos;s own story, and the{" "}
            <Link href="/compare" className="text-primary font-semibold hover:underline">segment comparison page</Link>{" "}
            puts the three segments side by side.
          </p>
        </div>
      </section>

      <FaqBlock faqs={faqs} />

      {/* Ad slot 2 of 2: lower page, above the footer. Renders
          nothing until AdSense is activated (the AdSlot gate). */}
      <AdSlot slot="lowerPage" />

      <p className="text-xs text-secondary mt-10">{SITE.dataCredit}</p>
    </main>
  );
}
