// Widget embed route, one per segment: a lightweight standalone
// card with the segment's live status and a visible credit link
// back to the segment page. Marked noindex in metadata and kept
// out of the sitemap, so embeds never compete with the real
// pages. The root layout still wraps embeds (header, footer, and
// bottom nav render), which is the network pattern for embed
// routes on this stack; the card itself is the embed payload.
// dynamicParams is false: an unknown segment is a real 404.

import { notFound } from "next/navigation";
import { getCorridor } from "@/lib/feeds";
import { SEGMENTS, getSegment } from "@/lib/segments";
import { formatStamp } from "@/lib/verdict";
import { SITE } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return SEGMENTS.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({ params }) {
  const { segment: slug } = await params;
  const seg = getSegment(slug);
  if (!seg) return { robots: { index: false } };
  return {
    title: `I-77 ${seg.name} Status Widget | i77pass.com`,
    robots: { index: false, follow: false },
  };
}

const TONES = {
  3: "bg-red-700",
  2: "bg-amber-500",
  0: "bg-emerald-600",
  "-1": "bg-slate-600",
};

export default async function WidgetPage({ params }) {
  const { segment: slug } = await params;
  const meta = getSegment(slug);
  if (!meta) notFound();
  const corridor = await getCorridor();
  const seg = corridor.segments[meta.key];
  const tone = TONES[String(seg.rank)] || TONES["-1"];
  const target = `${SITE.baseUrl}/segments/${meta.slug}`;

  return (
    <main className="max-w-xl mx-auto px-4 pb-10">
      <div className="rounded-2xl overflow-hidden border border-outline-variant/40 bg-white shadow-sm">
        <div className={`p-4 ${tone}`}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
            I-77 · {meta.name}
          </p>
          <p className="text-2xl font-black text-white leading-tight mt-1">{seg.statusWord}</p>
          <p className="text-white/85 text-sm font-semibold mt-0.5">{seg.statusLine}</p>
        </div>
        <div className="p-4 flex items-center justify-between gap-3">
          <p className="text-xs text-secondary">
            Mileposts {meta.mpFrom} to {meta.mpTo} · Updated {formatStamp(corridor.fetchedAt)} · VDOT via 511 Virginia
          </p>
          <a
            href={target}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm font-bold text-primary hover:underline"
          >
            i77pass.com
          </a>
        </div>
      </div>
    </main>
  );
}
