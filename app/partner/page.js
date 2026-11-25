// Partner page: live previews of every segment widget and the
// copy paste embed snippet for each, so a hotel, a visitor
// centre, a ski shop, or a local news site on the corridor can
// carry live I-77 status with attribution in one paste.

import JsonLd from "@/components/JsonLd";
import { SEGMENTS } from "@/lib/segments";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const metadata = {
  title: "I-77 Status Widgets for Partners | i77pass.com",
  description:
    "Free live I-77 status widgets for corridor businesses and media: one embed per segment, with live previews and copy paste snippets, credited to i77pass.com.",
  alternates: { canonical: siteUrl("/partner") },
  openGraph: { title: "I-77 Status Widgets | i77pass.com", description: "Embed live I-77 segment status on your site, free, with attribution.", images: ["/og-image.png"] },
};

export default function PartnerPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/partner", title: metadata.title, description: metadata.description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Partner Widgets", path: "/partner" },
          ]),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        I-77 Status Widgets
      </h1>
      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-4">
        Put live I-77 conditions on your own site, free: one widget per segment, updated from VDOT via 511 Virginia, with a credit link back to the segment page.
      </p>
      <p className="text-body-md text-secondary leading-relaxed mt-3">
        Built for the corridor&apos;s hotels, lodges, rafting outfitters, visitor centres, and newsrooms. Pick the segment
        your guests or readers drive, copy the snippet, and paste it where it belongs. The widget carries its own
        credit link; that link is the whole price.
      </p>

      <div className="space-y-10 mt-10">
        {SEGMENTS.map((seg) => {
          const src = `${SITE.baseUrl}/widget/${seg.slug}`;
          const snippet = `<iframe src="${src}" title="I-77 ${seg.name} live status, i77pass.com" width="100%" height="190" style="border:0;max-width:560px" loading="lazy"></iframe>`;
          return (
            <section key={seg.key} aria-label={`Widget: ${seg.name}`} className="rounded-2xl border border-outline-variant/40 bg-white p-5">
              <h2 className="text-headline-sm text-on-surface">{seg.name}</h2>
              <p className="text-sm text-secondary mt-1">
                Mileposts {seg.mpTo} to {seg.mpFrom} · {seg.elevToLabel} to {seg.elevFromLabel}
              </p>
              <div className="mt-4 rounded-xl overflow-hidden border border-outline-variant/30">
                <iframe
                  src={`/widget/${seg.slug}`}
                  title={`Live preview: I-77 ${seg.name} status widget`}
                  width="100%"
                  height="190"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
              <label className="block text-xs font-bold uppercase tracking-widest text-secondary mt-4" htmlFor={`snippet-${seg.key}`}>
                Embed snippet
              </label>
              <textarea
                id={`snippet-${seg.key}`}
                readOnly
                rows={3}
                defaultValue={snippet}
                className="w-full mt-1.5 rounded-xl bg-surface-container border border-outline-variant/30 p-3 font-mono text-xs text-on-surface"
              />
            </section>
          );
        })}
      </div>

      <p className="text-body-md text-secondary leading-relaxed mt-10">
        Questions, or a corridor business that wants a hand placing a widget? Write to{" "}
        <a href={`mailto:${SITE.contactEmail}`} className="text-primary font-semibold hover:underline">{SITE.contactEmail}</a>.
      </p>
    </main>
  );
}
