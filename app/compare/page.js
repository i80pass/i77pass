// Comparison page: the three segments side by side with a computed
// live verdict line, mirroring the master's comparison pattern.
// One card per segment with its live status, mileposts, elevation
// span, camera count (computed from the registry), and junctions,
// under a corridor verdict computed from the same read.

import Link from "next/link";
import VerdictBar from "@/components/VerdictBar";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { SEGMENTS } from "@/lib/segments";
import { camerasForSegment, CAMERA_COUNT } from "@/lib/cameras";
import { corridorStatusSentence } from "@/lib/verdict";
import { webPageSchema, faqSchema, roadConditionSchema, breadcrumbSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";

export const revalidate = 60;

export const metadata = {
  title: "I-77 Segments Compared: Fancy Gap Side by Side | i77pass.com",
  description:
    "All three I-77 segments side by side: live status, mileposts, elevations, camera counts, and junctions for the state line, Lambsburg, Fancy Gap, and Hillsville.",
  alternates: { canonical: siteUrl("/compare") },
  openGraph: { title: "I-77 Segments Compared | i77pass.com", description: "The three I-77 Fancy Gap segments side by side with live status.", images: ["/og-image.png"] },
};

const CHIP = {
  3: "bg-red-700 text-white",
  2: "bg-amber-500 text-white",
  0: "bg-emerald-600 text-white",
  "-1": "bg-slate-500 text-white",
};

export default async function ComparePage() {
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
  const busiest = SEGMENTS.reduce((a, b) => (camerasForSegment(b.key).length > camerasForSegment(a.key).length ? b : a), SEGMENTS[0]);

  const faqs = [
    {
      q: "Which I-77 segment closes most often?",
      a: "The climb segment, Lambsburg to Fancy Gap. It takes the fog pileups, the fog and wind restrictions, and the crash closures that follow from the grade. The plateau segment closes in winter storms, and the foot segment closes least, usually for crashes spilling down from the climb.",
    },
    {
      q: "Which segment has the most cameras?",
      a: CAMERA_COUNT
        ? `${busiest.name}, with ${camerasForSegment(busiest.key).length} of the corridor's ${CAMERA_COUNT} VDOT cameras. The climb segments carry most of the corridor's cameras between them, because the climb is where the weather needs watching.`
        : "The climb segments: VDOT concentrates its cameras on the steep miles where the fog forms.",
    },
    {
      q: "Which segment climbs the most?",
      a: "Lambsburg to Fancy Gap climbs about 900 feet in its four and a half miles, and the two climb segments together gain about 1,400 feet from the state line to the summit. That climb is why fog, truck speed splits, and brake heat rule the middle of this drive.",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/compare", title: metadata.title, description: metadata.description, dateModified: corridor.fetchedAt.toISOString() }),
          roadConditionSchema({ path: "/compare", name: "I-77 Segment Comparison", seg: combined, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Compare the Segments", path: "/compare" },
          ]),
          faqSchema(faqs),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        I-77 Segments Compared
      </h1>
      <div className="mt-4">
        <VerdictBar seg={combined} fetchedAt={corridor.fetchedAt} label="Interstate 77 current status" />
      </div>
      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-5">{sentence}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-10">
        {SEGMENTS.map((meta) => {
          const seg = corridor.segments[meta.key];
          const cams = camerasForSegment(meta.key);
          const gain = meta.elevToFt - meta.elevFromFt;
          return (
            <article key={meta.key} className="rounded-2xl border border-outline-variant/40 bg-white p-5 flex flex-col">
              <span className={`self-start px-3 py-1.5 rounded-full text-xs font-black tracking-wide ${CHIP[String(seg.rank)] || CHIP["-1"]}`}>
                {seg.statusWord}
              </span>
              <h2 className="font-black text-on-surface text-lg leading-tight mt-3">{meta.name}</h2>
              <p className="text-sm text-secondary mt-1">{seg.statusLine}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-secondary">Mileposts</dt>
                  <dd className="font-semibold text-on-surface">{meta.mpFrom} to {meta.mpTo} ({meta.mpTo - meta.mpFrom} mi)</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-secondary">Elevation span</dt>
                  <dd className="font-semibold text-on-surface">{meta.elevFromFt.toLocaleString("en-US")} to {meta.elevToFt.toLocaleString("en-US")} ft</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-secondary">Elevation change, driving north</dt>
                  <dd className="font-semibold text-on-surface">{gain >= 0 ? "+" : ""}{gain.toLocaleString("en-US")} ft</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-secondary">Cameras</dt>
                  <dd className="font-semibold text-on-surface">{cams.length}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-secondary">Posted events</dt>
                  <dd className="font-semibold text-on-surface">{seg.ok ? seg.events.length : "Feed not answering"}</dd>
                </div>
              </dl>
              <p className="text-sm text-secondary leading-relaxed mt-3 flex-1">{meta.intro}</p>
              <Link
                href={`/segments/${meta.slug}`}
                className="mt-4 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                Open the segment page
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
            </article>
          );
        })}
      </div>

      <section aria-label="How to use this comparison" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-2">How to use this page</h2>
        <p className="text-body-md text-secondary leading-relaxed">
          Read it top to bottom as the drive itself, the state line at the start of your trip and Hillsville at the end.
          If the red or amber sits in the middle card, the problem is the climb, and no departure time fixes
          fog, only waiting or rerouting does. If it sits in the first or last card, the problem is an approach or
          the plateau, and it may clear before you reach it. The elevation change column is the weather story in one
          number: the segments that climb 1,400 feet into the cloud base are the ones where fog lives.
        </p>
      </section>

      <FaqBlock faqs={faqs} />
    </main>
  );
}
