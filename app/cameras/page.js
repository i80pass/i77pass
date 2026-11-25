// Cameras index for the whole site: the corridor camera set
// grouped by segment in driving order, with the coverage story
// stated up front. Camera stills are state DOT images hot linked
// from the agency feed with credit to VDOT, never rehosted.
// The inventory comes from the 511 Virginia camera registry
// snapshot, refreshed by script from the live registry. FAQs with
// FAQPage schema, as on the master cameras page.

import CameraCard from "@/components/CameraCard";
import FaqBlock from "@/components/FaqBlock";
import JsonLd from "@/components/JsonLd";
import { SEGMENTS } from "@/lib/segments";
import { CAMERAS, camerasForSegment, CAMERA_COUNT } from "@/lib/cameras";
import { webPageSchema, faqSchema, cameraListSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const revalidate = 300;

export const metadata = {
  title: "I-77 Cameras and Webcams Live: Fancy Gap, Virginia | i77pass.com",
  description:
    "Every VDOT camera on Interstate 77 between the North Carolina line and Hillsville in driving order, concentrated on the Fancy Gap climb, from VDOT via 511 Virginia. Each camera has its own page.",
  alternates: { canonical: siteUrl("/cameras") },
  openGraph: { title: "I-77 Cameras and Webcams Live | i77pass.com", description: "VDOT cameras on I-77, North Carolina line to Hillsville, from VDOT via 511 Virginia.", images: ["/og-image.png"] },
};

const FAQS = [
  {
    q: "How many cameras are there on I-77 over Fancy Gap?",
    a: CAMERA_COUNT
      ? `VDOT lists ${CAMERA_COUNT} cameras on this corridor, between mileposts 0.1 and 15. The densest run stands on the climb itself, mileposts 4.3 to 8.7, because the climb is where this road's problems happen: that is where the fog forms.`
      : "The corridor cameras are published by VDOT through 511 Virginia, concentrated on the climb where the fog forms.",
  },
  {
    q: "Are the I-77 cameras live video?",
    a: "This site carries the still images VDOT publishes, refreshed as the agency updates them; most corridor cameras also stream live video on 511 Virginia itself. A still is enough to judge traffic and, above all, fog, and each camera page links to the cameras on either side so you can read the climb as a sequence.",
  },
  {
    q: "Why check the cameras before driving Fancy Gap?",
    a: "Because the climb gives you few second chances. There is no exit between mileposts 1 and 8, and the fog sits at the top while the bottom is clear. The cameras are how you see the actual road before you commit to it: the visibility at mileposts 7.5 and 8.7, the truck queue on the grade, and whether traffic is moving at the summit.",
  },
  {
    q: "Who operates the I-77 cameras?",
    a: "The Virginia Department of Transportation, through 511 Virginia. The stills are agency images served live from the state feed on every view and credited to VDOT. This site hot links them and never stores or rehosts camera image files.",
  },
  {
    q: "What if a camera image looks old?",
    a: "VDOT refreshes its stills on its own schedule, and a camera can lag in bad weather, which is itself information. Read the camera together with the verdict and the events list on the segment page: the verdict comes from the live event feed, not from the pictures.",
  },
];

export default function CamerasIndexPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/cameras", title: metadata.title, description: metadata.description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cameras", path: "/cameras" },
          ]),
          ...(CAMERAS.length ? [cameraListSchema(CAMERAS, "I-77 Webcams, North Carolina Line to Hillsville")] : []),
          faqSchema(FAQS),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        I-77 Cameras: North Carolina Line to Hillsville
      </h1>
      <p className="answer-first text-lg md:text-xl font-semibold leading-snug mt-4">
        {CAMERA_COUNT
          ? `${CAMERA_COUNT} VDOT cameras stand on this corridor, most of them on the Fancy Gap climb.`
          : "The corridor's cameras are published by VDOT through 511 Virginia, concentrated on the Fancy Gap climb."}
      </p>
      <p className="text-body-md text-secondary leading-relaxed mt-3">
        That concentration is the useful thing to know about cameras here. The foot of the climb and the plateau
        are ordinary interstate. The climb is where the road rises 1,400 feet into the cloud base, and it is the
        climb cameras that tell you whether the drive is moving, queued, or fogged in before you commit to it.
      </p>

      {SEGMENTS.map((seg) => {
        const cams = camerasForSegment(seg.key);
        return (
          <section key={seg.key} aria-label={`Cameras, ${seg.name}`} className="mt-10">
            <h2 className="text-headline-sm text-on-surface mb-1">{seg.name}</h2>
            <p className="text-sm text-secondary mb-3">
              {cams.length
                ? `${cams.length} ${cams.length === 1 ? "camera" : "cameras"} on this segment.`
                : `No cameras listed on this segment yet. Conditions are carried by the VDOT event feed.`}
            </p>
            {cams.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cams.map((cam) => (
                  <CameraCard key={cam.slug} cam={cam} />
                ))}
              </div>
            )}
          </section>
        );
      })}

      <FaqBlock faqs={FAQS} />

      <p className="text-xs text-secondary mt-10">{SITE.dataCredit}</p>
    </main>
  );
}
