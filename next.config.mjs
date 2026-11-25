import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  images: {
    minimumCacheTTL: 2678400, // 31 days, as on the master
    remotePatterns: [
      // State DOT camera stills are rendered with plain img tags
      // (they are agency images served per view, hot linked with
      // credit, never rehosted); the patterns are declared so any
      // next/image use of a still is lawful here. The DriveNC
      // camera view hosts are confirmed from the keyed registry
      // payload when the snapshot is built; drivenc.gov and
      // ncdot.gov patterns cover the agency's own hosts meanwhile.
      { protocol: "https", hostname: "www.drivenc.gov" },
      { protocol: "https", hostname: "drivenc.gov" },
      { protocol: "https", hostname: "**.ncdot.gov" },
    ],
  },
};

export default nextConfig;
