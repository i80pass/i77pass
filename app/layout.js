import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import Header from "@/components/Header";
import CorridorNav from "@/components/CorridorNav";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

// SUBSETTED icon font carried over from the i80pass master (about
// 17 KB of glyphs). Do NOT replace it with the full Material
// Symbols file (about 4 MB); it alone wrecks mobile LCP. Every
// icon name used anywhere on this site must be a ligature this
// subset carries (verified against the font's GSUB table at build
// time, see BUILD-LOG.md), or the icon renders as raw words, which
// is a launch blocker on this network.
const materialSymbols = localFont({
  src: "./fonts/material-symbols-outlined.woff2",
  variable: "--font-material-symbols",
  weight: "100 700",
  display: "block",
  preload: true,
});

export function generateMetadata() {
  const title = "i77pass.com | Live I-77 Travel Conditions, Fancy Gap and Hillsville";
  const description =
    "Live Interstate 77 road conditions, fog status, closures, restrictions, and webcams from the North Carolina line to Hillsville, Virginia, over Fancy Gap, from VDOT via 511 Virginia.";
  return {
    title,
    description,
    metadataBase: new URL(SITE.baseUrl),
    alternates: { canonical: SITE.baseUrl },
    icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
    openGraph: { title, description, siteName: SITE.name, type: "website", images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  // GA4: the tag renders only when this site's own measurement ID
  // is set through NEXT_PUBLIC_GA_ID, the master pattern for the
  // GA loader gate.
  const gaId = SITE.gaId;
  // AdSense: the loader renders only when the publisher ID is set
  // at build time, the same conditional pattern as GA above. Unset
  // means no script tag at all. The ad units live in
  // components/AdSlot.js under the same gate.
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || null;
  return (
    <html lang="en" className={`${inter.variable} ${materialSymbols.variable}`}>
      <body className="bg-surface text-on-surface antialiased overflow-x-hidden">
        {/* Warm the connection to the VDOT stills host: the hero
            camera image is the page's largest paint, and it comes
            from this origin on every conditions page. React hoists
            the preconnect into the document head. */}
        <link rel="preconnect" href="https://snapshot.vdotcameras.com" />
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
            <Script id="ga-init" strategy="lazyOnload">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}
        {adsenseId && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Header />
          <CorridorNav />
          {/* Top padding matches the master: the fixed h-28 header
              plus the fixed navy corridor bar under it. Nothing sits
              between the corridor bar and the verdict bar on any
              page; page content starts with the H1 and the verdict. */}
          <div className="pt-40 md:pt-44 flex-1">{children}</div>
          <Footer />
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
