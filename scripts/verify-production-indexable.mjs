/**
 * Post-deploy guard for the indexing kill-switch.
 *
 * shouldIndexSite() requires NEXT_PUBLIC_INDEXING_ENABLED to equal the
 * exact string "true"; any typo or accidental unset in Vercel silently
 * noindexes the entire site. This script fetches the production
 * homepage and fails loudly if the robots meta does not allow indexing.
 *
 * Usage:
 *   npm run verify:prod-indexable
 *   SITE_URL=https://www.repeteauto.com npm run verify:prod-indexable
 *
 * Run it after every production deploy, or wire it into an uptime
 * monitor alongside /api/inventory-health's indexingEnabled field.
 */
const siteUrl = (process.env.SITE_URL || "https://www.repeteauto.com").replace(/\/$/, "");

const response = await fetch(siteUrl, {
  headers: { "user-agent": "repete-indexability-check" }
});

if (!response.ok) {
  console.error(`FAIL: ${siteUrl} responded ${response.status}`);
  process.exit(1);
}

const html = await response.text();
const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
const robotsContent = robotsMatch ? robotsMatch[1].toLowerCase() : "";

if (!robotsMatch) {
  console.error("FAIL: no robots meta tag found on the homepage.");
  process.exit(1);
}

if (robotsContent.includes("noindex")) {
  console.error(`FAIL: homepage robots meta is "${robotsContent}" - the site is noindexed.`);
  console.error("Check NEXT_PUBLIC_INDEXING_ENABLED in Vercel (must be exactly \"true\").");
  process.exit(1);
}

console.log(`OK: ${siteUrl} robots meta is "${robotsContent}".`);
