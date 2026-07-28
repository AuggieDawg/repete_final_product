import { describe, expect, it } from "vitest";
import {
  chooseServableSnapshot,
  isHealthySnapshot
} from "../get-inventory";
import type { InventorySnapshot } from "../types";

function makeSnapshot(overrides: Partial<InventorySnapshot> = {}): InventorySnapshot {
  return {
    vehicles: [],
    source: "automanager-xml",
    fetchedAt: "2026-07-26T10:00:00.000Z",
    parsedAt: "2026-07-26T10:00:00.000Z",
    vehicleCount: 0,
    photoCount: 0,
    featureCount: 0,
    warnings: [],
    errors: [],
    cachePolicy: {
      mode: "business-hours",
      ttlSeconds: 1800,
      label: "test"
    },
    ...overrides
  };
}

const healthy = makeSnapshot({ vehicleCount: 19, fetchedAt: "2026-07-26T09:00:00.000Z" });

describe("isHealthySnapshot", () => {
  it("treats a snapshot with vehicles and no errors as healthy", () => {
    expect(isHealthySnapshot(healthy, { allowEmpty: false })).toBe(true);
  });

  it("treats a snapshot with errors as unhealthy", () => {
    const errored = makeSnapshot({ vehicleCount: 12, errors: ["fetch failed"] });
    expect(isHealthySnapshot(errored, { allowEmpty: false })).toBe(false);
  });

  it("treats an empty snapshot as unhealthy by default", () => {
    expect(isHealthySnapshot(makeSnapshot(), { allowEmpty: false })).toBe(false);
  });

  it("allows an empty snapshot when explicitly permitted", () => {
    expect(isHealthySnapshot(makeSnapshot(), { allowEmpty: true })).toBe(true);
  });
});

describe("chooseServableSnapshot", () => {
  it("serves a healthy new snapshot and reports no fallback", () => {
    const next = makeSnapshot({ vehicleCount: 21 });
    const result = chooseServableSnapshot(next, healthy, { allowEmpty: false });

    expect(result.snapshot).toBe(next);
    expect(result.usedFallback).toBe(false);
  });

  it("falls back to the previous snapshot when the new load errored", () => {
    const next = makeSnapshot({ errors: ["AutoManager XML request failed: 502 Bad Gateway"] });
    const result = chooseServableSnapshot(next, healthy, { allowEmpty: false });

    expect(result.usedFallback).toBe(true);
    expect(result.snapshot.vehicleCount).toBe(19);
    expect(result.snapshot.warnings.join(" ")).toContain("last known good");
    expect(result.snapshot.warnings.join(" ")).toContain("502 Bad Gateway");
  });

  it("falls back when the new load parsed to zero vehicles without errors", () => {
    const next = makeSnapshot();
    const result = chooseServableSnapshot(next, healthy, { allowEmpty: false });

    expect(result.usedFallback).toBe(true);
    expect(result.snapshot.vehicleCount).toBe(19);
    expect(result.snapshot.warnings.join(" ")).toContain("zero vehicles");
  });

  it("serves the zero-vehicle snapshot when empty inventory is explicitly allowed", () => {
    const next = makeSnapshot();
    const result = chooseServableSnapshot(next, healthy, { allowEmpty: true });

    expect(result.usedFallback).toBe(false);
    expect(result.snapshot).toBe(next);
  });

  it("serves the unhealthy snapshot unchanged when no previous snapshot exists", () => {
    const next = makeSnapshot({ errors: ["fetch failed"] });
    const result = chooseServableSnapshot(next, null, { allowEmpty: false });

    expect(result.snapshot).toBe(next);
    expect(result.usedFallback).toBe(false);
  });

  it("does not mutate the previous snapshot when appending fallback warnings", () => {
    const previous = makeSnapshot({ vehicleCount: 19, warnings: ["existing"] });
    const next = makeSnapshot({ errors: ["boom"] });
    const result = chooseServableSnapshot(next, previous, { allowEmpty: false });

    expect(previous.warnings).toEqual(["existing"]);
    expect(result.snapshot.warnings).toHaveLength(2);
  });
});
