/** @type {import('next').NextConfig} */

/**
 * Vehicle photo hosts allowed through Next.js image optimization.
 *
 * AutoManager serves DeskManager/WebManager vehicle photos from
 * *.automanager.com. If the live feed ever serves photos from another
 * host, add it via NEXT_PUBLIC_INVENTORY_IMAGE_HOSTS (comma-separated
 * hostnames) in Vercel instead of editing code. Unknown hosts degrade
 * gracefully: components fall back to unoptimized rendering rather
 * than crashing (see lib/images/photo-optimization.ts).
 */
const extraImageHosts = (process.env.NEXT_PUBLIC_INVENTORY_IMAGE_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.automanager.com" },
      ...extraImageHosts.map((hostname) => ({ protocol: "https", hostname }))
    ]
  },

  async redirects() {
    return [
      /**
       * Old WebManager inventory route.
       * Preserve old bookmarks, Google results, customer texts, and inventory nav links.
       */
      {
        source: "/view-inventory",
        destination: "/inventory",
        permanent: true,
      },
      {
        source: "/view-inventory/:path*",
        destination: "/inventory",
        permanent: true,
      },

      /**
       * Old WebManager dealer-info routes.
       */
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/location-and-directions",
        destination: "/location",
        permanent: true,
      },
      {
        source: "/sales-department",
        destination: "/contact",
        permanent: true,
      },

      /**
       * No dedicated /about page exists in the current app.
       * Send old /about-us traffic to the homepage for launch.
       * Later, create /about and change this destination to /about.
       */
      {
        source: "/about-us",
        destination: "/",
        permanent: true,
      },

      /**
       * Old WebManager vehicle detail URLs.
       *
       * Permanent (308) on purpose: the old vehicle pages have no
       * one-to-one equivalents (those vehicles are gone), and temporary
       * redirects tell Google to keep the stale URLs indexed. A permanent
       * redirect consolidates their remaining equity into /inventory and
       * lets Google drop them. If a slug-mapping compatibility route is
       * ever built, point these at it then.
       */
      {
        source: "/vehicle-details",
        destination: "/inventory",
        permanent: true,
      },
      {
        source: "/vehicle-details/:path*",
        destination: "/inventory",
        permanent: true,
      },

      /**
       * Old sitemap-style route.
       */
      {
        source: "/site-map",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
