import { SITE } from "@/lib/site-config";
import { CAMERAS } from "@/lib/cameras";
import { SEGMENTS } from "@/lib/segments";
import { TOWNS } from "@/lib/towns";

export const revalidate = 3600;

// Every indexable URL on the site. Widget embed routes are
// noindex and are deliberately absent. Conditions pages carry an
// accurate lastModified from build time; Next revalidates this
// route hourly, as the master does.
const STATIC_PATHS = [
  "/",
  "/i-77",
  "/fancy-gap",
  "/mount-airy-to-hillsville",
  "/compare",
  "/restrictions",
  "/shutdown",
  "/cameras",
  "/live-feed",
  "/alerts",
  "/status-history",
  "/partner",
  "/about",
  "/privacy",
  "/contact",
  "/site-map",
];

export default function sitemap() {
  const now = new Date();
  const entries = STATIC_PATHS.map((path) => ({
    url: `${SITE.baseUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/i-77" ? "hourly" : "daily",
    priority: path === "/" ? 1 : 0.8,
  }));
  for (const seg of SEGMENTS) {
    entries.push({
      url: `${SITE.baseUrl}/segments/${seg.slug}`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    });
    entries.push({
      url: `${SITE.baseUrl}/segments/${seg.slug}/cameras`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    });
  }
  for (const town of TOWNS) {
    entries.push({
      url: `${SITE.baseUrl}/weather/${town.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.6,
    });
  }
  for (const cam of CAMERAS) {
    entries.push({
      url: `${SITE.baseUrl}/cameras/${cam.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.5,
    });
  }
  return entries;
}
