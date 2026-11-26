// One page per camera, generated from the bundled camera
// registry snapshot (lib/cameras.json): the live still, its
// segment's live status banner, the camera's real facts (nearest
// milepost marker, coordinates and a map link, nearest town,
// where the registry publishes them), a genuine per camera "What
// this camera shows" section generated from that camera's own
// data, and per camera FAQs, in the master's camera page pattern
// (place name first in the H1, no neighboring cameras section).
// Facts the registry does not publish are not shown and never
// invented. Stills are VDOT images hot linked from the agency
// feed, credited to VDOT.
// dynamicParams is false: an unknown camera id is a real 404.

import Link from "next/link";
import { notFound } from "next/navigation";
import VerdictBar from "@/components/VerdictBar";
import { cameraSrc } from "@/components/CameraCard";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { CAMERAS, getCamera } from "@/lib/cameras";
import { getSegment } from "@/lib/segments";
import { liveStatusSentence } from "@/lib/verdict";
import { webPageSchema, faqSchema, breadcrumbSchema, placeSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return CAMERAS.map((c) => ({ slug: c.slug }));
}

// The camera's place, registry wording minus the route prefix:
// "I-77 at Milepost 0.6, Northbound" becomes "Milepost 0.6,
// Northbound", so the H1 can run place first in the master's
// pattern ("Donner Summit Webcam on I-80").
function cameraPlace(cam) {
  return (cam.location || "").replace(/^I-77 at /, "") || cam.location;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cam = getCamera(slug);
  if (!cam) return {};
  const title = `${cameraPlace(cam)} Webcam on I-77 | i77pass.com`;
  const description = `${cam.location} webcam on Interstate 77${cam.nearestMilepostMarker != null ? ` near milepost marker ${cam.nearestMilepostMarker}` : ""}, ${cam.segmentName} segment. Live VDOT still from 511 Virginia, with the segment's current status.`;
  return {
    title,
    description,
    alternates: { canonical: siteUrl(`/cameras/${cam.slug}`) },
    openGraph: { title, description, images: ["/og-image.png"] },
  };
}

export default async function CameraPage({ params }) {
  const { slug } = await params;
  const cam = getCamera(slug);
  if (!cam) notFound();
  const segMeta = getSegment(cam.segmentSlug);
  const corridor = await getCorridor();
  const seg = corridor.segments[cam.segment];
  const sentence = liveStatusSentence(seg);
  const faqs = (cam.faqs || []).map((f, i) => (i === 0 ? { q: f.q, a: `${sentence} ${f.a}` } : f));
  const mapUrl = `https://www.google.com/maps?q=${cam.latitude},${cam.longitude}`;
  const credit = "VDOT via 511 Virginia";

  const factTiles = [
    ...(cam.nearestMilepostMarker != null ? [{ label: "Nearest milepost marker", value: `MP ${cam.nearestMilepostMarker}` }] : []),
    ...(cam.elevationFt != null ? [{ label: "Road elevation", value: `${cam.elevationFt.toLocaleString("en-US")} ft` }] : []),
    ...(cam.nearestTown ? [{ label: "Nearest town", value: cam.nearestTownMiles != null ? `${cam.nearestTown}, ${cam.nearestTownMiles} mi` : cam.nearestTown }] : []),
    { label: "Segment", value: cam.segmentName },
    { label: "Source", value: credit },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: `/cameras/${cam.slug}`, title: `${cameraPlace(cam)} Webcam on I-77 | i77pass.com`, description: cam.caption, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cameras", path: "/cameras" },
            { name: cam.location, path: `/cameras/${cam.slug}` },
          ]),
          placeSchema({ name: cam.location, lat: cam.latitude, lon: cam.longitude, elevationFt: cam.elevationFt ?? undefined, description: cam.caption }),
          ...(cam.imageUrl
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "ImageObject",
                  name: `${cam.location} Webcam, Interstate 77`,
                  contentUrl: cam.imageUrl,
                  url: siteUrl(`/cameras/${cam.slug}`),
                  description: cam.caption,
                  geo: { "@type": "GeoCoordinates", latitude: cam.latitude, longitude: cam.longitude },
                },
              ]
            : []),
          faqSchema(faqs),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        {cameraPlace(cam)} Webcam on I-77
      </h1>
      <div className="mt-4">
        <VerdictBar seg={seg} fetchedAt={corridor.fetchedAt} label={`${cam.segmentName} current status`} />
      </div>

      <figure className="mt-6 rounded-2xl overflow-hidden border border-outline-variant/40 bg-white shadow-sm">
        {cameraSrc(cam) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={cameraSrc(cam)}
            alt={`${cam.location} webcam on Interstate 77${cam.nearestMilepostMarker != null ? `, near milepost marker ${cam.nearestMilepostMarker}` : ""}`}
            width={1280}
            height={960}
            className="w-full aspect-[4/3] object-cover bg-surface-container"
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-surface-container flex flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="material-symbols-outlined text-[40px] text-secondary">videocam</span>
            <p className="font-semibold text-secondary">Camera image unavailable</p>
            <p className="text-sm text-secondary">The agency feed lists no current still for this camera. The feed restores the image when the camera streams again.</p>
          </div>
        )}
        <figcaption className="px-4 py-3 text-sm text-secondary">{cam.caption}</figcaption>
      </figure>

      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-6">{sentence}</p>

      <section aria-label="Camera facts" className="mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {factTiles.map((f) => (
            <div key={f.label} className="rounded-2xl border border-outline-variant/40 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">{f.label}</p>
              <p className="font-bold text-on-surface mt-1">{f.value}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-secondary mt-3">
          Coordinates {cam.latitude.toFixed(5)}, {cam.longitude.toFixed(5)} ·{" "}
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
            View on a map
          </a>{" "}
          · The still above is a VDOT image served live from the agency feed on every view, credited to {credit}. This site never stores or rehosts camera image files.
        </p>
      </section>

      <section aria-label={`What the ${cam.location} camera shows`} className="mt-10 space-y-4">
        <h2 className="text-headline-sm text-on-surface">What this camera shows</h2>
        {(cam.about || []).map((p, i) => (
          <p key={i} className="text-body-md text-secondary leading-relaxed">{p}</p>
        ))}
        <p className="text-body-md text-secondary leading-relaxed">
          Full conditions for this part of the interstate are on the{" "}
          <Link href={`/segments/${cam.segmentSlug}`} className="text-primary font-semibold hover:underline">
            {cam.segmentName} segment page
          </Link>
          , and every camera on the corridor is listed on the{" "}
          <Link href="/cameras" className="text-primary font-semibold hover:underline">
            cameras index
          </Link>
          .
        </p>
      </section>

      <FaqBlock faqs={faqs} />

      <p className="text-xs text-secondary mt-10">{SITE.dataCredit}</p>
    </main>
  );
}
