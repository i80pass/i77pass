// Site footer, following the i80pass master's Footer: link
// columns and a copyright line above, and the quiet network list
// at the very bottom. The network list is the standing family
// standard (network wide decision, Nov 15, 2026): TEXT ONLY, plain
// text links under the heading "Our pass network", at the very
// bottom of the footer and nowhere above it, no logos in the
// block, this site excluded from its own list. The list order
// mirrors the newest sister's footer, which starts from i80pass,
// and lists all other network sites including thruwaypass, i40pass, whitepasslive, and rogerspasslive.

import Link from "next/link";
import { SITE, NETWORK_SITES } from "@/lib/site-config";

const linkCls = "text-sm text-slate-600 hover:text-slate-900 transition-colors py-0.5 block";
const headCls = "text-xs font-bold uppercase tracking-widest text-slate-400 mb-4";

const COLUMNS = [
  {
    heading: "Official Links",
    links: [
      { label: "511 Virginia, Virginia Traveler Information", url: "https://511.vdot.virginia.gov/" },
      { label: "VDOT, Virginia Dept. of Transportation", url: "https://www.vdot.virginia.gov/" },
      { label: "National Weather Service, Blacksburg", url: "https://www.weather.gov/rnk/" },
      { label: "Blue Ridge Parkway, National Park Service", url: "https://www.nps.gov/blri/" },
      ],
  },
  {
    heading: "About",
    links: [
      { label: "About Us", url: "/about" },
      { label: "Live Webcams", url: "/live-feed" },
      { label: "All Cameras", url: "/cameras" },
      { label: "Restrictions and Winter Traction", url: "/restrictions" },
      { label: "Shutdown and Closures", url: "/shutdown" },
      { label: "Road Conditions", url: "/i-77" },
      { label: "Mount Airy to Hillsville", url: "/mount-airy-to-hillsville" },
      { label: "Get Storm Alerts", url: "/#storm-alerts" },
      { label: "Status History", url: "/status-history" },
      { label: "Privacy Policy", url: "/privacy" },
      { label: "Sitemap", url: "/site-map" },
      { label: "Send us a Message", url: `mailto:${SITE.contactEmail}` },
    ],
  },
];

function FooterLink({ href, children }) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto");
  if (isExternal) {
    return (
      <a href={href} className={linkCls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={linkCls}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const network = NETWORK_SITES.map((d) => d);
  return (
    <footer className="mt-20 pb-24 md:pb-0" style={{ background: "#eef0f2" }}>
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <p className="font-black text-lg text-slate-800">
              i77<span className="italic text-[#d47336]">pass</span>
              <span className="text-xs font-extrabold align-top ml-0.5">.com</span>
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              Live Interstate 77 conditions, closures, and webcams from the North Carolina line to Hillsville, Virginia, over Fancy Gap, from VDOT via 511 Virginia.
            </p>
            <p className="text-sm text-slate-600 mt-3">
              <a href={`mailto:${SITE.contactEmail}`} className="hover:text-slate-900 transition-colors">{SITE.contactEmail}</a>
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className={headCls}>{col.heading}</p>
              <nav aria-label={col.heading} className="flex flex-col">
                {col.links.map((l) => (
                  <FooterLink key={l.label} href={l.url}>{l.label}</FooterLink>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mt-8">
          {SITE.dataCredit} i77pass.com is an independent traveller information site and is not affiliated with VDOT or 511 Virginia.
        </p>
        <div className="border-t border-slate-300/60 mt-6 pt-5 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} i77pass.com. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Bright Red Design LLC · Nevada Business License NV20260015334
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="border-t border-slate-300/60 pt-5">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-3">Our pass network</p>
          <div className="grid grid-cols-2 gap-x-8 max-w-[318px] mx-auto">
            {network.map((d, i) => (
              <a
                key={d}
                href={`https://${d}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-[13px] leading-5 py-1.5 text-slate-500 hover:text-slate-700 transition-colors border-b border-slate-400/20 ${i >= network.length - (network.length % 2 === 0 ? 2 : 1) ? "border-b-0" : ""}`}
              >
                {d}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
