/** @type {import('next').NextConfig} */
const nextConfig = {
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
       * This is temporary because it is not a true one-to-one vehicle migration.
       * Better after launch: build a compatibility route that maps old vehicles to new /inventory/[slug] pages.
       */
      {
        source: "/vehicle-details",
        destination: "/inventory",
        permanent: false,
      },
      {
        source: "/vehicle-details/:path*",
        destination: "/inventory",
        permanent: false,
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