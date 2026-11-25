// Cameras index for the whole site, in the master's layout:
// H1, the speakable live status line, one grid of every camera
// on the corridor in driving order, and the "Which camera
// should I check first?" guidance block. No FAQ block, as on
// the master. Camera stills are state DOT images hot linked
// from the agency feed with credit to VDOT, never rehosted.
// The inventory comes from the 511 Virginia camera registry
// snapshot, refreshed by script from the live registry.

import CameraCard from "@/components/CameraCard";
import JsonLd from "@/components/JsonLd";
import { getCorridor } from "@/lib/feeds";
import { SEGMENTS } from "@/lib/segments";
import { CAMERAS, CAMERA_COUNT } from "@/lib/cameras";
import { corridorStatusSentence } from "@/lib/verdict";
import { webPageSchema, cameraListSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE, siteUrl } from "@/lib/site-config";

export const revalidate = 300;

export const metadata = {
  title: "I-77 Cameras and Webcams Live: Fancy Gap, Virginia | i77pass.com",
  description:
    "Every VDOT camera on Interstate 77 between the North Carolina line and Hillsville in driving order, concentrated on the Fancy Gap climb, from VDOT via 511 Virginia. Each camera has its own page.",
  alternates: { canonical: siteUrl("/cameras") },
  openGraph: { title: "I-77 Cameras and Webcams Live | i77pass.com", description: "VDOT cameras on I-77, North Carolina line to Hillsville, from VDOT via 511 Virginia.", images: ["/og-image.png"] },
};

export default async function CamerasIndexPage() {
  const corridor = await getCorridor();
  const segments = SEGMENTS.map((s) => corridor.segments[s.key]);
  const sentence = corridorStatusSentence(corridor, segments);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
      <JsonLd
        data={[
          webPageSchema({ path: "/cameras", title: metadata.title, description: metadata.description, dateModified: corridor.fetchedAt.toISOString() }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cameras", path: "/cameras" },
          ]),
          ...(CAMERAS.length ? [cameraListSchema(CAMERAS, "I-77 Webcams, North Carolina Line to Hillsville")] : []),
        ]}
      />
      <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface pt-6">
        Fancy Gap Cameras
      </h1>
      <p className="text-body-md text-secondary leading-relaxed mt-3">{sentence}</p>
      <p className="text-body-md text-secondary leading-relaxed mt-2">
        Every live VDOT camera on I-77 over Fancy Gap, in driving order from the North Carolina line: the
        state line cameras first, then the climb, where the coverage is densest because the climb is where
        the fog forms, then the plateau run to Hillsville.{" "}
        {CAMERA_COUNT ? `${CAMERA_COUNT} cameras in all. ` : ""}Tap any camera for its own page, with what
        the view shows and the segment's current status.
      </p>

      {CAMERAS.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {CAMERAS.map((cam) => (
            <CameraCard key={cam.slug} cam={cam} />
          ))}
        </div>
      )}

      <section aria-label="Which camera should I check first?" className="mt-12">
        <h2 className="text-headline-sm text-on-surface mb-3">Which camera should I check first?</h2>
        <div className="space-y-4">
          <p className="text-body-md text-secondary leading-relaxed">
            The summit cameras, near mileposts 7.5 and 8.7. Fancy Gap's hazard is fog, the fog lives at the
            top of the climb, and those two cameras are the ones that show it. If they are white, the
            mountain is in the cloud no matter what the sky looks like at the state line or in Hillsville,
            and the drive decision is made: wait at Exit 1 or Exit 8, or plan around the mountain.
          </p>
          <p className="text-body-md text-secondary leading-relaxed">
            Then read the climb as a sequence. The cameras at mileposts 4.9 to 6.6 show the grade steepening
            and the truck traffic sorting itself out; the state line cameras at mileposts 0.1 to 4.3 show
            what you are leaving; the plateau cameras from milepost 9.7 to 15 show the run into Hillsville.
            A still is enough to judge traffic and, above all, visibility, and each camera page carries its
            segment's live verdict beside the picture, because the verdict comes from the VDOT event feed,
            not from the images.
          </p>
          <p className="text-body-md text-secondary leading-relaxed">
            The stills are VDOT images served live from the agency feed on every view and credited to VDOT.
            This site hot links them and never stores or rehosts camera image files. A camera can lag in bad
            weather, which is itself information: read a stale looking summit camera together with the
            verdict before you climb.
          </p>
        </div>
      </section>

      <p className="text-xs text-secondary mt-10">{SITE.dataCredit}</p>
    </main>
  );
}
