// One segment status row in a stack: a coloured status chip, the
// segment name and its status line, and a chevron, the whole row
// linking to the segment page. Used by the homepage segment stack,
// the route page, and the comparison page. Server rendered.

import Link from "next/link";

const CHIP = {
  3: "bg-red-700 text-white",
  2: "bg-amber-500 text-white",
  0: "bg-emerald-600 text-white",
  "-1": "bg-slate-500 text-white",
};

export default function SegmentRow({ seg, href }) {
  const chip = CHIP[String(seg.rank)] || CHIP["-1"];
  return (
    <Link
      href={href || `/segments/${seg.slug}`}
      className="flex items-center gap-4 rounded-2xl border border-outline-variant/40 bg-white p-4 hover:shadow-md transition-shadow"
    >
      <span className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-black tracking-wide ${chip}`}>{seg.statusWord}</span>
      <span className="flex-1 min-w-0">
        <span className="block font-bold text-on-surface leading-tight">{seg.name}</span>
        <span className="block text-sm text-secondary mt-0.5">{seg.statusLine}</span>
        <span className="block text-xs text-secondary mt-0.5">
          Mileposts {seg.mpFrom} to {seg.mpTo} · {seg.elevFromLabel} to {seg.elevToLabel}
        </span>
      </span>
      <span className="material-symbols-outlined text-secondary shrink-0">chevron_right</span>
    </Link>
  );
}
