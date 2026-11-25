// Contact route: the studio mailbox address, what to write about,
// and the response pattern. Email is the contact path, as it is
// across the network.

import JsonLd from "@/components/JsonLd";
import StormAlerts from "@/components/StormAlerts";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const metadata = {
  title: "Contact i77pass.com | i77pass.com",
  description:
    "Contact i77pass.com by email: corrections to I-77 conditions coverage, camera notes, widget partnerships, and advertising questions.",
  alternates: { canonical: siteUrl("/contact") },
  robots: { index: true },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/contact", title: metadata.title, description: metadata.description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">Contact Us</h1>
      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-4">
        Write to{" "}
        <a href={`mailto:${SITE.contactEmail}`} className="text-primary hover:underline">{SITE.contactEmail}</a>.
        A person reads every message.
      </p>
      <div className="space-y-5 mt-6 text-body-md text-secondary leading-relaxed">
        <p>
          The mailbox is the contact path for everything on this site: a correction to a segment page, a camera
          that has moved or retired, a corridor business that wants a status widget, or a question about how a
          status was read. If you are reporting a road emergency or a dangerous condition, do not email anyone:
          call 911, and report road conditions to VDOT through 511 Virginia or the VDOT Customer Service Center at 800-FOR-ROAD, which are staffed for exactly that.
        </p>
        <p>
          For storm alerts by email instead of a conversation, the signup below is the whole process. i77pass.com
          is published by Bright Red Design.
        </p>
      </div>
      <div className="mt-8">
        <StormAlerts />
      </div>
    </main>
  );
}
