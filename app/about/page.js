// About page: what this site is, where its data comes from, and
// what it will not do. Original copy for this corridor.

import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { webPageSchema, breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const revalidate = 60;

export const metadata = {
  title: "About i77pass.com: I-77 Conditions from VDOT | i77pass.com",
  description:
    "i77pass.com is an independent traveller information site for Interstate 77 over Fancy Gap, Virginia, built on VDOT data via 511 Virginia and National Weather Service forecasts, by Bright Red Design.",
  alternates: { canonical: siteUrl("/about") },
  openGraph: { title: "About i77pass.com", description: "What i77pass.com is, where its data comes from, and what it will not do.", images: ["/og-image.png"] },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/about", title: metadata.title, description: metadata.description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          organizationSchema(),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">About i77pass.com</h1>

      <div className="space-y-5 mt-6 text-body-md text-secondary leading-relaxed">
        <p>
          i77pass.com exists for one climb: Interstate 77 from the North Carolina line to Hillsville, Virginia,
          15 miles whose middle is the Fancy Gap ascent of the Blue Ridge, a six mile, four percent grade up the
          escarpment face, fogged in roughly a third of the year. The site splits that drive into three segments
          at the places the drive genuinely changes, and it reads every segment live from the source the state
          itself uses: VDOT, published through 511 Virginia.
        </p>
        <h2 className="text-headline-sm text-on-surface">Where the data comes from</h2>
        <p>
          Road conditions, closures, restrictions, and message signs come from VDOT via the published 511
          Virginia data, the same datasets the state&apos;s own map renders. Cameras are VDOT cameras,
          inventoried from the 511 Virginia camera registry and shown as the agency&apos;s own stills, hot
          linked and credited on every page, never stored or rehosted here. Forecasts come from the National
          Weather Service office in Blacksburg. Elevations are published town and road figures. When the feed
          has nothing to say, the page says that, in words, rather than filling the space with a guess.
        </p>
        <h2 className="text-headline-sm text-on-surface">What this site will not do</h2>
        <p>
          It will not invent a status. It will not post chain control tiers that Virginia does not have, or copy
          a western system onto a road that runs on restrictions, advisories, and variable speed limits instead.
          It will not claim a camera exists where none is registered. And it will not hide its limits behind a
          green light. An honest STATUS UNAVAILABLE is worth more to a driver starting up a fogged grade than a
          confident, wrong OPEN.
        </p>
        <h2 className="text-headline-sm text-on-surface">Who runs it</h2>
        <p>
          i77pass.com is an independent site published by{" "}
          <a href="https://brightreddesign.com" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Bright Red Design</a>,
          and it is part of a family of pass and corridor conditions sites across the United States and Canada,
          listed at the bottom of every page. It is not affiliated with VDOT or 511 Virginia. For road
          emergencies, call 911. For the official word,{" "}
          <a href="https://511.vdot.virginia.gov/" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">511 Virginia</a>{" "}
          is the source this site reads, and it should be yours too when the two ever disagree.
        </p>
        <p>
          Corrections and questions:{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="text-primary font-semibold hover:underline">{SITE.contactEmail}</a>,
          or through the{" "}
          <Link href="/contact" className="text-primary font-semibold hover:underline">contact page</Link>.
        </p>
      </div>
    </main>
  );
}
