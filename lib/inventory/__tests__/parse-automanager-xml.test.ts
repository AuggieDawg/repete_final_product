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

  it("parses candidate city, highway, and combined MPG fields", () => {
    const snapshot = parseAutoManagerInventoryXml(`
      <Inventory>
        <Vehicle>
          <StockNumber>SYNTHETIC-MPG</StockNumber>
          <Year>2025</Year>
          <Make>Example</Make>
          <Model>Vehicle</Model>
          <FuelType>Gasoline</FuelType>
          <CityMPG>18 MPG</CityMPG>
          <HighwayMPG>24</HighwayMPG>
          <CombinedMPG>20.5</CombinedMPG>
        </Vehicle>
      </Inventory>
    `, "fixture");

    expect(snapshot.vehicles[0].fuelType).toBe("Gasoline");
    expect(snapshot.vehicles[0].cityMpg).toBe(18);
    expect(snapshot.vehicles[0].highwayMpg).toBe(24);
    expect(snapshot.vehicles[0].combinedMpg).toBe(20.5);
  });

  it("ignores missing, generic, negative, zero, and implausible MPG values", () => {
    const snapshot = parseAutoManagerInventoryXml(`
      <Inventory>
        <Vehicle>
          <StockNumber>MPG-TEST</StockNumber>
          <Year>2025</Year>
          <Make>Example</Make>
          <Model>Vehicle</Model>
          <CityMPG>-5</CityMPG>
          <HighwayMPG>0</HighwayMPG>
          <CombinedMPG>301</CombinedMPG>
          <MPG>25 city / 32 highway</MPG>
          <Features><Feature>Fuel economy display: MPG, range</Feature></Features>
        </Vehicle>
      </Inventory>
    `, "fixture");

    expect(snapshot.vehicles[0].cityMpg).toBeUndefined();
    expect(snapshot.vehicles[0].highwayMpg).toBeUndefined();
    expect(snapshot.vehicles[0].combinedMpg).toBeUndefined();
  });
});
