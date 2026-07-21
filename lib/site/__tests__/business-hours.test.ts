import { describe, expect, it } from "vitest";
import {
  getInventoryCachePolicy,
  INVENTORY_AFTER_HOURS_TTL_SECONDS,
  INVENTORY_OPEN_TTL_SECONDS,
  INVENTORY_PREVIEW_TTL_SECONDS,
  INVENTORY_SUNDAY_TTL_SECONDS,
  isDealerOpen
} from "../business-hours";

function expectPolicy(
  isoDate: string,
  mode: string,
  ttlSeconds: number,
  isOpen: boolean
) {
  const date = new Date(isoDate);
  const policy = getInventoryCachePolicy(date);

  expect(isDealerOpen(date)).toBe(isOpen);
  expect(policy.mode).toBe(mode);
  expect(policy.ttlSeconds).toBe(ttlSeconds);
  expect(policy.label).toContain(
    ttlSeconds === INVENTORY_OPEN_TTL_SECONDS
      ? "30 minutes"
      : ttlSeconds === INVENTORY_SUNDAY_TTL_SECONDS
        ? "12 hours"
        : "6 hours"
  );
}

describe("Repete business hours", () => {
  it("freezes preview inventory for 24 hours", () => {
    const policy = getInventoryCachePolicy(
      new Date("2026-07-10T15:00:00.000Z"),
      "preview"
    );

    expect(policy.mode).toBe("preview-daily");
    expect(policy.ttlSeconds).toBe(INVENTORY_PREVIEW_TTL_SECONDS);
    expect(policy.label).toContain("24 hours");
  });

  it("keeps the normal cache policy in production", () => {
    const policy = getInventoryCachePolicy(
      new Date("2026-07-10T15:00:00.000Z"),
      "production"
    );

    expect(policy.mode).toBe("business-hours");
    expect(policy.ttlSeconds).toBe(INVENTORY_OPEN_TTL_SECONDS);
  });

  it("uses the faster cache throughout Friday business hours", () => {
    expectPolicy("2026-05-22T15:00:00.000Z", "business-hours", INVENTORY_OPEN_TTL_SECONDS, true);
    expectPolicy("2026-05-22T23:59:00.000Z", "business-hours", INVENTORY_OPEN_TTL_SECONDS, true);
    expectPolicy("2026-05-23T00:00:00.000Z", "after-hours", INVENTORY_AFTER_HOURS_TTL_SECONDS, false);
  });

  it("uses Saturday hours at their exact boundaries", () => {
    expectPolicy("2026-05-23T15:59:00.000Z", "after-hours", INVENTORY_AFTER_HOURS_TTL_SECONDS, false);
    expectPolicy("2026-05-23T16:00:00.000Z", "business-hours", INVENTORY_OPEN_TTL_SECONDS, true);
    expectPolicy("2026-05-23T19:59:00.000Z", "business-hours", INVENTORY_OPEN_TTL_SECONDS, true);
    expectPolicy("2026-05-23T20:00:00.000Z", "after-hours", INVENTORY_AFTER_HOURS_TTL_SECONDS, false);
  });

  it("uses the closed policy throughout Sunday", () => {
    expectPolicy("2026-05-24T06:00:00.000Z", "closed-sunday", INVENTORY_SUNDAY_TTL_SECONDS, false);
    expectPolicy("2026-05-24T18:00:00.000Z", "closed-sunday", INVENTORY_SUNDAY_TTL_SECONDS, false);
  });

  it("uses America/Denver correctly in winter and summer", () => {
    expectPolicy("2026-01-09T16:00:00.000Z", "business-hours", INVENTORY_OPEN_TTL_SECONDS, true);
    expectPolicy("2026-07-10T15:00:00.000Z", "business-hours", INVENTORY_OPEN_TTL_SECONDS, true);
  });
});
