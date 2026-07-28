import fs from "node:fs/promises";
import path from "node:path";
import { parseAutoManagerInventoryXml } from "./parse-automanager-xml";
import type { InventorySnapshot, Vehicle } from "./types";
import { getInventoryCachePolicy } from "@/lib/site/business-hours";

const SAMPLE_FIXTURE_PATH = path.join(
  process.cwd(),
  "data/fixtures/automanager-inventory.sample.xml"
);

const LIVE_FIXTURE_PATH = path.join(
  process.cwd(),
  "data/fixtures/automanager-inventory.live.xml"
);

/**
 * Last snapshot that loaded and parsed successfully, kept at module scope.
 *
 * On Vercel this survives across requests on a warm instance, which is
 * exactly the window in which a transient feed failure would otherwise
 * publish an empty inventory: an empty snapshot empties the sitemap,
 * blanks /inventory, and turns every vehicle detail page into a 404
 * while Googlebot is crawling. Serving the last known good snapshot
 * (with a warning attached) is strictly better than serving nothing.
 */
let lastGoodSnapshot: InventorySnapshot | null = null;

export function __resetInventorySnapshotCacheForTests() {
  lastGoodSnapshot = null;
}

function allowEmptyInventory(): boolean {
  // Escape hatch for the legitimate "lot is actually empty" case.
  return process.env.INVENTORY_ALLOW_EMPTY === "true";
}

export function isHealthySnapshot(
  snapshot: InventorySnapshot,
  { allowEmpty = allowEmptyInventory() }: { allowEmpty?: boolean } = {}
): boolean {
  if (snapshot.errors.length > 0) return false;
  if (snapshot.vehicleCount === 0 && !allowEmpty) return false;

  return true;
}

/**
 * Pure decision function: given the freshly loaded snapshot and the
 * previous known-good one, decide which snapshot to serve.
 * Exported for unit tests.
 */
export function chooseServableSnapshot(
  next: InventorySnapshot,
  previous: InventorySnapshot | null,
  { allowEmpty = allowEmptyInventory() }: { allowEmpty?: boolean } = {}
): { snapshot: InventorySnapshot; usedFallback: boolean } {
  if (isHealthySnapshot(next, { allowEmpty })) {
    return { snapshot: next, usedFallback: false };
  }

  if (previous) {
    const reason =
      next.errors.length > 0
        ? `latest load failed (${next.errors.join("; ")})`
        : "latest load returned zero vehicles";

    return {
      snapshot: {
        ...previous,
        warnings: [
          ...previous.warnings,
          `Serving last known good inventory from ${previous.fetchedAt} because ${reason}.`
        ]
      },
      usedFallback: true
    };
  }

  return { snapshot: next, usedFallback: false };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getFixtureXml(): Promise<string> {
  const hasLiveFixture = await fileExists(LIVE_FIXTURE_PATH);
  const fixturePath = hasLiveFixture ? LIVE_FIXTURE_PATH : SAMPLE_FIXTURE_PATH;

  return fs.readFile(fixturePath, "utf8");
}

async function getLiveXml(ttlSeconds: number): Promise<string> {
  const url = process.env.AUTOMANAGER_XML_URL;

  if (!url) {
    throw new Error("AUTOMANAGER_XML_URL is missing.");
  }

  const response = await fetch(url, {
    next: {
      revalidate: ttlSeconds,
      tags: ["repete-inventory"]
    }
  });

  if (!response.ok) {
    throw new Error(`AutoManager XML request failed: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function buildErrorSnapshot(mode: string, error: unknown): InventorySnapshot {
  const now = new Date().toISOString();

  return {
    vehicles: [],
    source: mode === "live-cached" ? "automanager-xml" : "fixture",
    fetchedAt: now,
    parsedAt: now,
    vehicleCount: 0,
    photoCount: 0,
    featureCount: 0,
    warnings: [],
    errors: [error instanceof Error ? error.message : "Unknown inventory loading error"],
    cachePolicy: getInventoryCachePolicy()
  };
}

async function loadSnapshot(): Promise<InventorySnapshot> {
  const mode = process.env.INVENTORY_MODE || "fixture";
  const cachePolicy = getInventoryCachePolicy();

  try {
    if (mode === "live-cached") {
      const xml = await getLiveXml(cachePolicy.ttlSeconds);
      const snapshot = parseAutoManagerInventoryXml(xml, "automanager-xml");

      return {
        ...snapshot,
        cachePolicy
      };
    }

    const xml = await getFixtureXml();
    const snapshot = parseAutoManagerInventoryXml(xml, "fixture");

    return {
      ...snapshot,
      cachePolicy
    };
  } catch (error) {
    return buildErrorSnapshot(mode, error);
  }
}

export async function getInventorySnapshot(): Promise<InventorySnapshot> {
  const mode = process.env.INVENTORY_MODE || "fixture";
  const loaded = await loadSnapshot();

  /**
   * Guard against silently serving fixture data in production. This is
   * a warning (not a hard failure) so a misconfigured deploy stays up,
   * but the inventory-health endpoint will surface it immediately.
   */
  if (process.env.VERCEL_ENV === "production" && mode !== "live-cached") {
    loaded.warnings = [
      ...loaded.warnings,
      `INVENTORY_MODE is "${mode}" in production; expected "live-cached".`
    ];
  }

  const { snapshot } = chooseServableSnapshot(loaded, lastGoodSnapshot);

  if (snapshot === loaded && isHealthySnapshot(loaded)) {
    lastGoodSnapshot = loaded;
  }

  return snapshot;
}

export class InventoryUnavailableError extends Error {
  constructor(details: string) {
    super(`Inventory is temporarily unavailable: ${details}`);
    this.name = "InventoryUnavailableError";
  }
}

/**
 * Resolve a vehicle by slug with outage awareness.
 *
 * Returns the vehicle when found. Returns undefined only when the
 * snapshot is healthy and the vehicle is genuinely absent (sold or
 * removed) - callers should 404 in that case. Throws when the snapshot
 * itself is unhealthy, so a feed outage surfaces as a 5xx (temporary,
 * retried by crawlers) instead of a 404 (permanent, deindexed).
 */
export function findVehicleOrThrowWhenUnhealthy(
  snapshot: InventorySnapshot,
  slug: string
): Vehicle | undefined {
  const vehicle = snapshot.vehicles.find((item) => item.slug === slug);

  if (vehicle) return vehicle;

  if (!isHealthySnapshot(snapshot)) {
    throw new InventoryUnavailableError(
      snapshot.errors.join("; ") || "inventory feed returned no vehicles"
    );
  }

  return undefined;
}
