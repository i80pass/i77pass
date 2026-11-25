"use client";

// The corridor bar, copied from the i80pass master's HighwayNav:
// its own component, a navy strip fixed under the header holding
// ONLY corridor pages, every pill with a working active state, the
// lit pill white on navy. The homepage lights the full corridor
// pill (the I-77 page, whose content the homepage carries);
// segment pages light their own pill; the Fancy Gap page
// lights the Fancy Gap pill; pages that belong to no single segment
// light none.

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SEGMENTS } from "@/lib/segments";

const CORRIDORS = [
  { slug: "i-77", label: "I-77", href: "/" },
  { slug: "fancy-gap", label: "Fancy Gap", href: "/fancy-gap" },
  ...SEGMENTS.map((s) => ({ slug: s.slug, label: s.shortName, href: `/segments/${s.slug}` })),
];

function activeFor(pathname) {
  if (pathname === "/" || pathname === "/i-77") return "i-77";
  if (pathname === "/fancy-gap") return "fancy-gap";
  for (const s of SEGMENTS) {
    if (pathname === `/segments/${s.slug}` || pathname === `/segments/${s.slug}/cameras`) return s.slug;
  }
  if (pathname === "/mount-airy-to-hillsville") return "i-77";
  return null;
}

function CorridorNavContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingSlug, setPendingSlug] = useState(null);

  useEffect(() => { setPendingSlug(null); }, [pathname]);

  const activeSlug = activeFor(pathname);

  function handleClick(e, href, slug) {
    if (slug === activeSlug) return;
    e.preventDefault();
    setPendingSlug(slug);
    router.push(href);
  }

  return (
    <nav
      className="fixed top-28 left-0 w-full z-40 bg-[#0f172a] border-b border-white/10"
      aria-label="Corridors"
    >
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar px-container-padding-mobile md:px-container-padding-desktop py-2">
        {CORRIDORS.map((c) => {
          const active = pendingSlug ? pendingSlug === c.slug : activeSlug === c.slug;
          return (
            <a
              key={c.slug}
              href={c.href}
              aria-current={active ? "page" : undefined}
              onClick={(e) => handleClick(e, c.href, c.slug)}
              className={`px-3.5 py-1.5 rounded-full text-label-md font-bold whitespace-nowrap shrink-0 transition-all
                ${active
                  ? "bg-white text-[#0f172a] shadow-sm"
                  : "text-white/70 border border-white/30 hover:border-white/60 hover:text-white"}`}
            >
              {c.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export default function CorridorNav() {
  return (
    <Suspense fallback={<div className="fixed top-28 w-full z-40 h-[44px] bg-[#0f172a] border-b border-white/10" />}>
      <CorridorNavContent />
    </Suspense>
  );
}
