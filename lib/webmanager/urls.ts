const WEBMANAGER_BASE_URL =
  process.env.NEXT_PUBLIC_WEBMANAGER_BASE_URL ||
  "https://clients.automanager.com/e90d3789cf7843e0ba9b798f6ce4e87a";

function buildWebManagerFrameUrl(path: string) {
  const parsed = new URL(path.replace(/^\/+/, ""), `${WEBMANAGER_BASE_URL.replace(/\/+$/, "")}/`);
  parsed.searchParams.set("Framed", "1");
  return parsed.toString();
}

export const webManagerUrls = {
  contact: buildWebManagerFrameUrl("contact-us"),
  scheduleTestDrive: buildWebManagerFrameUrl("schedule-test-drive"),
  vehicleFinder: buildWebManagerFrameUrl("vehicle-finder"),
  sellUsYourCar: buildWebManagerFrameUrl("sell-us-your-car"),
} as const;
