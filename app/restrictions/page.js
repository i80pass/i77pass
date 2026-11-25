// Restrictions and winter traction page: the page that sits in
// the slot the master reserves for chain controls. NAMED
// EXCEPTION, logged in BUILD-LOG.md: Virginia has no chain
// control system, no chain laws, no chain tiers, and no traction
// checkpoints, so the slot carries the corridor's restrictions
// and winter traction rules in the state's own language instead.
// The copy states the no chains fact plainly, explains how VDOT
// posting works (variable speed limits, fog and wind advisories,
// winter advisories and restrictions), and reports truck rules
// as published by the state, never inventing limits of its own.

import Link from "next/link";
import VerdictBar from "@/components/VerdictBar";
import SegmentRow from "@/components/SegmentRow";
import FaqBlock from "@/components/FaqBlock";
import StormAlerts from "@/components/StormAlerts";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { SEGMENTS } from "@/lib/segments";
import { webPageSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";

export const revalidate = 120;

export const metadata = {
  title: "I-77 Restrictions and Winter Traction: Fancy Gap, Virginia | i77pass.com",
  description:
    "Are there chain laws on I-77 over Fancy Gap? No: Virginia posts restrictions, advisories, and variable speed limits instead. Fog and wind advisories, winter traction rules, and truck rules as published, explained plainly.",
  alternates: { canonical: siteUrl("/restrictions") },
  openGraph: { title: "I-77 Restrictions and Winter Traction | i77pass.com", description: "How restrictions work on I-77 over Fancy Gap: no chain laws, posted restrictions and advisories from VDOT via 511 Virginia.", images: ["/og-image.png"] },
};

const FAQS = [
  {
    q: "Are there chain laws or chain control on I-77 in Virginia?",
    a: "No. Virginia does not run a chain control system on this corridor or anywhere else in the state. There are no chain laws, no chain tiers, and no traction checkpoints here. Virginia posts restrictions, advisories, variable speed limits, and closures instead, and that is the system this page reports.",
  },
  {
    q: "What is the variable speed limit on the Fancy Gap climb?",
    a: "VDOT operates a variable speed limit system on the climb, built for the fog. When visibility drops, the posted limit on the signs drops with it, and the signed limit is the legal limit. A lowered speed on those signs is also information: it means VDOT's operators are seeing conditions on the upper mountain that you may not have reached yet.",
  },
  {
    q: "What is the difference between a restriction, an advisory, and a closure?",
    a: "A restriction is a posted rule that limits how or what you can drive through a section, like a lowered speed limit or a high profile vehicle restriction in wind. An advisory is a warning that conditions are hazardous or changing, like a fog or winter weather advisory, without a full closure. A closure is a full stop: when VDOT closes the mountain, through traffic waits or reroutes on interstate detours that add hours.",
  },
  {
    q: "What are the winter traction rules on I-77 in Virginia?",
    a: "Virginia's winter system runs on advisories and road condition reports, not chain tiers. VDOT treats and plows the climb, posts winter weather advisories and travel restrictions as conditions require, and can restrict travel to vehicles with appropriate traction during severe events. The practical rules are the state's: slow down, keep distance, and do not start the climb on worn tires in a posted winter event. This site reports VDOT's postings in the state's own language and never invents a traction tier.",
  },
  {
    q: "What are the truck rules on the climb?",
    a: "They are set and published by VDOT, and this site reports them as published. Expect the variable speed limit to bind trucks first in fog, high profile vehicle advisories and restrictions in wind (posted for this corridor as recently as the week this site launched), and any temporary truck guidance during crash clearance or winter events. Oversize and overweight loads follow Virginia's permit and routing rules and must not enter a section whose posted limits they cannot meet.",
  },
];

export default async function RestrictionsPage() {
  const corridor = await getCorridor();
  const climb = corridor.segments[2];
  const segments = SEGMENTS.map((s) => corridor.segments[s.key]);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/restrictions", title: metadata.title, description: metadata.description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Restrictions and Winter Traction", path: "/restrictions" },
          ]),
          faqSchema(FAQS),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        Restrictions and Winter Traction on I-77
      </h1>
      <div className="mt-4">
        <VerdictBar seg={climb} fetchedAt={corridor.fetchedAt} label="The Fancy Gap climb current status" />
      </div>
      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-5">
        There are no chain laws on I-77 over Fancy Gap. Virginia posts restrictions, advisories, and variable speed limits instead, and on this climb the posting you will meet most often is a speed limit that drops when the fog comes down.
      </p>

      <section aria-label="How restrictions work on this corridor" className="mt-10 space-y-4">
        <h2 className="text-headline-sm text-on-surface">How restrictions work on this corridor</h2>
        <p className="text-body-md text-secondary leading-relaxed">
          Virginia does not run this corridor like a western mountain pass. There is no chain control system on
          I-77 over Fancy Gap. There are no chain laws, no chain tiers, and no traction checkpoints to explain
          or to wait at. Do not look for them here, and do not bring chains expecting a posted chain requirement
          for this stretch.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          Instead, Virginia posts restrictions, advisories, and closures through VDOT and 511 Virginia. That is
          the system this page reports. The postings that matter on this corridor come in a handful of forms,
          and each one asks something different of you.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          The variable speed limit is this corridor's signature restriction. VDOT spent about 7.5 million
          dollars on the system for this climb because fog here can cut visibility to near zero faster than any
          fixed limit can describe. When the signs lower the speed, that is the legal limit, and it is also
          VDOT telling you what the upper mountain looks like before you get there. Treat a dropped limit as a
          fog report, not a suggestion.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          A restriction limits how or what you can drive through a posted section: a lowered speed, a lane
          closure for work or a crash, a width or weight limit in a work zone, or a high profile vehicle
          restriction when wind crosses the crest. Wind advisories for high profile vehicles are a standing
          feature of this corridor; VDOT posted one for mile markers 0 to 10 in December 2022 and again in the
          week this site launched. If you drive anything tall, light, or towing, those postings are addressed
          to you.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          An advisory warns that conditions are hazardous or changing, without a full closure: fog advisories,
          winter weather advisories, crash delay notices. In winter, advisories arrive with VDOT's treatment
          and plow reports for the climb and, in severe events, travel restrictions. An advisory on this
          mountain deserves to be taken seriously, because fog and winter weather are the two causes that most
          often turn a slow climb into a stopped one.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          A closure is a full stop. When VDOT closes the mountain, there is no short detour: through traffic
          waits at Hillsville, Fancy Gap, or Mount Airy, or reroutes on interstate detours that add hours.
          Closures here have followed fog pileups, winter storms, and major crashes. When this page says
          closed, it means the through lanes are closed, not merely slow. Shutdowns and closures have their own
          page: the{" "}
          <Link href="/shutdown" className="text-primary font-semibold hover:underline">I-77 shutdown and closures page</Link>.
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

      <section aria-label="Truck and oversize rules" className="mt-10 space-y-4">
        <h2 className="text-headline-sm text-on-surface">Truck and oversize rules, as published</h2>
        <p className="text-body-md text-secondary leading-relaxed">
          Truck and oversize rules for this corridor are set and published by VDOT. This site reports those
          rules as published and does not create its own limits.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          As published by the state, truck drivers should expect the variable speed limit to govern the climb in
          fog, high profile vehicle advisories and restrictions in wind, and any temporary truck guidance
          posted during crash clearance, work zones, or winter events. A quarter of this corridor's traffic is
          trucks, and a posted truck restriction on the grade affects every vehicle behind it, so this page
          states the affected direction and section plainly when a restriction is active.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          Oversize and overweight loads must follow Virginia's permit and routing rules, and loads that cannot
          meet a posted limit must not enter the section until the restriction lifts or the state issues a
          permitted alternate route. If you run oversize or overweight, confirm your permit and route with VDOT
          before you leave, and check this page on the day of travel for temporary restrictions posted after
          your permit was issued.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          If no truck or oversize restriction is listed on this page, that means VDOT is not posting one for
          the corridor at the time shown. It does not change the variable speed limit, which applies to all
          vehicles whenever the signs are lit.
        </p>
      </section>

      <div className="mt-10">
        <StormAlerts />
      </div>

      <FaqBlock faqs={FAQS} />
    </main>
  );
}
