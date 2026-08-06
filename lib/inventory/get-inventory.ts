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

const FEED_FETCH_TIMEOUT_MS = 6000;
const FEED_RETRY_DELAY_MS = 250;
const FEED_MAX_ATTEMPTS = 2;

type InventoryFetch = typeof fetch;

type AutoManagerFetchRuntime = {
  fetchImpl?: InventoryFetch;
  timeoutMs?: number;
  retryDelayMs?: number;
};

export class FeedTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`AutoManager XML request timed out after ${timeoutMs}ms`);
    this.name = "FeedTimeoutError";
  }
}

export class AutoManagerHttpError extends Error {
  readonly status: number;

  constructor(status: number, statusText: string) {
    super(`AutoManager XML request failed: ${status} ${statusText}`.trim());
    this.name = "AutoManagerHttpError";
    this.status = status;
  }
}

/**
 * Only retry failures that a second upstream request can plausibly fix.
 * Authentication, configuration, and other ordinary 4xx responses are
 * intentionally permanent so they do not consume another feed request.
 */
export function isRetryableAutoManagerError(error: unknown): boolean {
  if (error instanceof FeedTimeoutError) return true;

  if (error instanceof AutoManagerHttpError) {
    return (
      error.status === 408 ||
      error.status === 429 ||
      (error.status >= 500 && error.status <= 599)
    );
  }

  // Fetch reports transport failures (DNS, reset sockets, interrupted bodies)
  // as TypeError. Abort/timeout names cover compatible fetch implementations.
  if (error instanceof TypeError) return true;

  if (error instanceof Error) {
    if (error.name === "AbortError" || error.name === "TimeoutError") return true;

    const code = (error as Error & { code?: unknown }).code;
    return (
      typeof code === "string" &&
      /^(?:EAI_AGAIN|ECONNABORTED|ECONNREFUSED|ECONNRESET|ENETDOWN|ENETUNREACH|ETIMEDOUT|UND_ERR_)/.test(
        code
      )
    );
  }

  return false;
}

function waitForRetry(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function fetchLiveXmlAttempt(
  url: string,
  ttlSeconds: number,
  fetchImpl: InventoryFetch,
  timeoutMs: number
): Promise<string> {
  const controller = new AbortController();
  const timeoutError = new FeedTimeoutError(timeoutMs);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const request = Promise.resolve()
    .then(() =>
      fetchImpl(url, {
        signal: controller.signal,
        // Keep Next's durable Data Cache policy on every attempt. The signal
        // makes the upstream work abortable without removing revalidation or
        // the tag used by inventory refreshes.
        next: {
          revalidate: ttlSeconds,
          tags: ["repete-inventory"]
        }
      })
    )
    .then(async (response) => {
      if (!response.ok) {
        throw new AutoManagerHttpError(response.status, response.statusText);
      }

      return response.text();
    });

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort(timeoutError);
      reject(timeoutError);
    }, timeoutMs);
  });

  try {
    return await Promise.race([request, timeout]);
  } catch (error) {
    // Some fetch implementations reject with AbortError instead of the abort
    // reason. Preserve the more useful timeout error in that case.
    if (controller.signal.aborted) throw timeoutError;
    throw error;
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

/**
 * Load the XML with one tightly bounded retry. At most two upstream attempts
 * are made, protecting AutoManager's limited request allowance. Retry-After
 * is deliberately not followed: a fixed 250ms delay cannot turn a vendor
 * header into a long-running page render.
 */
export async function fetchAutoManagerXml(
  url: string,
  ttlSeconds: number,
  runtime: AutoManagerFetchRuntime = {}
): Promise<string> {
  const fetchImpl = runtime.fetchImpl ?? fetch;
  const timeoutMs = runtime.timeoutMs ?? FEED_FETCH_TIMEOUT_MS;
  const retryDelayMs = runtime.retryDelayMs ?? FEED_RETRY_DELAY_MS;

  let lastError: unknown;

  for (let attempt = 1; attempt <= FEED_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await fetchLiveXmlAttempt(url, ttlSeconds, fetchImpl, timeoutMs);
    } catch (error) {
      lastError = error;

      if (attempt === FEED_MAX_ATTEMPTS || !isRetryableAutoManagerError(error)) {
        throw error;
      }

      await waitForRetry(retryDelayMs);
    }
  }

  // The loop either returns or throws. This guard keeps the control flow
  // explicit if the attempt policy is edited later.
  throw lastError instanceof Error
    ? lastError
    : new Error("AutoManager XML request failed after retries");
}

async function getLiveXml(ttlSeconds: number): Promise<string> {
  const url = process.env.AUTOMANAGER_XML_URL;

  if (!url) {
    throw new Error("AUTOMANAGER_XML_URL is missing.");
  }

  return fetchAutoManagerXml(url, ttlSeconds);
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
