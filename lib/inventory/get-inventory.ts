import fs from "node:fs/promises";
import path from "node:path";
import { parseAutoManagerInventoryXml } from "./parse-automanager-xml";
import type { InventorySnapshot } from "./types";
import { getInventoryCachePolicy } from "@/lib/site/business-hours";

const SAMPLE_FIXTURE_PATH = path.join(
  process.cwd(),
  "data/fixtures/automanager-inventory.sample.xml"
);

const LIVE_FIXTURE_PATH = path.join(
  process.cwd(),
  "data/fixtures/automanager-inventory.live.xml"
);

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

export async function getInventorySnapshot(): Promise<InventorySnapshot> {
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
      cachePolicy
    };
  }
}
