// Weather strip for a set of corridor points, from the National
// Weather Service via lib/weather.js. Temperatures are Fahrenheit.
// Each point renders its current temperature, condition, and the
// day's high and low when the feed answered, or an honest
// unavailable line when it did not. Server rendered.

import Link from "next/link";

export default function WeatherStrip({ points, heading = "Corridor weather right now" }) {
  if (!points?.length) return null;
  return (
    <section aria-label={heading} className="mt-10">
      <h2 className="text-headline-sm text-on-surface mb-3">{heading}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {points.map((p) => {
          const card = (
            <>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">{p.icon || "cloud"}</span>
                <span className="font-bold text-sm text-on-surface">{p.name}</span>
              </span>
              {p.tempF != null ? (
                <>
                  <span className="block text-3xl font-black text-on-surface mt-2">{Math.round(p.tempF)}°F</span>
                  <span className="block text-xs text-secondary mt-0.5">{p.label}</span>
                  {(p.highF != null || p.lowF != null) && (
                    <span className="block text-xs text-secondary mt-1">
                      High {p.highF != null ? `${Math.round(p.highF)}°` : "n/a"} · Low {p.lowF != null ? `${Math.round(p.lowF)}°` : "n/a"}
                    </span>
                  )}
                </>
              ) : (
                <span className="block text-sm text-secondary mt-2">Conditions unavailable</span>
              )}
            </>
          );
          const cls = "block rounded-2xl border border-outline-variant/40 bg-white p-4";
          return p.slug ? (
            <Link key={p.name} href={`/weather/${p.slug}`} className={`${cls} hover:shadow-md transition-shadow`}>
              {card}
            </Link>
          ) : (
            <div key={p.name} className={cls}>{card}</div>
          );
        })}
      </div>
      <p className="text-xs text-secondary mt-2">Forecasts and current conditions: National Weather Service.</p>
    </section>
  );
}
