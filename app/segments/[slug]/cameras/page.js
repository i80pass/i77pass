// Camera strip page for one segment: the segment's whole camera
// set in driving order, each card linking to its camera page.
// This is the full list page the camera count rule points to, so
// every camera shows here regardless of count. A segment with no
// cameras in the snapshot renders the honest empty state.
// dynamicParams is false.

import Link from "next/link";
import { notFound } from "next/navigation";
import CameraCard from "@/components/CameraCard";
import VerdictBar from "@/components/VerdictBar";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { SEGMENTS, getSegment } from "@/lib/segments";
import { camerasForSegment } from "@/lib/cameras";
import { liveStatusSentence } from "@/lib/verdict";
import { webPageSchema, cameraListSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return SEGMENTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const seg = getSegment(slug);
  if (!seg) return {};
  const cameras = camerasForSegment(seg.key);
  const title = `I-77 Webcams: ${seg.name} | i77pass.com`;
  const description = cameras.length
    ? `${cameras.length} live VDOT webcam ${cameras.length === 1 ? "still" : "stills"} on Interstate 77, ${seg.name}, Virginia mileposts ${seg.mpFrom} to ${seg.mpTo}, from VDOT via 511 Virginia.`
    : `No webcams are listed yet on Interstate 77, ${seg.name}. Read this segment's live status from the VDOT event feed, and see the corridor camera picture on the cameras index.`;
  return {
    title,
    description,
    alternates: { canonical: siteUrl(`/segments/${seg.slug}/cameras`) },
    openGraph: { title, description, images: ["/og-image.png"] },
  };
}

export default async function SegmentCamerasPage({ params }) {
  const { slug } = await params;
  const meta = getSegment(slug);
  if (!meta) notFound();
  const corridor = await getCorridor();
  const seg = corridor.segments[meta.key];
  const cameras = camerasForSegment(meta.key);
  const sentence = liveStatusSentence(seg);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: `/segments/${meta.slug}/cameras`, title: `I-77 Webcams: ${meta.name} | i77pass.com`, description: meta.intro, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: meta.name, path: `/segments/${meta.slug}` },
            { name: "Cameras", path: `/segments/${meta.slug}/cameras` },
          ]),
          ...(cameras.length ? [cameraListSchema(cameras, `I-77 Webcams, ${meta.name}`)] : []),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        I-77 Webcams: {meta.name}
      </h1>
      <div className="mt-4">
        <VerdictBar seg={seg} fetchedAt={corridor.fetchedAt} />
      </div>
      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-5">{sentence}</p>

      {cameras.length ? (
        <>
          <p className="text-body-md text-secondary leading-relaxed mt-4">
            {cameras.length} VDOT {cameras.length === 1 ? "camera" : "cameras"} on this segment, in driving order.
            Each card links to the camera&apos;s own page, with its nearest town and the cameras on either side of it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {cameras.map((cam) => (
              <CameraCard key={cam.slug} cam={cam} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-outline-variant/40 bg-white p-5 mt-6">
          <h2 className="font-bold text-on-surface">No cameras listed on this segment yet</h2>
          <p className="text-body-md text-secondary leading-relaxed mt-2">
            The camera inventory for this corridor is pulled from the 511 Virginia registry.
            This segment&apos;s conditions come from the VDOT event feed on its{" "}
            <Link href={`/segments/${meta.slug}`} className="text-primary font-semibold hover:underline">segment page</Link>,
            and the full camera picture is on the{" "}
            <Link href="/cameras" className="text-primary font-semibold hover:underline">cameras index</Link>.
          </p>
        </div>
      )}

      <p className="text-xs text-secondary mt-10">{SITE.dataCredit}</p>
    </main>
  );
}
