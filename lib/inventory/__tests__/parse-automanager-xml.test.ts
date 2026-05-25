import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseAutoManagerInventoryXml } from "../parse-automanager-xml";

describe("parseAutoManagerInventoryXml", () => {
  it("parses sample AutoManager-style XML into normalized vehicles", () => {
    const xml = fs.readFileSync(
      path.join(process.cwd(), "data/fixtures/automanager-inventory.sample.xml"),
      "utf8"
    );

    const snapshot = parseAutoManagerInventoryXml(xml, "fixture");

    expect(snapshot.errors).toHaveLength(0);
    expect(snapshot.vehicleCount).toBe(2);
    expect(snapshot.vehicles[0].title).toContain("Ford");
    expect(snapshot.vehicles[0].price).toBe(42995);
    expect(snapshot.vehicles[1].price).toBeNull();
    expect(snapshot.photoCount).toBe(3);
    expect(snapshot.featureCount).toBeGreaterThan(0);
  });
});
