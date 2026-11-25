// Corridor camera inventory, built from the verified keyless
// VDOT camera registry snapshot (the cams map layer published by
// VDOT's own 511 Virginia platform) by
// scripts/build-cameras.mjs.
//
// SNAPSHOT STATUS (Nov 25, 2026): POPULATED, 22 cameras, all
// VDOT, Interstate 77 mileposts 0.1 to 15.0, from a live query
// against the 511 Virginia camera layer on build day. Every
// camera in the snapshot carries a published still address.
// Camera stills are VDOT images served live from the agency per
// view and hot linked with credit to VDOT, never stored or
// rehosted.
import data from "./cameras.json";

export const CAMERAS = data;
export const CAMERA_COUNT = data.length;

export function camerasForSegment(segmentKey) {
  return data.filter((c) => c.segment === segmentKey);
}

export function getCamera(slug) {
  return data.find((c) => c.slug === slug) || null;
}

// Neighbours in driving order, for detail page prev and next links.
export function cameraNeighbours(slug) {
  const i = data.findIndex((c) => c.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? data[i - 1] : null,
    next: i < data.length - 1 ? data[i + 1] : null,
  };
}
