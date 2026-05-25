import { NextResponse } from "next/server";
import { getInventorySnapshot } from "@/lib/inventory/get-inventory";
import { getInventoryCachePolicy, isDealerOpen, getTodayBusinessHours } from "@/lib/site/business-hours";

export async function GET(request: Request) {
  const configuredSecret = process.env.INVENTORY_STATUS_SECRET;
  const url = new URL(request.url);
  const providedSecret = url.searchParams.get("secret");

  if (configuredSecret && configuredSecret !== "change-me" && providedSecret !== configuredSecret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const snapshot = await getInventorySnapshot();
  const policy = getInventoryCachePolicy();

  return NextResponse.json({
    ok: snapshot.errors.length === 0,
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
