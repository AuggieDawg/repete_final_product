import type { Vehicle } from "@/lib/inventory/types";

const WEBMANAGER_BASE_URL =
  process.env.NEXT_PUBLIC_WEBMANAGER_BASE_URL ||
  "https://clients.automanager.com/e90d3789cf7843e0ba9b798f6ce4e87a";

function buildWebManagerUrl(path: string) {
  return new URL(path.replace(/^\/+/, ""), `${WEBMANAGER_BASE_URL.replace(/\/+$/, "")}/`);
}

function buildFramedWebManagerUrl(path: string) {
  const parsed = buildWebManagerUrl(path);
  parsed.searchParams.set("Framed", "1");
  return parsed.toString();
}

export function getCreditApplicationFrameUrl(vehicle: Vehicle) {
  if (vehicle.webManagerId) {
    const parsed = buildWebManagerUrl("credit-application/");
    parsed.searchParams.set("VehicleID", vehicle.webManagerId);
    parsed.searchParams.set("Framed", "1");
    return parsed.toString();
  }

  return buildFramedWebManagerUrl("credit-application");
}

export function getCreditApplicationCopy(vehicle: Vehicle) {
  return {
    title: "Start Credit Application",
    description: `Start the credit application process for this ${vehicle.title}. Sensitive application details stay inside Repete Auto's existing WebManager process.`
  };
}
