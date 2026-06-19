import type { MetadataRoute } from "next";
import { createAbsoluteUrl, shouldIndexSite } from "@/lib/seo/site-url";

export default function robots(): MetadataRoute.Robots {
  if (!shouldIndexSite()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      },
      sitemap: createAbsoluteUrl("/sitemap.xml")
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/inventory/*/credit-application",
          "/inventory/*/schedule-test-drive"
        ]
      }
    ],
    sitemap: createAbsoluteUrl("/sitemap.xml")
  };
}
