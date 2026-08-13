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

  it("keeps real photos, removes the injected details page, and upgrades HTTP", () => {
    const snapshot = parseAutoManagerInventoryXml(`
      <Inventory>
        <Vehicle>
          <StockNumber>PHOTO-TEST</StockNumber>
          <Year>2021</Year>
          <Make>Toyota</Make>
          <Model>RAV4</Model>
          <Photos>
            <Photo>https://automanager.blob.core.windows.net/wmphotos/043297/abc/front.jpg</Photo>
            <Photo>http://automanager.blob.core.windows.net/wmphotos/043297/abc/extensionless-key</Photo>
            <Photo>http://www.repeteauto.com/vehicle-details/1966754adc9a4d19be1b17679155c08b</Photo>
            <Photo>https://images.example.com/inventory/rav4-side.webp</Photo>
          </Photos>
        </Vehicle>
      </Inventory>
    `, "fixture");

    expect(snapshot.vehicles[0].photos).toEqual([
      "https://automanager.blob.core.windows.net/wmphotos/043297/abc/front.jpg",
      "https://automanager.blob.core.windows.net/wmphotos/043297/abc/extensionless-key",
      "https://images.example.com/inventory/rav4-side.webp"
    ]);
    expect(snapshot.photoCount).toBe(3);
  });

  it("does not use an overbroad route blacklist for valid image files", () => {
    const snapshot = parseAutoManagerInventoryXml(`
      <Inventory>
        <Vehicle>
          <StockNumber>ROUTE-PHOTO-TEST</StockNumber>
          <Year>2024</Year>
          <Make>Example</Make>
          <Model>Vehicle</Model>
          <Photos>
            <Photo>https://cdn.example.com/inventory/front.jpg</Photo>
            <Photo>https://cdn.example.com/vehicle-details/hero.jpeg</Photo>
            <Photo>https://cdn.example.com/report/condition.avif</Photo>
          </Photos>
        </Vehicle>
      </Inventory>
    `, "fixture");

    expect(snapshot.vehicles[0].photos).toEqual([
      "https://cdn.example.com/inventory/front.jpg",
      "https://cdn.example.com/vehicle-details/hero.jpeg",
      "https://cdn.example.com/report/condition.avif"
    ]);
  });

  it("rejects credentials, non-web schemes, and non-image page URLs", () => {
    const snapshot = parseAutoManagerInventoryXml(`
      <Inventory>
        <Vehicle>
          <StockNumber>UNSAFE-PHOTO-TEST</StockNumber>
          <Year>2024</Year>
          <Make>Example</Make>
          <Model>Vehicle</Model>
          <Photos>
            <Photo>https://user:secret@cdn.example.com/front.jpg</Photo>
            <Photo>ftp://cdn.example.com/front.jpg</Photo>
            <Photo>javascript:alert(1)</Photo>
            <Photo>https://www.repeteauto.com/inventory/vehicle-one</Photo>
            <Photo>https://cdn.example.com/photo-key-without-an-extension</Photo>
          </Photos>
        </Vehicle>
      </Inventory>
    `, "fixture");

    expect(snapshot.vehicles[0].photos).toEqual([]);
    expect(snapshot.warnings).toContain("Vehicle UNSAFE-PHOTO-TEST has no photos.");
  });

  it("accepts extensionless keys only under the exact AutoManager WMPhotos origin", () => {
    const snapshot = parseAutoManagerInventoryXml(`
      <Inventory>
        <Vehicle>
          <StockNumber>WMPHOTOS-TEST</StockNumber>
          <Year>2024</Year>
          <Make>Example</Make>
          <Model>Vehicle</Model>
          <Photos>
            <Photo>https://automanager.blob.core.windows.net/wmphotos/dealer/extensionless-key</Photo>
            <Photo>https://automanager.blob.core.windows.net/wmphotos/</Photo>
            <Photo>https://automanager.blob.core.windows.net/other/extensionless-key</Photo>
            <Photo>https://automanager.blob.core.windows.net.evil.example/wmphotos/dealer/extensionless-key</Photo>
          </Photos>
        </Vehicle>
      </Inventory>
    `, "fixture");

    expect(snapshot.vehicles[0].photos).toEqual([
      "https://automanager.blob.core.windows.net/wmphotos/dealer/extensionless-key"
    ]);
  });

  it("deduplicates photos after protocol and default-port normalization", () => {
    const snapshot = parseAutoManagerInventoryXml(`
      <Inventory>
        <Vehicle>
          <StockNumber>PHOTO-DEDUPE-TEST</StockNumber>
          <Year>2024</Year>
          <Make>Example</Make>
          <Model>Vehicle</Model>
          <Photos>
            <Photo>http://cdn.example.com:80/inventory/front.png</Photo>
            <Photo>https://cdn.example.com/inventory/front.png</Photo>
          </Photos>
        </Vehicle>
      </Inventory>
    `, "fixture");

    expect(snapshot.vehicles[0].photos).toEqual([
      "https://cdn.example.com/inventory/front.png"
    ]);
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
