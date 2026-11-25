"use client";

// Mobile bottom navigation, the i80pass master's exact component:
// same bar markup, same items, same icon names (home,
// camera_outdoor, notifications, lock), same active treatment.
// The fourth item is the master's "Chain Control" at /chains.
// The /chains page itself carries Virginia's honest position:
// the state runs no chain control program, and the page reports
// the restrictions and advisories VDOT posts instead.

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BottomNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const region = searchParams.get("region") || "I-77";
  const regionParam = `?region=${encodeURIComponent(region)}`;

  const isActive = (path) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe h-20 bg-surface/60 backdrop-blur-xl border-t border-outline-variant/30 rounded-t-xl shadow-[0_-10px_40px_rgba(0,82,136,0.05)]">
      <Link href={`/${regionParam}`} className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-primary font-bold scale-110' : 'text-secondary opacity-70'}`}>
        <span className="material-symbols-outlined" style={isActive('/') ? {fontVariationSettings: "'FILL' 1"} : {}}>home</span>
        <span className="text-label-sm mt-1">Home</span>
      </Link>
      <Link href={`/live-feed${regionParam}`} className={`flex flex-col items-center justify-center ${isActive('/live-feed') ? 'text-primary font-bold scale-110' : 'text-secondary opacity-70'}`}>
        <span className="material-symbols-outlined" style={isActive('/live-feed') ? {fontVariationSettings: "'FILL' 1"} : {}}>camera_outdoor</span>
        <span className="text-label-sm mt-1">Cameras</span>
      </Link>
      <Link href={`/alerts${regionParam}`} className={`flex flex-col items-center justify-center ${isActive('/alerts') ? 'text-primary font-bold scale-110' : 'text-secondary opacity-70'}`}>
        <span className="material-symbols-outlined" style={isActive('/alerts') ? {fontVariationSettings: "'FILL' 1"} : {}}>notifications</span>
        <span className="text-label-sm mt-1">Alerts</span>
      </Link>
      <Link href={`/chains${regionParam}`} className={`flex flex-col items-center justify-center ${isActive('/chains') ? 'text-primary font-bold scale-110' : 'text-secondary opacity-70'}`}>
        <span className="material-symbols-outlined" style={isActive('/chains') ? {fontVariationSettings: "'FILL' 1"} : {}}>lock</span>
        <span className="text-label-sm mt-1">Chain Control</span>
      </Link>
    </nav>
  );
}

export default function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavContent />
    </Suspense>
  );
}
