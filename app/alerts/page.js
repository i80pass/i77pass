// Alerts and closures hub: a real page, not a signup shell. The
// corridor verdict first, then live rows from the state feeds when
// it is connected (alerts, all events, message signs), the honest
// state when it is not, segment rows for closures by segment, and
// the storm alert signup closing the page, as the Gold Standard
// requires of this hub.

import VerdictBar from "@/components/VerdictBar";
import SegmentRow from "@/components/SegmentRow";
import EventsList from "@/components/EventsList";
import StormAlerts from "@/components/StormAlerts";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { SEGMENTS } from "@/lib/segments";
import { corridorStatusSentence } from "@/lib/verdict";
import { webPageSchema, faqSchema, roadConditionSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "I-77 Alerts and Closures Today | i77pass.com",
  description:
    "Current I-77 alerts, closures, and restrictions from VDOT via 511 Virginia: corridor wide alerts, every posted event, message sign text, and segment by segment closure status, North Carolina line to Hillsville.",
  alternates: { canonical: siteUrl("/alerts") },
  openGraph: { title: "I-77 Alerts and Closures | i77pass.com", description: "Live I-77 alerts and closures from VDOT via 511 Virginia.", images: ["/og-image.png"] },
};

const FAQS = [
  {
    q: "Where do I-77 closure alerts come from?",
    a: "From VDOT, published through 511 Virginia. Closures, restrictions, and weather events are posted there by the state and read by this page as they are posted. When the feed is not answering, this page says so rather than showing a quiet, empty list that looks like an all clear.",
  },
  {
    q: "How do I get I-77 Fancy Gap alerts by email?",
    a: "Sign up at the bottom of this page. Get told when the mountain changes: closures, fog events, major delays, and reopenings on I-77 between the North Carolina line and Hillsville, and nothing else. The signup is handled through Resend, and every alert email carries an unsubscribe link.",
  },
  {
    q: "Does Virginia post chain control alerts for I-77?",
    a: "No, because Virginia has no chain controls. Alerts here are closures, restrictions, advisories, fog and wind postings, crashes, weather events, and message sign text, the things VDOT actually posts. See the restrictions page for how the system works.",
  },
];

export default async function AlertsPage() {
  const corridor = await getCorridor();
  const segments = SEGMENTS.map((s) => corridor.segments[s.key]);
  const combined = {
    ...corridor.combined,
    name: "North Carolina Line to Hillsville",
    statusLine:
      corridor.combined.statusWord === "STATUS UNAVAILABLE"
        ? segments[0].statusLine
        : `Interstate 77, North Carolina line to Hillsville: ${corridor.combined.statusWord.toLowerCase()} based on the worst segment right now.`,
  };
  const sentence = corridorStatusSentence(corridor, segments);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/alerts", title: metadata.title, description: metadata.description, dateModified: corridor.fetchedAt.toISOString() }),
          roadConditionSchema({ path: "/alerts", name: "I-77 Alerts and Closures", seg: combined, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Alerts and Closures", path: "/alerts" },
          ]),
          faqSchema(FAQS),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        I-77 Alerts and Closures
      </h1>
      <div className="mt-4">
        <VerdictBar seg={combined} fetchedAt={corridor.fetchedAt} label="Interstate 77 current status" />
      </div>
      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-5">{sentence}</p>

      {!corridor.ok && (
        <section aria-label="Feed status" className="mt-8">
          <p className="text-body-md text-secondary leading-relaxed rounded-2xl border border-outline-variant/40 bg-white p-5">
            The live VDOT feed is not answering, so no alerts, closures, or sign text can be listed here.
            That is a statement about the feed, not about the road: check 511 Virginia directly before you
            drive. When the feed answers again, this page carries the state&apos;s live rows with no
            other change.
          </p>
        </section>
      )}

      {corridor.alerts.length > 0 && (
        <section aria-label="State alerts" className="mt-10">
          <h2 className="text-headline-sm text-on-surface mb-3">State alerts</h2>
          <div className="space-y-3">
            {corridor.alerts.map((a) => (
              <article key={a.id} className="rounded-2xl border border-amber-300/60 bg-amber-50 p-4">
                <h3 className="font-bold text-on-surface">{a.headline}</h3>
                {a.description && <p className="text-sm text-secondary leading-relaxed mt-1">{a.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section aria-label="All events" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">Closures and events, live rows</h2>
        <EventsList
          events={corridor.combined.events}
          emptyText={
            corridor.ok
              ? "VDOT posts no events on I-77 on this corridor right now. No closures, no restrictions, no weather events."
              : "No live rows yet, because the VDOT feed is not answering."
          }
        />
      </section>

      {corridor.signs.length > 0 && (
        <section aria-label="Message signs" className="mt-10">
          <h2 className="text-headline-sm text-on-surface mb-3">Message signs on I-77</h2>
          <div className="space-y-3">
            {corridor.signs.map((s) => (
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

      <section aria-label="Closures by segment" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">Status by segment</h2>
        <div className="space-y-3">
          {segments.map((seg) => (
            <SegmentRow key={seg.key} seg={seg} />
          ))}
        </div>
      </section>

      <FaqBlock faqs={FAQS} />

      <div className="mt-10">
        <StormAlerts />
      </div>

      <p className="text-xs text-secondary mt-10">{SITE.dataCredit}</p>
    </main>
  );
}
