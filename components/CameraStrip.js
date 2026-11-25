// A set of cameras in driving order as a grid under a section
// heading, with the network camera count rule built in (Gold
// Standard, Nov 15, 2026): five or fewer cameras in total, all of
// them show; more than five, only the first three show, followed
// by the See All Webcams button in the master's style linking to
// the full camera page for the set. `seeAllHref` is that full
// page. An empty set renders the honest no cameras note when
// `emptyText` is given, and nothing otherwise.

import Link from "next/link";
import CameraCard from "./CameraCard";

export default function CameraStrip({ cameras, heading, sub, seeAllHref, emptyText, priorityFirst = false }) {
  const total = cameras?.length || 0;
  if (!total) {
    if (!emptyText) return null;
    return (
      <section aria-label={heading} className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">{heading}</h2>
        <p className="text-body-md text-secondary leading-relaxed rounded-2xl border border-outline-variant/40 bg-white p-5">{emptyText}</p>
      </section>
    );
  }
  const showAll = total <= 5;
  const shown = showAll ? cameras : cameras.slice(0, 3);
  return (
    <section aria-label={heading} className="mt-10">
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <h2 className="text-headline-sm text-on-surface">{heading}</h2>
        </div>
        <Link href={seeAllHref || "/cameras"} className="shrink-0 text-sm font-semibold text-primary hover:underline">
          All cameras
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((cam, i) => (
          <CameraCard key={cam.slug} cam={cam} priority={priorityFirst && i === 0} />
        ))}
      </div>
      {!showAll && (
        <Link
          href={seeAllHref || "/cameras"}
          className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl btn-nav-dark text-sm font-bold uppercase tracking-wide active:scale-[0.98] transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">videocam</span>
          SEE ALL WEBCAMS
        </Link>
      )}
      {/* The descriptive line renders below the cameras, never
          between the verdict bar and the first camera: in the
          hero span the master carries only the strip heading and
          the See all link above the first image. */}
      {sub && <p className="text-sm text-secondary mt-3">{sub}</p>}
    </section>
  );
}
