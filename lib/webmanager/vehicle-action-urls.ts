import type { Vehicle } from "@/lib/inventory/types";

const WEBMANAGER_BASE_URL = "https://www.repeteauto.com";

function withFramed(url: string) {
  const parsed = new URL(url, WEBMANAGER_BASE_URL);
  parsed.searchParams.set("Framed", "1");
  return parsed.toString();
}

export function getCreditApplicationFrameUrl(vehicle: Vehicle) {
  if (vehicle.webManagerId) {
    return withFramed(
      `${WEBMANAGER_BASE_URL}/credit-application/?VehicleID=${encodeURIComponent(vehicle.webManagerId)}`
    );
  }

  return withFramed(`${WEBMANAGER_BASE_URL}/credit-application`);
}

export function getCreditApplicationCopy(vehicle: Vehicle) {
  return {
    title: "Start Credit Application",
    description: `Start the credit application process for this ${vehicle.title}. Sensitive application details stay inside Repete Auto's existing WebManager process.`
  };
}
