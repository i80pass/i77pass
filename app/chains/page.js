// Chain control page, in the master's /chains pattern: H1 with
// the guide crosslink, the speakable live status paragraph, the
// live segment list, and the questions drivers ask. The content
// is Virginia's real winter traction system, stated honestly:
// Virginia runs no chain control program, there are no chain
// laws, chain tiers, or traction checkpoints on this corridor or
// anywhere in the state, and this page never invents one. What
// the page reports live is what VDOT posts instead: restrictions,
// advisories, variable speed limits, and closures, segment by
// segment, from the same corridor read as the verdict.

import Link from "next/link";
import SegmentRow from "@/components/SegmentRow";
import FaqBlock from "@/components/FaqBlock";
import StormAlerts from "@/components/StormAlerts";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { SEGMENTS } from "@/lib/segments";
import { corridorStatusSentence } from "@/lib/verdict";
import { webPageSchema, faqSchema, breadcrumbSchema, roadConditionSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";

export const revalidate = 60;

export const metadata = {
  title: "Chains Required on I-77? I-77 Chain Control Today | i77pass.com",
  description:
    "Are chains required on I-77 over Fancy Gap today? No: Virginia runs no chain control program and posts restrictions, advisories, and variable speed limits instead. Live segment status and the winter traction rules, explained plainly.",
  alternates: { canonical: siteUrl("/chains") },
  openGraph: { title: "I-77 Chain Control Today | i77pass.com", description: "No chain controls exist on I-77 in Virginia. Live restrictions, advisories, and winter traction status for the Fancy Gap corridor, from VDOT via 511 Virginia.", images: ["/og-image.png"] },
};

const FAQS = [
  {
    q: "Are chains required on I-77 over Fancy Gap today?",
    a: "No, and they never are in the chain control sense. Virginia does not run a chain control system on this corridor or anywhere else in the state: no chain laws, no chain tiers, no traction checkpoints. What can be posted today is in the live list on this page: restrictions, advisories, variable speed limits, and closures, in VDOT's own language.",
  },
  {
    q: "What does Virginia post instead of chain controls?",
    a: "Restrictions, advisories, and closures, posted event by event through VDOT and 511 Virginia. On this climb the signature posting is the variable speed limit, which drops when fog cuts visibility. In winter, VDOT posts winter weather advisories, treatment and plow reports, and travel restrictions as conditions require, and closes the mountain when it has to.",
  },
  {
    q: "Should I carry chains over Fancy Gap in winter?",
    a: "No Virginia rule requires you to carry them for this drive, and there is no checkpoint where anyone will ask. Carrying chains or driving on proper winter tires is still a reasonable personal choice for the plateau segments in a posted winter storm, where snow that is rain at the state line collects at 2,500 to 2,800 feet. What the state requires is simpler: obey the posted restrictions and the variable speed limit, and do not start the climb on worn tires in a winter event.",
  },
  {
    q: "What are the truck rules on the climb in winter?",
    a: "They are set and published by VDOT, and this site reports them as published. Expect the variable speed limit to bind trucks first in fog, high profile vehicle advisories and restrictions in wind, and any temporary truck guidance during crash clearance or winter events. There is no truck chain tier to comply with, because Virginia has no chain tiers.",
  },
];

export default async function ChainsPage() {
  const corridor = await getCorridor();
  const segments = SEGMENTS.map((s) => corridor.segments[s.key]);
  const sentence = corridorStatusSentence(corridor, segments);
  const combined = {
    ...corridor.combined,
    name: "North Carolina Line to Hillsville",
    statusLine:
      corridor.combined.statusWord === "STATUS UNAVAILABLE"
        ? segments[0].statusLine
        : `Interstate 77, North Carolina line to Hillsville: ${corridor.combined.statusWord.toLowerCase()} based on the worst segment right now.`,
  };

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/chains", title: metadata.title, description: metadata.description, dateModified: corridor.fetchedAt.toISOString() }),
          roadConditionSchema({ path: "/chains", name: "Interstate 77 Chain Control and Restrictions, North Carolina Line to Hillsville", seg: combined, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Chain Control", path: "/chains" },
          ]),
          faqSchema(FAQS),
        ]}
      />
      <div className="flex items-start justify-between gap-4 pt-6">
        <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface">
          Chain Controls on I-77 Today
        </h1>
        <Link href="/restrictions" className="text-xs font-bold text-primary active:opacity-70 shrink-0 mt-2">
          Restrictions Guide →
        </Link>
      </div>

      <div className="mt-4 mb-8 max-w-[820px]">
        <p className="speakable-status text-body-md text-secondary leading-relaxed">
          {sentence} Virginia does not run a chain control program, so no chain controls are ever posted on
          this corridor: there are no chain laws, no chain tiers, and no traction checkpoints. Every segment
          on I-77, with the restrictions and advisories VDOT posts instead, is in the live list below.
        </p>
        <p className="text-body-md text-secondary leading-relaxed mt-2">
          New to Virginia's system?{" "}
          <Link href="/restrictions" className="font-bold text-primary hover:underline">
            How restrictions and winter traction work on I-77
          </Link>{" "}
          explains the variable speed limit, fog and wind advisories, and what VDOT posts in winter instead
          of chain tiers.
        </p>
      </div>

      <section aria-label="I-77 segment status" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">I-77</h2>
        <div className="space-y-3">
          {segments.map((seg) => (
            <SegmentRow key={seg.key} seg={seg} />
          ))}
        </div>
      </section>

      <section aria-label="What Virginia does instead of chain control" className="mt-10 space-y-4">
        <h2 className="text-headline-sm text-on-surface">What Virginia does instead of chain control</h2>
        <p className="text-body-md text-secondary leading-relaxed">
          Western passes run on chain tiers: posted levels that tell you when to chain up and what your
          vehicle needs to proceed. Virginia never adopted that system. On I-77 over Fancy Gap there is
          nothing to chain up for, no checkpoint to stop at, and no tier to decode. If a website or a sign
          anywhere suggests a chain requirement for this corridor, it is describing some other state's road.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          The system here is postings. VDOT watches the climb with cameras and road weather sensors, and
          posts what the mountain is doing: a variable speed limit that drops in fog, wind advisories and
          restrictions for high profile vehicles, winter advisories with treatment and plow reports, lane
          closures for work and crashes, and full closures when the road cannot be run. Each posting is an
          event with a place and a time, and the live list above is those postings, segment by segment.
        </p>
        <p className="text-body-md text-secondary leading-relaxed">
          The winter judgment the chain tiers make for you out west stays with you here. The plateau segments
          freeze first and hold snow longest, and a posted winter event on this corridor deserves the same
          respect as a chain tier: slow down, keep distance, and let the plows and the fog decide your timing.
          The standing rule is the network's rule everywhere: believe the stricter of the forecast and the
          cameras.
        </p>
      </section>

      <div className="mt-10">
        <StormAlerts />
      </div>

      <FaqBlock faqs={FAQS} />
    </main>
  );
}
