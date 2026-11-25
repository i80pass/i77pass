// JSON-LD builders, following the i80pass master pattern: a WebPage
// graph per page with a SpeakableSpecification on the answer first
// sentence, a RoadCondition block on conditions pages, BreadcrumbList
// everywhere, Place with GeoCoordinates and elevation on pass and
// weather pages, FAQPage wherever FAQs render, and a camera ItemList
// with ImageObject entries on camera surfaces. Canonical URLs come
// from the site config, so nothing here hardcodes a domain.

import { SITE, siteUrl } from "./site-config";

export function webPageSchema({ path, title, description, speakableSelectors = [".answer-first"], dateModified }) {
  const out = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: siteUrl(path),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: speakableSelectors,
    },
    publisher: { "@type": "Organization", name: SITE.parentName },
  };
  if (dateModified) out.dateModified = dateModified;
  return out;
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: siteUrl("/"),
    publisher: {
      "@type": "Organization",
      name: SITE.parentName,
      url: "https://brightreddesign.com",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${SITE.name}.com`,
    url: siteUrl("/"),
    logo: siteUrl(SITE.logoPath),
    parentOrganization: {
      "@type": "Organization",
      name: SITE.parentName,
      url: "https://brightreddesign.com",
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: siteUrl(it.path),
    })),
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faqs || []).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function roadConditionSchema({ path, name, seg, dateModified }) {
  return {
    "@context": "https://schema.org",
    "@type": "RoadCondition",
    name,
    url: siteUrl(path),
    roadName: "Interstate 77",
    status: seg?.ok ? seg.statusWord : "STATUS UNAVAILABLE",
    description: seg?.ok ? seg.statusLine : "Live status is unavailable because the VDOT feed is not answering.",
    provider: {
      "@type": "Organization",
      name: "Virginia Department of Transportation",
      url: "https://511.vdot.virginia.gov",
    },
    ...(dateModified ? { dateModified } : {}),
  };
}

export function placeSchema({ name, lat, lon, elevationFt, description }) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name,
    ...(description ? { description } : {}),
    geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lon, ...(elevationFt ? { elevation: elevationFt } : {}) },
  };
}

export function cameraListSchema(cameras, listName) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: (cameras || []).map((cam, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "ImageObject",
        name: `${cam.location} Webcam, Interstate 77`,
        // A camera whose feed address is currently empty keeps
        // its list entry and page, but no contentUrl is claimed
        // for an image that does not exist right now.
        ...(cam.imageUrl ? { contentUrl: cam.imageUrl } : {}),
        url: siteUrl(`/cameras/${cam.slug}`),
        description: cam.caption,
        geo: { "@type": "GeoCoordinates", latitude: cam.latitude, longitude: cam.longitude },
      },
    })),
  };
}
