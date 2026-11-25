"use client";

// The master's weather block: a glass card with a town switcher
// (one pill per corridor town), a "Weather at {town}" header, and
// an Hourly toggle that swaps the daily chips for the next
// hours. All forecasts are server fetched from the National
// Weather Service (lib/weather.js getBlockWeather) and passed
// in whole; switching towns or views is local state only, so
// the served HTML carries every town's name, the Hourly button,
// and the first town's daily chips.

import { useState } from "react";

function dayLabel(name) {
  if (!name) return "";
  if (/tonight|night/i.test(name)) return "Night";
  return name.slice(0, 3);
}

function hourLabel(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "numeric", timeZone: "America/New_York" });
}

function Chip({ label, icon, main, sub }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[4.5rem] px-3 py-3 rounded-xl bg-surface-container/60 shrink-0 sm:flex-1 sm:min-w-0">
      <span className="text-[11px] font-bold text-secondary uppercase tracking-wide">{label}</span>
      <span className="material-symbols-outlined text-primary text-[26px]">{icon || "cloud"}</span>
      <span className="text-sm font-bold text-on-surface whitespace-nowrap">{main}</span>
      <span className="text-[11px] text-secondary whitespace-nowrap">{sub || ""}</span>
    </div>
  );
}

export default function WeatherBlock({ towns, initialSlug }) {
  const list = (towns || []).filter(Boolean);
  const start = Math.max(0, list.findIndex((t) => t.slug === initialSlug));
  const [idx, setIdx] = useState(start === -1 ? 0 : start);
  const [mode, setMode] = useState("daily");
  if (!list.length) return null;
  const town = list[Math.min(idx, list.length - 1)];

  return (
    <section aria-label="Weather" className="mt-10">
      <h2 className="text-headline-sm text-on-surface mb-4">Weather</h2>
      <div className="glass-card rounded-2xl aura-shadow overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <h3 className="text-sm font-bold text-on-surface">Weather at {town.name}</h3>
          <button
            type="button"
            onClick={() => setMode(mode === "daily" ? "hourly" : "daily")}
            className="text-sm font-bold text-primary active:opacity-70"
          >
            {mode === "daily" ? "Hourly →" : "Daily →"}
          </button>
        </div>
        <div className="flex gap-1.5 px-5 pt-3 overflow-x-auto hide-scrollbar">
          {list.map((t, i) => (
            <button
              key={t.slug || t.name}
              type="button"
              onClick={() => setIdx(i)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                i === idx ? "bg-primary text-on-primary" : "bg-surface-container text-secondary hover:text-on-surface"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        {town.current || town.days.length || town.hourly.length ? (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-5 py-4">
            {mode === "daily"
              ? town.days.slice(0, 7).map((d, i) => (
                  <Chip
                    key={`d-${i}`}
                    label={dayLabel(d.name)}
                    icon={d.icon}
                    main={`${d.highF != null ? `${Math.round(d.highF)}°` : "n/a"} / ${d.lowF != null ? `${Math.round(d.lowF)}°` : "n/a"}`}
                    sub={d.precipChance != null ? `${d.precipChance}% rain` : d.shortForecast || ""}
                  />
                ))
              : town.hourly.slice(0, 24).map((h, i) => (
                  <Chip
                    key={`h-${i}`}
                    label={hourLabel(h.time)}
                    icon={h.icon}
                    main={h.tempF != null ? `${Math.round(h.tempF)}°` : "n/a"}
                    sub={h.precipChance != null ? `${h.precipChance}% rain` : h.shortForecast || ""}
                  />
                ))}
          </div>
        ) : (
          <p className="px-5 py-4 text-sm text-secondary">
            Conditions unavailable for {town.name} right now. The National Weather Service feed is not answering for this point.
          </p>
        )}
      </div>
      <p className="text-xs text-secondary mt-2">Forecasts and current conditions: National Weather Service.</p>
    </section>
  );
}
