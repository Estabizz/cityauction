import type { NextConfig } from "next";
import { CITY_PAGES } from "./src/content/cities";
import { cityPath } from "./src/content/cities/states";

const nextConfig: NextConfig = {
  // City pages moved from /<city> to /locations/<state>/<city>; keep the old
  // addresses (already shared and indexed) working with permanent redirects.
  redirects() {
    return CITY_PAGES.map((page) => ({
      source: `/${page.slug}`,
      destination: cityPath(page),
      permanent: true,
    }));
  },
  experimental: {
    // Hostinger's build server reports 64 CPUs but caps threads per account, so
    // the default (CPUs - 1 = 63 workers) crashes with "can't spawn worker thread".
    cpus: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
