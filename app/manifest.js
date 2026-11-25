import { SITE } from "@/lib/site-config";

export default function manifest() {
  return {
    name: "i77pass: I-77 Road Conditions, Fancy Gap, Virginia",
    short_name: SITE.name,
    description: SITE.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fb",
    theme_color: "#005288",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
