// Status history hub. The logger (scripts/log-status.mjs) starts
// at launch and appends a line whenever a segment's status
// signature changes. Until entries exist this page renders the
// honest empty state: it explains what the history will hold, and
// it does not backfill, reconstruct, or invent a single past
// status. This follows the newest sister's approach to the
// history wiring: no hosted database pointer carried over from
// the master, just the logger, its file, and this page.

import JsonLd from "@/components/JsonLd";
import FaqBlock from "@/components/FaqBlock";
import { getHistoryEntries } from "@/lib/history";
import { SEGMENTS } from "@/lib/segments";
import { formatStamp } from "@/lib/verdict";
import { webPageSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "I-77 Status History: Closures and Restrictions Log | i77pass.com",
  description:
    "The public status history for Interstate 77: a timestamped log of segment status changes, closures, and restrictions between the North Carolina line and Hillsville, recorded as they happen.",
  alternates: { canonical: siteUrl("/status-history") },
  openGraph: { title: "I-77 Status History | i77pass.com", description: "A timestamped log of I-77 segment status changes.", images: ["/og-image.png"] },
};

const FAQS = [
  {
    q: "What will the I-77 status history show?",
    a: "Every change in a segment's status signature, with the time it was recorded: a segment moving from open to restricted, a closure posting, a closure clearing. It is a log of what the VDOT feed said and when, kept in the open, which no other Fancy Gap source publishes.",
  },
  {
    q: "Why is the history empty?",
    a: "Because the logger starts when the site launches, and it records changes from that day forward. A history that began before the logger existed would have to be reconstructed, and a reconstructed history is a fabricated one. This page would rather be honestly empty for its first weeks.",
  },
];

export default function StatusHistoryPage() {
  const { enabled, entries } = getHistoryEntries(200);
  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/status-history", title: metadata.title, description: metadata.description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Status History", path: "/status-history" },
          ]),
          faqSchema(FAQS),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        I-77 Status History
      </h1>
      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-4">
        {enabled
          ? `${entries.length} recorded status ${entries.length === 1 ? "change" : "changes"} on Interstate 77, newest first.`
          : "No status history has been recorded yet. The logger starts at launch, and this page fills in from real recorded changes, never from reconstruction."}
      </p>

      {enabled ? (
        <section aria-label="Recorded status changes" className="mt-8">
          <div className="space-y-3">
            {entries.map((e, i) => (
              <article key={i} className="rounded-2xl border border-outline-variant/40 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                  {e.at ? formatStamp(new Date(e.at)) : ""}
                </p>
                <div className="mt-2 space-y-1">
                  {SEGMENTS.map((meta) => {
                    const sig = e.segments?.[meta.slug];
                    if (!sig) return null;
                    return (
                      <p key={meta.key} className="text-sm text-on-surface">
                        <span className="font-bold">{meta.name}:</span> {sig}
                      </p>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section aria-label="How the history works" className="mt-8 space-y-4">
          <p className="text-body-md text-secondary leading-relaxed">
            When the site launches, an hourly logger reads the corridor&apos;s segment verdicts from the VDOT feed
            layer and writes one timestamped entry whenever a segment&apos;s status signature changes: open to
            restricted, restricted to closed, closed back to open. The first run records the baseline. Nothing before
            that baseline exists in the log, because nothing was recorded, and this page will not pretend
            otherwise.
          </p>
          <p className="text-body-md text-secondary leading-relaxed">
            Over a year, that log becomes the corridor&apos;s memory: how many times the mountain
            closed, how long the longest closure lasted, which fog events and winter storms hit which segments. It is the same data
            the segment pages already carry live, kept instead of thrown away.
          </p>
        </section>
      )}

      <FaqBlock faqs={FAQS} />
    </main>
  );
}
