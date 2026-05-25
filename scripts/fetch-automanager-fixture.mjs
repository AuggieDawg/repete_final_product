import fs from "node:fs/promises";
import path from "node:path";

function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");

  return fs
    .readFile(envPath, "utf8")
    .then((content) => {
      for (const line of content.split("\n")) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#")) continue;

        const [key, ...rest] = trimmed.split("=");

        if (!key || rest.length === 0) continue;

        const value = rest
          .join("=")
          .trim()
          .replace(/^"/, "")
          .replace(/"$/, "");

        process.env[key.trim()] = value;
      }
    })
    .catch(() => {});
}

await loadDotEnvLocal();

const url = process.env.AUTOMANAGER_XML_URL;

if (!url) {
  console.error("AUTOMANAGER_XML_URL is missing. Add it to .env.local first.");
  process.exit(1);
}

console.log("About to fetch the AutoManager XML feed ONCE.");
console.log("This consumes 1 of the daily AutoManager XML requests.");

const response = await fetch(url);

if (!response.ok) {
  console.error(`Fetch failed: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const xml = await response.text();
const outputPath = path.join(process.cwd(), "data/fixtures/automanager-inventory.live.xml");

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, xml, "utf8");

console.log(`Saved live XML fixture to ${outputPath}`);
console.log("This file is gitignored and should not be committed.");
