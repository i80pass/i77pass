// The verdict bar, following the i80pass master pattern: a full
// width coloured box, the route shield on the left, the verdict
// word in the largest type on the page, one short status line
// under it, and the timestamp below the box in small type. The bar
// is never a link. The word and line are always derived from the
// VDOT read in lib/feeds.js, never hardcoded; with no
// key or no data the box renders the designed STATUS UNAVAILABLE
// state in slate. Server rendered.

import { formatStamp } from "@/lib/verdict";

const TONES = {
  3: "bg-red-700",
  2: "bg-amber-500",
  0: "bg-emerald-600",
  "-1": "bg-slate-600",
};

// Interstate 77 shield, drawn in the United States interstate
// shield form: red band with INTERSTATE, blue field, white 77.
// The same artwork ships as /i77-shield.png and /i77-shield.webp.
export function I77Shield({ className = "shrink-0 w-16 h-[4.5rem] drop-shadow-lg" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interstate 77">
      <path d="M50,3 C50,3 93,9 93,26 L93,58 C93,78 50,97 50,97 C50,97 7,78 7,58 L7,26 C7,9 50,3 50,3Z" fill="white" />
      <path d="M50,6.5 C50,6.5 89.5,12 89.5,26.5 L89.5,57.5 C89.5,75.5 50,93.5 50,93.5 C50,93.5 10.5,75.5 10.5,57.5 L10.5,26.5 C10.5,12 50,6.5 50,6.5Z" fill="#003a63" />
      <path d="M50,6.5 C50,6.5 89.5,12 89.5,26.5 L89.5,32 L10.5,32 L10.5,26.5 C10.5,12 50,6.5 50,6.5Z" fill="#b31942" />
      <text x="50" y="26" textAnchor="middle" fill="white" fontSize="10.5" fontWeight="700" fontFamily="Arial,sans-serif" letterSpacing="1.5">INTERSTATE</text>
      <text x="50" y="76" textAnchor="middle" fill="white" fontSize="42" fontWeight="900" fontFamily="Arial,sans-serif">77</text>
    </svg>
  );
}

export default function VerdictBar({ seg, fetchedAt, label }) {
  const tone = TONES[String(seg.rank)] || TONES["-1"];
  return (
    <section aria-label={label || `${seg.name} current status`}>
      <div className={`flex items-center gap-5 p-5 rounded-2xl aura-shadow ${tone}`}>
        <I77Shield />
        <div>
          <p className="text-3xl md:text-4xl font-black text-white leading-tight">{seg.statusWord}</p>
          <p className="speakable-status text-white/80 font-semibold text-sm mt-1">{seg.statusLine}</p>
        </div>
      </div>
      <p className="text-[11px] text-secondary mt-2 font-mono uppercase tracking-wide">
        Last updated at: {formatStamp(fetchedAt || new Date())} · VDOT via 511 Virginia
      </p>
    </section>
  );
}
