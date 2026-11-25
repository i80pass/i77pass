// One state DOT camera still, linked to its camera page. Camera
// grid treatment follows the Gold Standard camera rule and the
// i80pass master: one column on phones, two on small tablets,
// three on desktop (the grid lives in CameraStrip), each image in
// a 4:3 frame with object-cover, never stretched wider than the
// grid column. Stills are agency images served live from the
// VDOT feed per view and hot linked, never stored or
// rehosted by this site (AMBER camera terms: hot link and credit);
// the src carries a 10 minute cache bucket so returning visitors
// see a current frame. The expand control is a real link to the
// camera page, never a decorative icon. The first card of the
// hero strip passes `priority`, which loads its still eager with a
// high fetch priority, the i80pass master's LCP treatment for the
// camera that paints largest above the fold. Facts the registry does
// not publish for this corridor (elevation, exact milepost) are
// printed only when the snapshot carries them, never guessed.

import Link from "next/link";

export function cameraSrc(cam) {
  if (!cam.imageUrl) return null;
  const bucket = Math.floor(Date.now() / 600_000);
  return `${cam.imageUrl}?v=${bucket}`;
}

export default function CameraCard({ cam, priority = false }) {
  const facts = [];
  if (cam.nearestMilepostMarker != null) facts.push(`Near milepost ${cam.nearestMilepostMarker}`);
  if (cam.elevationFt != null) facts.push(`${cam.elevationFt.toLocaleString("en-US")} ft`);
  facts.push("VDOT via 511 Virginia");
  const src = cameraSrc(cam);
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/cameras/${cam.slug}`} className="block">
        {src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={`${cam.location} webcam on Interstate 40${cam.nearestMilepostMarker != null ? `, near milepost marker ${cam.nearestMilepostMarker}` : ""}`}
            width={640}
            height={480}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="w-full aspect-[4/3] object-cover bg-surface-container"
          />
        ) : (
          <span className="w-full aspect-[4/3] bg-surface-container flex flex-col items-center justify-center gap-1.5 px-4 text-center">
            <span className="material-symbols-outlined text-[28px] text-secondary">videocam</span>
            <span className="text-sm font-semibold text-secondary">Camera image unavailable</span>
            <span className="text-xs text-secondary">The agency feed lists no current still for this camera.</span>
          </span>
        )}
        <span className="block px-3.5 py-2.5">
          <span className="block font-bold text-sm text-on-surface leading-tight">{cam.location}</span>
          <span className="block text-xs text-secondary mt-0.5">
            {facts.join(" · ")}
          </span>
        </span>
      </Link>
      <Link
        href={`/cameras/${cam.slug}`}
        aria-label={`Open the ${cam.location} camera page`}
        className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-black/45 text-white opacity-90 hover:bg-black/65 transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">open_in_full</span>
      </Link>
    </div>
  );
}
