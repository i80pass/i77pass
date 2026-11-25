// The master's Road Conditions section, in the slot after the
// status list and before the weather block: a "Check Current
// Highway Conditions" card with the official conditions form
// (511 Virginia, the VDOT equivalent of the master's agency
// checker), the "latest reported as of" line, and the current
// official report as cards under it. The report here is VDOT's
// own published word for this corridor: the events posted on
// Interstate 77 from the same corridor read as the verdict, and
// Carroll County's filed road conditions report when the county
// has one in. Server rendered.

import HighwayCheckForm from "./HighwayCheckForm";
import { SEGMENTS } from "@/lib/segments";

function reportStamp(d) {
  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value || "";
  const day = Number(get("day"));
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${get("weekday")}, ${get("month")} ${day}${suffix}, ${get("year")} at ${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
}

const ADVERSE = /closure|closed|restriction|fog|snow|ice|icy|flood|wind|crash|incident|work zone|construction|delay|advisory/i;

export default function RoadConditionsCheck({ corridor }) {
  const events = corridor?.combined?.events || [];
  const countyLines = corridor?.roadConditions || [];
  const cards = [];

  for (const e of events) {
    const seg = SEGMENTS.find((s) => s.slug === e.segmentSlug);
    cards.push({
      key: `ev-${e.id}`,
      tone: "amber",
      icon: "warning",
      heading: `I-77, ${seg ? seg.name : "Fancy Gap corridor"}`.toUpperCase(),
      text: e.description || e.typeLabel,
    });
  }
  for (const line of countyLines) {
    cards.push({
      key: `cc-${line.slice(0, 40)}`,
      tone: ADVERSE.test(line) ? "amber" : "emerald",
      icon: ADVERSE.test(line) ? "warning" : "check_circle",
      heading: "CARROLL COUNTY, VIRGINIA: VDOT ROAD CONDITIONS REPORT",
      text: line,
    });
  }
  if (!cards.length) {
    if (corridor?.ok) {
      cards.push({
        key: "clear",
        tone: "emerald",
        icon: "check_circle",
        heading: "INTERSTATE 77, NORTH CAROLINA LINE TO HILLSVILLE",
        text: "No traffic restrictions are reported for this area. VDOT posts no closures, restrictions, or events on the corridor right now, and Carroll County has filed no road conditions report.",
      });
    } else {
      cards.push({
        key: "unavailable",
        tone: "amber",
        icon: "warning",
        heading: "INTERSTATE 77, NORTH CAROLINA LINE TO HILLSVILLE",
        text: "The live VDOT feed is not answering, so no current road conditions report can be shown. Check 511 Virginia before you drive.",
      });
    }
  }

  return (
    <section aria-label="Road Conditions" className="mt-10">
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="text-headline-sm text-on-surface">Road Conditions</h2>
        <span className="text-xs text-secondary font-medium">I-77</span>
      </div>
      <div className="glass-card rounded-2xl p-5 aura-shadow mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary text-[20px]">info</span>
          <p className="text-sm font-bold text-on-surface">Check Current Highway Conditions</p>
        </div>
        <HighwayCheckForm />
      </div>
      <p className="text-[11px] text-secondary font-mono uppercase tracking-wide mb-3">
        This highway information is the latest reported as of {reportStamp(corridor?.fetchedAt || new Date())}.
      </p>
      <div className="flex flex-col gap-3">
        {cards.map((c) => (
          <div
            key={c.key}
            className={`glass-card rounded-2xl p-4 aura-shadow border-l-4 ${c.tone === "amber" ? "border-l-amber-400" : "border-l-emerald-400"}`}
          >
            <div className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${c.tone === "amber" ? "text-amber-500" : "text-emerald-500"}`}>
                {c.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-1">{c.heading}</p>
                <p className="text-sm text-on-surface leading-snug">{c.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
