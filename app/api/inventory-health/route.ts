import { NextResponse } from "next/server";
import { getInventorySnapshot } from "@/lib/inventory/get-inventory";
import { getInventoryCachePolicy, isDealerOpen, getTodayBusinessHours } from "@/lib/site/business-hours";
import { getBaseUrl, shouldIndexSite } from "@/lib/seo/site-url";

export async function GET(request: Request) {
  const configuredSecret = process.env.INVENTORY_STATUS_SECRET;
  const url = new URL(request.url);
  const providedSecret =
    request.headers.get("x-inventory-secret") || url.searchParams.get("secret");

  /**
   * Fail closed: if the secret is unset or left at the placeholder,
   * the endpoint is unavailable rather than public. Prefer sending the
   * secret via the x-inventory-secret header; query strings end up in
   * logs.
   */
  if (!configuredSecret || configuredSecret === "change-me" || providedSecret !== configuredSecret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const snapshot = await getInventorySnapshot();
  const policy = getInventoryCachePolicy();

  return NextResponse.json({
    ok: snapshot.errors.length === 0 && snapshot.warnings.length === 0,
    /**
     * On production this must be true. Point an uptime monitor at this
     * field - false in production means the whole site is noindexed.
     */
    indexingEnabled: shouldIndexSite(),
    baseUrl: getBaseUrl(),
    vercelEnv: process.env.VERCEL_ENV || "unknown",
    mode: process.env.INVENTORY_MODE || "fixture",
    dealerOpenNow: isDealerOpen(),
    todayHours: getTodayBusinessHours(),
    cachePolicy: policy,
    vehicleCount: snapshot.vehicleCount,
    photoCount: snapshot.photoCount,
    featureCount: snapshot.featureCount,
    fetchedAt: snapshot.fetchedAt,
    parsedAt: snapshot.parsedAt,
    warnings: snapshot.warnings,
    errors: snapshot.errors
  });
}
