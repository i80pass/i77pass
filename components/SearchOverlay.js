"use client";

// Search overlay, the i80pass master's component pattern with this
// site's own index: the five segments, the route page, the towns,
// and the main hubs. Every icon name below is in the master's
// subset icon font.

import { useState } from "react";
import Link from "next/link";
import { SEGMENTS } from "@/lib/segments";
import { TOWNS } from "@/lib/towns";

const STATIC_ITEMS = [
  { label: "I-77 Road Conditions", description: "The full North Carolina line to Hillsville corridor", href: "/i-77", icon: "route", type: "Highway" },
  { label: "Fancy Gap", description: "The flagship corridor page: verdict, cameras, fog, restrictions", href: "/fancy-gap", icon: "route", type: "Corridor" },
  { label: "Mount Airy to Hillsville", description: "The full drive, segment by segment", href: "/mount-airy-to-hillsville", icon: "directions_car", type: "Route" },
  { label: "All I-77 Cameras", description: "VDOT cameras in driving order", href: "/cameras", icon: "camera_outdoor", type: "Cameras" },
  { label: "Live Feed", description: "Camera stills across the corridor", href: "/live-feed", icon: "videocam", type: "Cameras" },
  { label: "Alerts and Closures", description: "VDOT alerts, closures, and restrictions", href: "/alerts", icon: "notifications", type: "Hub" },
  { label: "Restrictions and Winter Traction", description: "Posted restrictions on I-77 in Virginia", href: "/restrictions", icon: "lock", type: "Guide" },
  { label: "I-77 Shutdown and Closures", description: "Is I-77 closed today: shutdowns and closures at Fancy Gap", href: "/shutdown", icon: "notifications", type: "Guide" },
  { label: "Compare the Segments", description: "All five segments side by side", href: "/compare", icon: "checklist", type: "Guide" },
];

const ITEMS = [
  ...STATIC_ITEMS,
  ...SEGMENTS.map((s) => ({
    label: s.name,
    description: s.state === "NC" ? `NC mileposts ${s.mpTo} to ${s.mpFrom}, east to west` : `TN mileposts ${s.mpTo} to ${s.mpFrom}, east to west`,
    href: `/segments/${s.slug}`,
    icon: "route",
    type: "Segment",
  })),
  ...TOWNS.map((t) => ({
    label: `${t.name} Weather`,
    description: `National Weather Service forecast for ${t.name}`,
    href: `/weather/${t.slug}`,
    icon: "sunny",
    type: "Weather",
  })),
];

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = q
    ? ITEMS.filter((it) => `${it.label} ${it.description} ${it.type}`.toLowerCase().includes(q))
    : ITEMS;

  return (
    <div className="fixed inset-0 z-[60] bg-surface/95 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-full bg-surface-container border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary text-[20px]">search</span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search segments, towns, cameras"
              className="bg-transparent outline-none text-sm w-full text-on-surface placeholder:text-secondary"
            />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 transition-all"
            aria-label="Close search"
          >
            <span className="material-symbols-outlined text-secondary text-[24px]">close</span>
          </button>
        </div>
        <div className="mt-6 space-y-1">
          {results.map((it) => (
            <Link
              key={it.href + it.label}
              href={it.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-primary text-[22px]">{it.icon}</span>
              <span className="flex-1">
                <span className="block font-bold text-sm text-on-surface">{it.label}</span>
                <span className="block text-xs text-secondary">{it.description}</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wide text-secondary">{it.type}</span>
            </Link>
          ))}
          {results.length === 0 && (
            <p className="text-sm text-secondary px-3 py-6">Nothing on I-77 matches that search yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
