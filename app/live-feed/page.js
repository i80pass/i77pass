// Live feed hub: the corridor's cameras as a feed, grouped by
// segment, over the corridor verdict. The master's live feed
// carries the same title family as its cameras page; here the
// feed is the fast scanning surface and the cameras index is the
// reference surface. All stills show on this page because a feed
// page is the full list surface for scanning, grouped so no
// single grid runs long; segment pages and the homepage follow
// the camera count rule.

import VerdictBar from "@/components/VerdictBar";
import CameraCard from "@/components/CameraCard";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { SEGMENTS } from "@/lib/segments";
import { camerasForSegment, CAMERA_COUNT } from "@/lib/cameras";
import { corridorStatusSentence } from "@/lib/verdict";
import { webPageSchema, faqSchema, cameraListSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const revalidate = 60;

export const metadata = {
  title: "I-77 Live Camera Feed: Fancy Gap, Virginia | i77pass.com",
  description:
    "The live I-77 camera feed: VDOT stills in driving order from the North Carolina line to Hillsville, grouped by segment and concentrated on the Fancy Gap climb, with the corridor's current status from VDOT via 511 Virginia.",
  alternates: { canonical: siteUrl("/live-feed") },
  openGraph: { title: "I-77 Live Camera Feed | i77pass.com", description: "VDOT cameras on I-77 in driving order, with live corridor status.", images: ["/og-image.png"] },
};

const FAQS = [
  {
    q: "Is this feed really live?",
    a: "The stills are the current VDOT frames served from the 511 Virginia feed, refreshed as the agency updates them, and the status banner is read from the live state event feed. On the camera pages the still is what this site carries; most corridor cameras also stream live video on 511 Virginia itself.",
  },
  {
    q: "Where are the cameras concentrated?",
    a: "On the climb. VDOT runs the densest set of cameras between mileposts 4.3 and 8.7, the steepest miles where the fog bank forms, with more at the state line, the summit, and across the plateau to Hillsville. The mountain is watched closest of all because its weather changes fastest.",
  },
];

export default async function LiveFeedPage() {
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
          webPageSchema({ path: "/live-feed", title: metadata.title, description: metadata.description, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Live Feed", path: "/live-feed" },
          ]),
          ...(camerasForSegment(2).length ? [cameraListSchema(camerasForSegment(2).slice(0, 3), "I-77 Live Feed, the Fancy Gap Climb")] : []),
          faqSchema(FAQS),
        ]}
      />
      <div className="flex items-center gap-4 pt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/i77-shield.webp" alt="Interstate 77 shield" width={72} height={72} className="w-[72px] h-[72px] shrink-0" />
        <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface">
          I-77 Live Camera Feed
        </h1>
      </div>
      <div className="mt-4">
        <VerdictBar seg={combined} fetchedAt={corridor.fetchedAt} label="Interstate 77 current status" />
      </div>
      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-5">{sentence}</p>
      <p className="text-body-md text-secondary leading-relaxed mt-3">
        {CAMERA_COUNT ? `${CAMERA_COUNT} VDOT stills in driving order, grouped by segment. The climb run is the dense part, because the climb is where the weather happens.` : "VDOT stills in driving order, grouped by segment. The climb run is the dense part, because the climb is where the weather happens."}
      </p>

      {SEGMENTS.map((meta) => {
        const cams = camerasForSegment(meta.key);
        if (!cams.length) {
          return (
            <section key={meta.key} aria-label={`Feed, ${meta.name}`} className="mt-10">
              <h2 className="text-headline-sm text-on-surface mb-3">{meta.name}</h2>
              <p className="text-body-md text-secondary leading-relaxed rounded-2xl border border-outline-variant/40 bg-white p-5">
                No cameras listed on this segment yet. Its live status is the segment row on the homepage, built from the VDOT event feed.
              </p>
            </section>
          );
        }
        return (
          <section key={meta.key} aria-label={`Feed, ${meta.name}`} className="mt-10">
            <h2 className="text-headline-sm text-on-surface mb-3">
              {meta.name} <span className="text-secondary text-base font-semibold">({cams.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cams.map((cam) => (
                <CameraCard key={cam.slug} cam={cam} />
              ))}
            </div>
          </section>
        );
      })}

      <FaqBlock faqs={FAQS} />

      <p className="text-xs text-secondary mt-10">{SITE.dataCredit}</p>
    </main>
  );
}
