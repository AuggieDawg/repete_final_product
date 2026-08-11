import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getInventorySnapshot } from "@/lib/inventory/get-inventory";
import { createAbsoluteUrl } from "@/lib/seo/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Keep the sitemap response out of the Full Route Cache. Inventory XML
  // remains protected by getInventorySnapshot's explicit Data Cache TTL and
  // tag, so this does not increase AutoManager requests; it only prevents the
  // sitemap document from outliving the inventory snapshot it references.
  await connection();

  // Omit lastModified until the feed exposes a real vehicle-update timestamp.
  // Using the sitemap request or XML parse time would tell crawlers every URL
  // changed on every request, even when the underlying vehicle did not.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: createAbsoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: createAbsoluteUrl("/inventory"),
      changeFrequency: "hourly",
      priority: 0.95
    },
    {
      url: createAbsoluteUrl("/location"),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: createAbsoluteUrl("/contact"),
      changeFrequency: "monthly",
      priority: 0.75
    },
    {
      url: createAbsoluteUrl("/schedule-test-drive"),
      changeFrequency: "weekly",
      priority: 0.75
    },
    {
      url: createAbsoluteUrl("/vehicle-finder"),
      changeFrequency: "weekly",
      priority: 0.75
    },
    {
      url: createAbsoluteUrl("/sell-us-your-car"),
      changeFrequency: "weekly",
      priority: 0.75
    }
  ];

  const snapshot = await getInventorySnapshot();

  const vehicleRoutes: MetadataRoute.Sitemap = snapshot.vehicles.map((vehicle) => ({
    url: createAbsoluteUrl(`/inventory/${vehicle.slug}`),
    changeFrequency: "daily",
    priority: 0.85
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
