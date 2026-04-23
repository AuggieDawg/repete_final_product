import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  PhoneCall,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { IntroSplash } from "../components/site/IntroSplash";
import { InventoryCard } from "../components/site/InventoryCard";
import { RevealOnScroll } from "../components/site/RevealOnScroll";
import { SiteFooter } from "../components/site/SiteFooter";
import { SiteHeader } from "../components/site/SiteHeader";
import {
  WEBMANAGER_INVENTORY_URL,
  featuredVehicles
} from "../lib/inventory";

const sellingPoints = [
  {
    title: "Premium first impression",
    text: "A cleaner visual presentation built to get more calls, more walk-ins, and stronger trust than a generic dealer template.",
    icon: Sparkles
  },
  {
    title: "Inventory-ready architecture",
    text: "The interface is structured to swap mock inventory for WebManager-fed data without rebuilding the front end.",
    icon: CarFront
  },
  {
    title: "Lead-first dealership UX",
    text: "Vehicle pages, contact routes, and calls to action are organized around financing questions, trade-ins, and test drives.",
    icon: BadgeCheck
  },
  {
    title: "Safer scope for version one",
    text: "Keep AutoManager as the operational backbone now, then add a custom owner portal later if the business wants it.",
    icon: ShieldCheck
  }
];

export default function Home() {
  return (
    <main>
      <IntroSplash />
      <SiteHeader />

      <section className="heroSection heroHomeSection">
        <video
          className="heroVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/repete-logo.png"
        >
          <source src="/videos/repete-hero.mp4" type="video/mp4" />
        </video>

        <div className="heroOverlay" />
        <div className="heroLine heroLineOne" />
        <div className="heroLine heroLineTwo" />

        <div className="shell heroShell">
          <div className="heroCopyBlock">
            <p className="eyebrow">Vernal, Utah · Used cars, SUVs, trucks</p>
            <h1 className="heroTitle">
              Find the right vehicle
              <span> at the right price.</span>
            </h1>
            <p className="heroText">
              This version is built to integrate with Repete Auto&apos;s
              existing workflow while making the front-end vehicle
              presentation cleaner, larger, and more confidence-inspiring.
            </p>

            <div className="heroActions">
              <a href="/inventory" className="buttonPrimary">
                View Premium Inventory Layout <ArrowRight size={16} />
              </a>
              <a href="tel:14357892886" className="buttonGhost">
                Call the Dealership <PhoneCall size={16} />
              </a>
            </div>

            <div className="heroFacts">
              <div>
                <strong>We keep AutoManager</strong>
                <span>for operational backbone</span>
              </div>
              <div>
                <strong>Level 2</strong>
                <span>Integration Target</span>
              </div>
              <div>
                <strong>No Re-entry</strong>
                <span>Keep existing workflow</span>
              </div>
            </div>
          </div>

          <div className="heroPanelCard">
            <div className="heroPanelTop">
              <span>Deployment direction</span>
              <strong>Presentation Layer</strong>
            </div>

            <h2>Keep AutoManager. Improve how the lot feels online.</h2>
            <p>
              The main objective is simple: let Repete Auto keep managing
              vehicles where they already manage them, while this site becomes
              the premium, image-forward front end.
            </p>

            <a
              href={WEBMANAGER_INVENTORY_URL}
              target="_blank"
              rel="noreferrer"
              className="buttonGhost fullWidth"
            >
              Open Current WebManager Inventory
            </a>
          </div>
        </div>
      </section>

      <RevealOnScroll>
        <section className="sectionBlock inventoryPreviewSection">
          <div className="shell">
            <div className="sectionHeaderBlock">
              <div>
                <p className="eyebrow">Featured Inventory</p>
                <h2>Image-first presentation</h2>
              </div>
              <a href="/inventory" className="textLink">
                See full layout <ArrowRight size={16} />
              </a>
            </div>

            <div className="inventoryGridPremium">
              {featuredVehicles.map((vehicle) => (
                <InventoryCard key={vehicle.slug} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={80}>
        <section className="sectionBlock whySection">
          <div className="shell">
            <div className="sectionHeaderBlock narrowHeader">
              <div>
                <p className="eyebrow">Why this build</p>
                <h2>
                  It gives the business a more professional online presence without disrupting current operations.
                </h2>
              </div>
            </div>

            <div className="sellingGrid">
              {sellingPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <article className="sellingCard" key={point.title}>
                    <Icon size={22} />
                    <h3>{point.title}</h3>
                    <p>{point.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={140}>
        <section className="sectionBlock integrationSection">
          <div className="shell integrationShell">
            <div>
              <p className="eyebrow">Implementation path</p>
              <h2>
                Build the shell now. Wire the XML feed the moment AutoManager
                sends it.
              </h2>
              <p>
                The UI is already structured around a normalized vehicle model,
                so the next step is to map the XML feed into these cards and
                vehicle detail pages.
              </p>
            </div>

            <div className="integrationSteps">
              <div>
                <strong>1</strong>
                <span>Premium homepage and inventory layout</span>
              </div>
              <div>
                <strong>2</strong>
                <span>Request XML feed from AutoManager support</span>
              </div>
              <div>
                <strong>3</strong>
                <span>Normalize feed fields into this UI</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Ship with current workflow preserved</span>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <SiteFooter />
    </main>
  );
}
