import type { MetadataRoute } from "next";
import { getInventorySnapshot } from "@/lib/inventory/get-inventory";
import { createAbsoluteUrl } from "@/lib/seo/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: createAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: createAbsoluteUrl("/inventory"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.95
    },
    {
      url: createAbsoluteUrl("/location"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: createAbsoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75
    },
    {
      url: createAbsoluteUrl("/schedule-test-drive"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75
    },
    {
      url: createAbsoluteUrl("/vehicle-finder"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75
    },
    {
      url: createAbsoluteUrl("/sell-us-your-car"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75
    }
  ];

  const snapshot = await getInventorySnapshot();

  const vehicleRoutes: MetadataRoute.Sitemap = snapshot.vehicles.map((vehicle) => ({
    url: createAbsoluteUrl(`/inventory/${vehicle.slug}`),
    lastModified: new Date(snapshot.fetchedAt || snapshot.parsedAt || now),
    changeFrequency: "daily",
    priority: 0.85
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
