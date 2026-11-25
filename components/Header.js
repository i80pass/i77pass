"use client";

// Fixed brand header, the i80pass master's Header component: same
// markup, same logo placement (next/image, /i77pass-logo.png from
// the approved vault logo, width 676, height 369, the master's img
// classes), same search pill and desktop nav pattern. The nav
// labels are this site's sections.

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchOverlay from "@/components/SearchOverlay";

function HeaderContent() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-28 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm">
        <Link href="/" className="flex items-center shrink-0" aria-label="i77pass.com home">
          <Image
            src="/i77pass-logo.png"
            alt="i77pass.com"
            width={676}
            height={369}
            priority
            sizes="(min-width: 768px) 198px, 176px"
            className="h-24 w-auto md:h-[6.75rem] object-contain"
          />
        </Link>

        {/* Mobile search icon */}
        <button
          onClick={() => setSearchOpen(true)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 transition-all"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-secondary text-[24px]">search</span>
        </button>

        {/* Desktop: search bar + nav */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 w-36 xl:w-56 px-3 xl:px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-left transition-colors shrink-0"
            aria-label="Search highways, routes, cameras"
          >
            <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">search</span>
            <span className="text-sm text-secondary truncate">Search…</span>
          </button>

          <nav className="flex gap-4 xl:gap-8 items-center text-label-md text-secondary">
            <Link href="/" className={`${isActive('/') ? 'text-primary font-bold' : 'hover:opacity-80 transition-opacity'}`}>Home</Link>
            <Link href="/live-feed" className={`${isActive('/live-feed') ? 'text-primary font-bold' : 'hover:opacity-80 transition-opacity'}`}>Cameras</Link>
            <Link href="/mount-airy-to-hillsville" className={`${isActive('/mount-airy-to-hillsville') ? 'text-primary font-bold' : 'hover:opacity-80 transition-opacity'}`}>Routes</Link>
            <Link href="/alerts" className={`${isActive('/alerts') ? 'text-primary font-bold' : 'hover:opacity-80 transition-opacity'}`}>Alerts</Link>
            <Link href="/restrictions" className={`${isActive('/restrictions') ? 'text-primary font-bold' : 'hover:opacity-80 transition-opacity'}`}>Restrictions</Link>
            <Link href="/shutdown" className={`${isActive('/shutdown') ? 'text-primary font-bold' : 'hover:opacity-80 transition-opacity'}`}>Shutdown</Link>
            <Link href="/about" className={`${isActive('/about') ? 'text-primary font-bold' : 'hover:opacity-80 transition-opacity'}`}>About Us</Link>
          </nav>
        </div>
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="fixed top-0 w-full z-50 h-28 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30" />}>
      <HeaderContent />
    </Suspense>
  );
}
