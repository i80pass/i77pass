// One page per I-77 segment, each its own mini site in the
// master's corridor page pattern, in the master's block order:
// H1, the verdict box, then the segment's cameras directly
// under the verdict with nothing between them (the master's
// hard rule), then the answer first status sentence and intro,
// the corridor status list with this segment's events folded
// into it, the Road Conditions checker, the weather block,
// storm alerts, original editorial sections, checkpoints and
// junctions, and FAQs with FAQPage schema. dynamicParams is
// false: an unknown segment slug is a real 404.

import Link from "next/link";
import { notFound } from "next/navigation";
import VerdictBar from "@/components/VerdictBar";
import SegmentRow from "@/components/SegmentRow";
import EventsList from "@/components/EventsList";
import CameraStrip from "@/components/CameraStrip";
import RoadConditionsCheck from "@/components/RoadConditionsCheck";
import WeatherBlock from "@/components/WeatherBlock";
import FaqBlock from "@/components/FaqBlock";
import StormAlerts from "@/components/StormAlerts";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { getBlockWeather } from "@/lib/weather";
import { SEGMENTS, getSegment } from "@/lib/segments";
import { camerasForSegment } from "@/lib/cameras";
import { liveStatusSentence } from "@/lib/verdict";
import { webPageSchema, faqSchema, roadConditionSchema, cameraListSchema, breadcrumbSchema, placeSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return SEGMENTS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const seg = getSegment(slug);
  if (!seg) return {};
  const title = `I-77 ${seg.name} Road Conditions Today | i77pass.com`;
  const description = `Is I-77 open between ${seg.name}? Live conditions, closures, restrictions, and webcams for Interstate 77, Virginia mileposts ${seg.mpFrom} to ${seg.mpTo}, from VDOT via 511 Virginia.`;
  return {
    title,
    description,
    alternates: { canonical: siteUrl(`/segments/${seg.slug}`) },
    openGraph: { title, description, images: ["/og-image.png"] },
  };
}

const MIDPOINTS = {
  1: [36.59, -80.74],
  2: [36.65, -80.72],
  3: [36.72, -80.75],
};

// The corridor weather points for the master weather block, with
// the segment's own town preselected in the switcher.
const WEATHER_POINTS = [
  { name: "Mount Airy", slug: "mount-airy", lat: 36.4995, lon: -80.6073 },
  { name: "Cana", slug: "cana", lat: 36.5833, lon: -80.6681 },
  { name: "Fancy Gap", slug: "fancy-gap", lat: 36.6681, lon: -80.7017 },
  { name: "Hillsville", slug: "hillsville", lat: 36.7622, lon: -80.7345 },
];
const SEGMENT_TOWN = { 1: "cana", 2: "fancy-gap", 3: "hillsville" };

export default async function SegmentPage({ params }) {
  const { slug } = await params;
  const meta = getSegment(slug);
  if (!meta) notFound();

  const corridor = await getCorridor();
  const seg = corridor.segments[meta.key];
  const sentence = liveStatusSentence(seg);
  const cameras = camerasForSegment(meta.key);
  const weather = await getBlockWeather(WEATHER_POINTS);
  const stations = corridor.stations.filter((s) => s.segmentKey === meta.key);
  const allSegments = SEGMENTS.map((s) => corridor.segments[s.key]);
  const faqs = meta.faqs.map((f, i) =>
    i === 0 ? { q: f.q, a: `${sentence} ${f.a}` } : f
  );
  const [midLat, midLon] = MIDPOINTS[meta.key] || [35.85, -83.0];

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: `/segments/${meta.slug}`, title: `I-77 ${meta.name} Road Conditions Today | i77pass.com`, description: meta.intro, dateModified: corridor.fetchedAt.toISOString() }),
          roadConditionSchema({ path: `/segments/${meta.slug}`, name: `Interstate 77 Road Conditions, ${meta.name}`, seg, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "I-77", path: "/i-77" },
            { name: meta.name, path: `/segments/${meta.slug}` },
          ]),
          placeSchema({ name: `Interstate 77, ${meta.name}`, lat: midLat, lon: midLon, elevationFt: meta.elevToFt, description: meta.intro }),
          faqSchema(faqs),
          ...(cameras.length ? [cameraListSchema(cameras, `I-77 Webcams, ${meta.name}`)] : []),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        I-77 Road Conditions: {meta.name}
      </h1>
      <div className="mt-4">
        <VerdictBar seg={seg} fetchedAt={corridor.fetchedAt} />
      </div>
      <CameraStrip
        cameras={cameras}
        heading={`I-77 webcams, ${meta.name}`}
        sub={
          cameras.length
            ? `${cameras.length} VDOT ${cameras.length === 1 ? "camera" : "cameras"} on this segment, in driving order. Still images from 511 Virginia.`
            : undefined
        }
        seeAllHref="/cameras"
        emptyText="No cameras are listed on this segment yet. The camera inventory for this corridor is pulled from the 511 Virginia registry. This page will never dress up another segment's camera as one of its own."
      />

      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-10">{sentence}</p>
      <p className="text-body-md text-secondary leading-relaxed mt-3">{meta.intro}</p>

      <AdSlot slot="belowCameras" />

      <section aria-label="Segment status" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">I-77 segment by segment</h2>
        <div className="space-y-3">
          {allSegments.map((s) => (
            <SegmentRow key={s.key} seg={s} />
          ))}
        </div>
        <div className="mt-4">
          <EventsList
            events={seg.events}
            emptyText={
              seg.ok
                ? `VDOT posts no events on the ${meta.name} segment right now.`
                : "No VDOT events can be shown right now, because the live feed for this segment is not answering. Nothing is posted here in the meantime."
            }
          />
        </div>
        <p className="text-sm text-secondary mt-3">
          Driving the whole route? See the{" "}
          <Link href="/mount-airy-to-hillsville" className="text-primary font-semibold hover:underline">Mount Airy to Hillsville route page</Link>.
        </p>
      </section>

      <RoadConditionsCheck corridor={corridor} />

      {stations.length > 0 && (
        <section aria-label="Road weather stations" className="mt-10">
          <h2 className="text-headline-sm text-on-surface mb-3">Road weather on this segment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stations.map((s) => (
              <div key={s.id} className="rounded-2xl border border-outline-variant/40 bg-white p-4">
                <p className="font-bold text-on-surface">{s.name}</p>
                <p className="text-sm text-secondary mt-1">
                  {s.airTempF != null ? `Air ${s.airTempF}°F` : "Air temperature not reported"}
                  {s.surfaceTempF != null ? ` · Road surface ${s.surfaceTempF}°F` : ""}
                  {s.windMph != null ? ` · Wind ${s.windMph} mph` : ""}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-secondary mt-2">Road weather stations: VDOT via 511 Virginia. Temperatures are Fahrenheit, as the platform reports them.</p>
        </section>
      )}

      <WeatherBlock towns={weather} initialSlug={SEGMENT_TOWN[meta.key]} />

      <div className="mt-10">
        <StormAlerts />
      </div>

      <section aria-label="About this segment" className="mt-10 space-y-6">
        {meta.sections.map((s) => (
          <div key={s.h}>
            <h2 className="text-headline-sm text-on-surface mb-2">{s.h}</h2>
            <p className="text-body-md text-secondary leading-relaxed">{s.body}</p>
          </div>
        ))}
      </section>

      <section aria-label="Checkpoints and junctions" className="mt-10">
        <h2 className="text-headline-sm text-on-surface mb-3">Checkpoints and junctions</h2>
        <div className="space-y-3">
          {meta.junctions.map((j) => (
            <div key={j.label} className="rounded-2xl border border-outline-variant/40 bg-white p-4 flex gap-4">
              <span className="shrink-0 px-2.5 py-1 h-fit rounded-full bg-primary text-white text-xs font-black">MP {j.mp}</span>
              <span>
                <span className="block font-bold text-on-surface">{j.label}</span>
                <span className="block text-sm text-secondary mt-0.5">{j.note}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <FaqBlock faqs={faqs} />

      <AdSlot slot="lowerPage" />

      <p className="text-xs text-secondary mt-10">{SITE.dataCredit}</p>
    </main>
  );
}
