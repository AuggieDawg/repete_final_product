import fs from "node:fs/promises";
import path from "node:path";
import { parseAutoManagerInventoryXml } from "../lib/inventory/parse-automanager-xml";

const livePath = path.join(process.cwd(), "data/fixtures/automanager-inventory.live.xml");
const samplePath = path.join(process.cwd(), "data/fixtures/automanager-inventory.sample.xml");

async function readFixture() {
  try {
    return {
      xml: await fs.readFile(livePath, "utf8"),
      sourcePath: livePath
    };
  } catch {
    return {
      xml: await fs.readFile(samplePath, "utf8"),
      sourcePath: samplePath
    };
  }
}

async function main() {
  const { xml, sourcePath } = await readFixture();

  const snapshot = parseAutoManagerInventoryXml(
    xml,
    sourcePath.includes(".live.") ? "automanager-xml" : "fixture"
  );

  const outputPath = path.join(
    process.cwd(),
    "data/fixtures/automanager-inventory.normalized.json"
  );

  await fs.writeFile(outputPath, JSON.stringify(snapshot, null, 2), "utf8");

  console.log(`Parsed fixture: ${sourcePath}`);
  console.log(`Vehicles: ${snapshot.vehicleCount}`);
  console.log(`Photos: ${snapshot.photoCount}`);
  console.log(`Features: ${snapshot.featureCount}`);
  console.log(`Warnings: ${snapshot.warnings.length}`);
  console.log(`Errors: ${snapshot.errors.length}`);
  console.log(`Wrote normalized JSON to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
