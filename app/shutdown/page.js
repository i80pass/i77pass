// Shutdown page: owns the "I-77 shutdown" and "is I-77 closed
// today" query cluster. Live verdict first, then what counts as
// a shutdown, where the information comes from, the corridor
// right now, why this mountain shuts down, and what to do when
// it does. All status comes from the live VDOT read; the
// editorial is original for this corridor.

import Link from "next/link";
import VerdictBar from "@/components/VerdictBar";
import SegmentRow from "@/components/SegmentRow";
import EventsList from "@/components/EventsList";
import FaqBlock from "@/components/FaqBlock";
import StormAlerts from "@/components/StormAlerts";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { SEGMENTS } from "@/lib/segments";
import { corridorStatusSentence } from "@/lib/verdict";
import { webPageSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";

export const revalidate = 60;

export const metadata = {
  title: "I-77 Shutdown Today: Is I-77 Closed at Fancy Gap? | i77pass.com",
  description:
    "Is I-77 closed today at Fancy Gap? Shutdown and closure status for Interstate 77 over Fancy Gap, Virginia, from VDOT posts via 511 Virginia, with the corridor's closure history and what to do.",
  alternates: { canonical: siteUrl("/shutdown") },
  openGraph: { title: "I-77 Shutdown and Closures Today | i77pass.com", description: "Is I-77 closed today? Shutdown and closure status for I-77 over Fancy Gap, Virginia, from VDOT via 511 Virginia.", images: ["/og-image.png"] },
};

export default async function ShutdownPage() {
  const corridor = await getCorridor();
  const segments = SEGMENTS.map((s) => corridor.segments[s.key]);
  const climb = corridor.segments[2];
  const sentence = corridorStatusSentence(corridor, segments);
  const closures = corridor.combined.events.filter((e) => e.isFullClosure);

  const FAQS = [
    {
      q: "Is I-77 closed today at Fancy Gap?",
      a: `${sentence} This page and the verdict at the top of it are built from the live VDOT feed and refresh every few minutes. If a closure is posted, it appears here with its segment and direction.`,
    },
    {
      q: "Is there an I-77 shutdown today on the climb?",
      a: closures.length
        ? `Yes. ${closures.length === 1 ? "A full closure is" : `${closures.length} full closures are`} posted on the corridor right now; the events list on this page carries the detail.`
        : "No full shutdown is posted on the corridor right now. Lane closures, restrictions, and advisories are a different thing and are listed separately on this page and the alerts page. Fog can still stop traffic without a posted closure, so read the cameras as well.",
    },
    {
      q: "What is the difference between a closure, a lane closure, and a restriction?",
      a: "A closure (a shutdown) means the through lanes are shut in at least one direction. A lane closure closes one lane and keeps traffic moving, slowly. A restriction limits how or what you can drive, like a lowered variable speed limit or a high profile vehicle restriction in wind. This site keeps the three separate and never calls a lane closure a shutdown.",
    },
    {
      q: "Why does I-77 shut down at Fancy Gap?",
      a: "Fog pileups first: the climb's record includes crashes of about 56 vehicles in 1997, 50 in 2005, more than 70 in 2010, and 96 vehicles in 18 crashes in March 2013. Winter storms shut it when the plateau ices faster than crews can treat it. Serious crashes on the grade shut a direction while they clear, because there is little shoulder to move them to. Work zones close lanes on a schedule VDOT posts in advance.",
    },
    {
      q: "What is the detour when I-77 is shut down at Fancy Gap?",
      a: "There is no short one. US 52 is a slow two lane mountain road that shares the fog. The interstate reroute runs via I-81 and I-26, or I-40, adding hours. For most closures, which clear in hours, waiting at Hillsville, Exit 8, or Mount Airy is the practical answer. Follow VDOT's posted detour when one is signed.",
    },
    {
      q: "Where does this page get its shutdown and closure information?",
      a: "From VDOT's published 511 Virginia data, the same feed the state's own map renders: incidents, work zones, and message signs on Interstate 77 between the North Carolina line and Hillsville, read every few minutes. Nothing here is scraped from news reports or social media, and nothing is posted before the state posts it.",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/shutdown", title: metadata.title, description: metadata.description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shutdown and Closures", path: "/shutdown" },
          ]),
          faqSchema(FAQS),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        I-77 Shutdown and Closures Today
      </h1>
      <p className="speakable-status text-body-md text-secondary leading-relaxed mt-4">{sentence}</p>
      <div className="mt-4">
        <VerdictBar seg={climb} fetchedAt={corridor.fetchedAt} label="The Fancy Gap climb current status" />
      </div>

      <section aria-label="Closure events right now" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">Closures posted right now</h2>
        <EventsList
          events={closures}
          emptyText={
            corridor.ok
              ? "No full closure is posted on the corridor right now. Lane closures and restrictions, when posted, are on the alerts page and the segment pages."
              : "Closure status cannot be shown right now, because the live VDOT feed is not answering. This page never guesses."
          }
        />
      </section>

      <section aria-label="What counts as an I-77 shutdown" className="mt-10 space-y-4">
        <h2 className="text-headline-sm text-on-surface">What counts as an I-77 shutdown</h2>
        <p className="text-body-md text-secondary leading-relaxed">
          A shutdown on this page means what drivers mean by it: the through lanes of Interstate 77 are closed
          in at least one direction on the Fancy Gap corridor, between the North Carolina line and Hillsville.
          A direction closed for a crash, both directions closed for a pileup or a winter event, or a full
          closure for emergency work all count. When VDOT posts one, the verdict at the top of this page reads
          CLOSED and names the segment.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          A lane closure is not a shutdown, and this page never calls it one. Neither is a restriction, like a
          lowered variable speed limit in fog or a high profile vehicle restriction in wind, and neither is an
          advisory. The distinctions matter on this mountain more than most, because fog can make the road
          effectively impassable at speed while it remains legally open: the honest answer then is the
          RESTRICTED verdict, the lowered speed signs, and white cameras, and this page reports exactly that
          instead of crying shutdown.
        </p>
      </section>

      <section aria-label="Where shutdown information comes from" className="mt-10 space-y-4">
        <h2 className="text-headline-sm text-on-surface">Where shutdown and closure information comes from</h2>
        <p className="text-body-md text-secondary leading-relaxed">
          Every status on this page comes from VDOT's published 511 Virginia data for Interstate 77, read every
          few minutes: the incidents and work zones dataset and the minor incidents feed the state's own map
          renders, plus the corridor's message signs when they are posting. The{" "}
          <Link href="/status-history" className="text-primary font-semibold hover:underline">status history page</Link>{" "}
          keeps the log of verdict changes over time, and the{" "}
          <Link href="/alerts" className="text-primary font-semibold hover:underline">alerts page</Link>{" "}
          carries every posted event, not just closures.
        </p>
      </section>

      <section aria-label="The corridor right now" className="mt-10 space-y-4">
        <h2 className="text-headline-sm text-on-surface">The corridor right now</h2>
        <div className="space-y-3">
          {segments.map((seg) => (
            <SegmentRow key={seg.key} seg={seg} />
          ))}
        </div>
      </section>

      <section aria-label="Why I-77 shuts down at Fancy Gap" className="mt-10 space-y-4">
        <h2 className="text-headline-sm text-on-surface">Why I-77 shuts down at Fancy Gap</h2>
        <p className="text-body-md text-secondary leading-relaxed">
          Fog is the historic cause. The pileup record on this climb (about 56 vehicles in February 1997, 50 in
          September 2005, more than 70 with two deaths in November 2010, and 96 vehicles in 18 crashes with
          three deaths on March 31, 2013) is a record of mornings when traffic met a fog bank at speed and the
          road filled with wreckage faster than it could be cleared. A multi vehicle pileup on a four percent
          grade with limited shoulders is an hours long closure by physics, not by anyone's choice.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          Winter is the second cause: the plateau segments freeze first, snow crosses the crest while the
          valley is still raining, and VDOT will close the mountain rather than let traffic stack up on ice on
          a grade. The third cause is the ordinary crash in the wrong place: on the climb there is often
          nowhere to put a wreck except in a lane, and a lane blocked on the grade behind slow trucks becomes a
          direction stopped, then a direction closed.
        </p>
      </section>

      <section aria-label="What to do when I-77 is shut down" className="mt-10 space-y-4">
        <h2 className="text-headline-sm text-on-surface">What to do when I-77 is shut down</h2>
        <p className="text-body-md text-secondary leading-relaxed">
          If you have not started: wait. Hillsville, Fancy Gap, and Mount Airy all have fuel, food, and lodging,
          and most closures here clear in hours. If you are already in the queue: stay in your vehicle unless
          directed otherwise, keep the lane clear for emergency vehicles, and do not follow other drivers onto
          local roads you do not know in the weather that closed an interstate. If you must reroute, use
          VDOT's posted detour or an interstate reroute via I-81, and budget hours, not minutes. Check this
          page before you rejoin: a reopening posts here within minutes of the state posting it.
        </p>
      </section>

      <div className="mt-10">
        <StormAlerts />
      </div>

      <FaqBlock faqs={FAQS} />
    </main>
  );
}
