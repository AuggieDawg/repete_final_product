import { XMLParser } from "fast-xml-parser";
import type { InventorySnapshot, Vehicle } from "./types";

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function cleanText(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const text = String(value).replace(/\s+/g, " ").trim();
    return text.length ? text : undefined;
  }

  if (isRecord(value)) {
    const textNode = value["#text"];
    if (textNode !== undefined) return cleanText(textNode);
  }

  return undefined;
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getDeepValue(node: unknown, aliases: string[], seen = new WeakSet<object>()): unknown {
  const normalizedAliases = aliases.map(normalizeKey);

  function walk(current: unknown): unknown {
    if (current === null || current === undefined) return undefined;

    if (Array.isArray(current)) {
      for (const item of current) {
        const found = walk(item);
        if (found !== undefined) return found;
      }
      return undefined;
    }

    if (!isRecord(current)) return undefined;

    if (seen.has(current)) return undefined;
    seen.add(current);

    for (const [key, value] of Object.entries(current)) {
      if (normalizedAliases.includes(normalizeKey(key))) {
        return value;
      }
    }

    for (const value of Object.values(current)) {
      const found = walk(value);
      if (found !== undefined) return found;
    }

    return undefined;
  }

  return walk(node);
}

function parseInteger(value: unknown): number | undefined {
  const text = cleanText(value);
  if (!text) return undefined;

  const cleaned = text.replace(/[^0-9]/g, "");
  if (!cleaned) return undefined;

  const parsed = Number.parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseMoney(value: unknown): number | null | undefined {
  const text = cleanText(value);
  if (!text) return undefined;

  if (/call|ask|contact/i.test(text)) return null;

  const cleaned = text.replace(/[^0-9.]/g, "");
  if (!cleaned) return undefined;

  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? Math.round(parsed) : undefined;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function normalizeAbsoluteWebManagerUrl(value?: string): string | undefined {
  if (!value) return undefined;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return `https://www.repeteauto.com${value}`;
  }

  return undefined;
}

function stringLooksLikeImageUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) && (
    /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(value) ||
    /photo|image|pictures|vehicle/i.test(value)
  );
}

function collectPhotoUrls(node: unknown): string[] {
  const urls = new Set<string>();

  function walk(current: unknown, path: string[] = []) {
    if (current === null || current === undefined) return;

    if (Array.isArray(current)) {
      current.forEach((item) => walk(item, path));
      return;
    }

    if (typeof current === "string" || typeof current === "number") {
      const text = cleanText(current);
      const pathText = path.join(".").toLowerCase();

      if (
        text &&
        /^https?:\/\//i.test(text) &&
        (pathText.includes("photo") ||
          pathText.includes("image") ||
          pathText.includes("picture") ||
          stringLooksLikeImageUrl(text))
      ) {
        urls.add(text);
      }

      return;
    }

    if (!isRecord(current)) return;

    for (const [key, value] of Object.entries(current)) {
      walk(value, [...path, key]);
    }
  }

  walk(node);
  return Array.from(urls);
}

function collectFeatures(node: unknown): string[] {
  const features = new Set<string>();

  function walk(current: unknown, path: string[] = []) {
    if (current === null || current === undefined) return;

    if (Array.isArray(current)) {
      current.forEach((item) => walk(item, path));
      return;
    }

    if (typeof current === "string" || typeof current === "number") {
      const text = cleanText(current);
      const pathText = path.join(".").toLowerCase();

      if (
        text &&
        text.length <= 80 &&
        !/^https?:\/\//i.test(text) &&
        (pathText.includes("feature") ||
          pathText.includes("option") ||
          pathText.includes("equipment"))
      ) {
        features.add(text);
      }

      return;
    }

    if (!isRecord(current)) return;

    for (const [key, value] of Object.entries(current)) {
      walk(value, [...path, key]);
    }
  }

  walk(node);
  return Array.from(features);
}

function getShallowValue(node: unknown, aliases: string[]): unknown {
  if (!isRecord(node)) return undefined;

  const normalizedAliases = aliases.map(normalizeKey);

  for (const [key, value] of Object.entries(node)) {
    if (normalizedAliases.includes(normalizeKey(key))) {
      return value;
    }
  }

  return undefined;
}

function scoreAsVehicle(node: unknown): number {
  if (!isRecord(node)) return 0;

  const checks = [
    getShallowValue(node, ["VIN", "Vin"]),
    getShallowValue(node, ["StockNumber", "StockNo", "Stock", "StockNum"]),
    getShallowValue(node, ["Year", "ModelYear"]),
    getShallowValue(node, ["Make"]),
    getShallowValue(node, ["Model"]),
    getShallowValue(node, ["InternetPrice", "Price", "RetailPrice", "SalePrice"])
  ];

  return checks.filter((value) => cleanText(value) !== undefined).length;
}

function collectExplicitVehicleNodes(root: unknown): unknown[] {
  const vehicles: unknown[] = [];

  function walk(current: unknown) {
    if (current === null || current === undefined) return;

    if (Array.isArray(current)) {
      current.forEach(walk);
      return;
    }

    if (!isRecord(current)) return;

    for (const [key, value] of Object.entries(current)) {
      const normalizedKey = normalizeKey(key);

      if (normalizedKey === "vehicle" || normalizedKey === "vehicles") {
        for (const item of asArray(value)) {
          if (Array.isArray(item)) {
            item.forEach((nested) => {
              if (scoreAsVehicle(nested) >= 3) vehicles.push(nested);
            });
          } else if (scoreAsVehicle(item) >= 3) {
            vehicles.push(item);
          } else {
            walk(item);
          }
        }
      } else {
        walk(value);
      }
    }
  }

  walk(root);
  return vehicles;
}

function collectHeuristicVehicleNodes(root: unknown): unknown[] {
  const candidates: unknown[] = [];

  function walk(current: unknown) {
    if (current === null || current === undefined) return;

    if (Array.isArray(current)) {
      current.forEach(walk);
      return;
    }

    if (!isRecord(current)) return;

    if (scoreAsVehicle(current) >= 3) {
      candidates.push(current);
      return;
    }

    for (const value of Object.values(current)) {
      walk(value);
    }
  }

  walk(root);
  return candidates;
}

function collectVehicleNodes(root: unknown): unknown[] {
  const explicitVehicles = collectExplicitVehicleNodes(root);

  if (explicitVehicles.length > 0) {
    return explicitVehicles;
  }

  return collectHeuristicVehicleNodes(root);
}

function normalizeVehicle(node: unknown, index: number): Vehicle | null {
  const stockNumber = cleanText(getDeepValue(node, ["StockNumber", "StockNo", "Stock", "StockNum"]));
  const vin = cleanText(getDeepValue(node, ["VIN", "Vin"]));
  const webManagerId = cleanText(
    getDeepValue(node, [
      "VehicleID",
      "VehicleId",
      "WebManagerVehicleID",
      "WebManagerVehicleId",
      "AutoManagerVehicleID",
      "AutoManagerVehicleId",
      "InventoryVehicleID",
      "InventoryVehicleId",
      "ListingID",
      "ListingId"
    ])
  );
  const webManagerDetailUrl = normalizeAbsoluteWebManagerUrl(
    cleanText(
      getDeepValue(node, [
        "WebManagerUrl",
        "WebManagerURL",
        "VehicleUrl",
        "VehicleURL",
        "VehicleDetailUrl",
        "VehicleDetailURL",
        "DetailUrl",
        "DetailURL",
        "DetailsUrl",
        "DetailsURL",
        "ListingUrl",
        "ListingURL",
        "VDPUrl",
        "VDPURL"
      ])
    )
  );
  const year = parseInteger(getDeepValue(node, ["Year", "ModelYear"]));
  const make = cleanText(getDeepValue(node, ["Make"]));
  const model = cleanText(getDeepValue(node, ["Model"]));
  const trim = cleanText(getDeepValue(node, ["Trim"]));
  const bodyStyle = cleanText(getDeepValue(node, ["BodyStyle", "Body", "VehicleType", "Type"]));
  const exteriorColor = cleanText(getDeepValue(node, ["ExteriorColor", "ExtColor", "Color"]));
  const interiorColor = cleanText(getDeepValue(node, ["InteriorColor", "IntColor"]));
  const mileage = parseInteger(getDeepValue(node, ["Mileage", "Miles", "Odometer"]));
  const price = parseMoney(getDeepValue(node, ["InternetPrice", "Price", "RetailPrice", "SalePrice", "AskingPrice"]));
  const engine = cleanText(getDeepValue(node, ["Engine"]));
  const transmission = cleanText(getDeepValue(node, ["Transmission"]));
  const drivetrain = cleanText(getDeepValue(node, ["Drivetrain", "DriveTrain", "Drive"]));
  const fuelType = cleanText(getDeepValue(node, ["FuelType", "Fuel"]));
  const description = cleanText(getDeepValue(node, ["Description", "Comments", "VehicleDescription"]));
  const features = collectFeatures(node);
  const photos = collectPhotoUrls(node);

  if (!year && !make && !model && !vin && !stockNumber) {
    return null;
  }

  const title = [year, make, model, trim].filter(Boolean).join(" ");
  const stableId = stockNumber || vin || `vehicle-${index + 1}`;
  const slug = slugify(`${title || "vehicle"}-${stableId}`);

  return {
    id: stableId,
    slug,
    detailUrl: `/inventory/${slug}`,
    webManagerId,
    webManagerDetailUrl,
    stockNumber,
    vin,
    year,
    make,
    model,
    trim,
    bodyStyle,
    exteriorColor,
    interiorColor,
    mileage,
    price,
    engine,
    transmission,
    drivetrain,
    fuelType,
    description,
    features,
    photos,
    title: title || `Vehicle ${index + 1}`
  };
}

function dedupeVehicles(vehicles: Vehicle[]): Vehicle[] {
  const seen = new Set<string>();
  const output: Vehicle[] = [];

  for (const vehicle of vehicles) {
    const key = vehicle.vin || vehicle.stockNumber || vehicle.id;

    if (seen.has(key)) continue;

    seen.add(key);
    output.push(vehicle);
  }

  return output;
}

export function parseAutoManagerInventoryXml(
  xml: string,
  source: InventorySnapshot["source"] = "automanager-xml"
): InventorySnapshot {
  const warnings: string[] = [];
  const errors: string[] = [];
  const now = new Date().toISOString();

  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text",
      trimValues: true,
      parseTagValue: false,
      parseAttributeValue: false
    });

    const parsed = parser.parse(xml);
    const candidates = collectVehicleNodes(parsed);

    if (candidates.length === 0) {
      warnings.push("No vehicle candidates were found in the XML.");
    }

    const vehicles = dedupeVehicles(
      candidates
        .map((candidate, index) => normalizeVehicle(candidate, index))
        .filter(Boolean) as Vehicle[]
    );

    for (const vehicle of vehicles) {
      if (!vehicle.photos.length) {
        warnings.push(`Vehicle ${vehicle.stockNumber || vehicle.vin || vehicle.title} has no photos.`);
      }

      if (vehicle.price === undefined) {
        warnings.push(`Vehicle ${vehicle.stockNumber || vehicle.vin || vehicle.title} has no price field.`);
      }
    }

    return {
      vehicles,
      source,
      fetchedAt: now,
      parsedAt: now,
      vehicleCount: vehicles.length,
      photoCount: vehicles.reduce((total, vehicle) => total + vehicle.photos.length, 0),
      featureCount: vehicles.reduce((total, vehicle) => total + vehicle.features.length, 0),
      warnings,
      errors
    };
  } catch (error) {
    return {
      vehicles: [],
      source,
      fetchedAt: now,
      parsedAt: now,
      vehicleCount: 0,
      photoCount: 0,
      featureCount: 0,
      warnings,
      errors: [error instanceof Error ? error.message : "Unknown XML parse error"]
    };
  }
}
