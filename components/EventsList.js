// Agency events list: closures first, then restrictions and
// weather, then everything else, each row with its type, its
// description as cleaned by the data layer, and its posted time.
// With no events (or no feed), the caller supplied empty text
// renders instead. Server rendered.

import { formatStamp } from "@/lib/verdict";

export default function EventsList({ events, emptyText }) {
  if (!events?.length) {
    return (
      <p className="text-body-md text-secondary leading-relaxed rounded-2xl border border-outline-variant/40 bg-white p-5">
        {emptyText}
      </p>
    );
  }
  const sorted = [...events].sort((a, b) => {
    const rank = (e) => (e.isFullClosure ? 0 : e.restrictions || e.hasRestrictions || e.isWeather || e.highSeverity ? 1 : 2);
    return rank(a) - rank(b);
  });
  return (
    <div className="space-y-3">
      {sorted.map((e) => (
        <article key={e.id} className="rounded-2xl border border-outline-variant/40 bg-white p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide text-white ${
                e.isFullClosure ? "bg-red-700" : e.restrictions || e.hasRestrictions || e.isWeather || e.highSeverity ? "bg-amber-500" : "bg-slate-500"
              }`}
            >
              {e.isFullClosure ? "CLOSURE" : e.typeLabel.toUpperCase()}
            </span>
            {e.direction && <span className="text-xs font-semibold text-secondary">{e.direction}</span>}
            {e.lanesAffected && <span className="text-xs text-secondary">Lanes: {e.lanesAffected}</span>}
            {e.updated && (
              <span className="text-xs text-secondary ml-auto">Updated {formatStamp(e.updated)}</span>
            )}
          </div>
          {e.description && <p className="text-sm text-on-surface leading-relaxed mt-2">{e.description}</p>}
          {e.restrictions && <p className="text-sm font-semibold text-amber-700 mt-1">Restriction: {e.restrictions}</p>}
        </article>
      ))}
    </div>
  );
}
