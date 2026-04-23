import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";

import { InventoryCard } from "../../components/site/InventoryCard";
import { RevealOnScroll } from "../../components/site/RevealOnScroll";
import { SiteFooter } from "../../components/site/SiteFooter";
import { SiteHeader } from "../../components/site/SiteHeader";
import {
  WEBMANAGER_FRAMED_INVENTORY_URL,
  WEBMANAGER_INVENTORY_URL,
  inventoryCategories,
  inventoryVehicles
} from "../../lib/inventory";

export default function InventoryPage() {
  return (
    <main>
      <SiteHeader />

      <section className="pageHero inventoryHeroSection">
        <div className="shell pageHeroShell">
          <div className="pageHeroCopy">
            <p className="eyebrow">Inventory</p>
            <h1>
              Premium vehicle presentation for the current Repete Auto
              workflow.
            </h1>
            <p>
              This page is the custom front-end target. AutoManager remains
              the operational backbone; the presentation layer becomes
              image-first, cleaner, and more consistent with a premium local
              dealership brand.
            </p>
          </div>

          <div className="pageHeroAside">
            <div>
              <small>Version objective</small>
              <strong>Level 2 integration</strong>
            </div>
            <div>
              <small>Cards ready</small>
              <strong>{inventoryVehicles.length} demo vehicles</strong>
            </div>
            <div>
              <small>Fallback path</small>
              <strong>Framed WebManager view</strong>
            </div>
          </div>
        </div>
      </section>

      <RevealOnScroll>
        <section className="sectionBlock filterSection">
          <div className="shell">
            <div className="filterRow">
              {inventoryCategories.map((filter) => (
                <button type="button" className="filterChip" key={filter}>
                  {filter}
                </button>
              ))}
            </div>

            <div className="inventoryGridPremium largeGrid">
              {inventoryVehicles.map((vehicle) => (
                <InventoryCard key={vehicle.slug} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <section className="sectionBlock integrationSection mutedSection">
          <div className="shell integrationShell splitIntegration">
            <div>
              <p className="eyebrow">Integration fallback</p>
              <h2>
                Use the custom layout first. Fall back to WebManager if needed.
              </h2>
              <p>
                Once the XML feed is available, this page becomes live
                inventory. Until then, the safest fallback is to route users
                into the current WebManager inventory while keeping the premium
                shell elsewhere.
              </p>
            </div>

            <div className="ctaStack">
              <a
                href={WEBMANAGER_INVENTORY_URL}
                target="_blank"
                rel="noreferrer"
                className="buttonPrimary fullWidth"
              >
                Open Live WebManager Inventory <ExternalLink size={16} />
              </a>
              <a
                href={WEBMANAGER_FRAMED_INVENTORY_URL}
                target="_blank"
                rel="noreferrer"
                className="buttonGhost fullWidth"
              >
                Test Framed Inventory View <ArrowRight size={16} />
              </a>
              <div className="integrationNote">
                <ShieldCheck size={18} />
                <span>
                  Keeps the current desk workflow intact while the front end is
                  upgraded.
                </span>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <SiteFooter />
    </main>
  );
}
