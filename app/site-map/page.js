// Human readable sitemap: every indexable route on the site,
// grouped the way a reader thinks about the corridor.

import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SEGMENTS } from "@/lib/segments";
import { TOWNS } from "@/lib/towns";
import { CAMERAS } from "@/lib/cameras";
import { webPageSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site-config";

export const metadata = {
  title: "Site Map | i77pass.com",
  description: "Every page on i77pass.com: I-77 conditions, Fancy Gap, the three segments, cameras, town weather, restrictions, and the hubs.",
  alternates: { canonical: siteUrl("/site-map") },
};

const GROUPS = [
  {
    heading: "Conditions",
    links: [
      { label: "I-77 Road Conditions, North Carolina Line to Hillsville", href: "/" },
      { label: "I-77 Highway Page", href: "/i-77" },
      { label: "Fancy Gap", href: "/fancy-gap" },
      { label: "Mount Airy to Hillsville Route", href: "/mount-airy-to-hillsville" },
      { label: "Compare the Segments", href: "/compare" },
      { label: "Alerts and Closures", href: "/alerts" },
      { label: "I-77 Shutdown and Closures", href: "/shutdown" },
      { label: "Status History", href: "/status-history" },
      { label: "Live Camera Feed", href: "/live-feed" },
    ],
  },
  {
    heading: "Guides",
    links: [
      { label: "Restrictions and Winter Traction", href: "/restrictions" },
      { label: "Partner Widgets", href: "/partner" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export default function SiteMapPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd data={[webPageSchema({ path: "/site-map", title: metadata.title, description: metadata.description })]} />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">Site Map</h1>

      {GROUPS.map((g) => (
        <section key={g.heading} aria-label={g.heading} className="mt-8">
          <h2 className="text-headline-sm text-on-surface mb-3">{g.heading}</h2>
          <ul className="space-y-1.5">
            {g.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-semibold text-primary hover:underline">{l.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section aria-label="Segments" className="mt-8">
        <h2 className="text-headline-sm text-on-surface mb-3">Segments</h2>
        <ul className="space-y-1.5">
          {SEGMENTS.map((s) => (
            <li key={s.key}>
              <Link href={`/segments/${s.slug}`} className="font-semibold text-primary hover:underline">{s.name}</Link>
              {" · "}
              <Link href={`/segments/${s.slug}/cameras`} className="text-primary hover:underline">cameras</Link>
              {" · "}
              <Link href={`/widget/${s.slug}`} className="text-primary hover:underline">widget</Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Town weather" className="mt-8">
        <h2 className="text-headline-sm text-on-surface mb-3">Town Weather</h2>
        <ul className="space-y-1.5">
          {TOWNS.map((t) => (
            <li key={t.slug}>
              <Link href={`/weather/${t.slug}`} className="font-semibold text-primary hover:underline">{t.name} Weather</Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Cameras" className="mt-8">
        <h2 className="text-headline-sm text-on-surface mb-3">Cameras</h2>
        <p className="text-sm text-secondary mb-3">
          <Link href="/cameras" className="font-semibold text-primary hover:underline">All cameras index</Link>
        </p>
        <ul className="space-y-1.5 columns-1 sm:columns-2">
          {CAMERAS.map((c) => (
            <li key={c.slug}>
              <Link href={`/cameras/${c.slug}`} className="text-primary hover:underline">{c.location} Webcam</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
