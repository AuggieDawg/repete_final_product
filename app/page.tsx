import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { getInventorySnapshot } from "@/lib/inventory/get-inventory";
import { siteConfig } from "@/lib/site/site";

const trustItems = [
  {
    title: "Community Driven",
    text: "A local dealership experience built around repeat relationships, straight answers, and vehicles that make sense for the Uintah Basin.",
    icon: Sparkles
  },
  {
    title: "AutoManager Powered",
    text: "Inventory remains controlled through AutoManager while this custom website presents the vehicles in a premium customer-facing experience.",
    icon: CarFront
  },
  {
    title: "Straightforward Contact",
    text: "Fast paths for calls, directions, test drive requests, financing questions, and inventory interest without burying the customer.",
    icon: BadgeCheck
  },
  {
    title: "Built to Expand",
    text: "This launch can grow into richer SEO pages, lead routing, vehicle finder workflows, analytics, and conversion improvements.",
    icon: ShieldCheck
  }
];

export default async function Home() {
  const snapshot = await getInventorySnapshot();
  const previewVehicles = snapshot.vehicles.slice(0, 3);

  return (
    <main>
      <SiteNav />

      <section className="heroSection heroHomeSection" id="top">
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
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />
        <div className="heroLine heroLineOne" />
        <div className="heroLine heroLineTwo" />

        <div className="shell heroShell">
          <div className="heroCopy">
            <p className="eyebrow">Vernal, Utah · Used cars, trucks, SUVs</p>

            <h1 className="heroTitle">
              Built for
              <br />
              <span>This Land.</span>
            </h1>

            <p className="heroText">
              Trucks, SUVs, work rigs, and reliable daily drivers chosen for Vernal, the Uintah Basin,
              and the people who need vehicles that are ready to move.
            </p>

            <div className="heroActions">
              <Link className="buttonPrimary" href="/inventory">
                View Inventory <ArrowRight size={16} />
              </Link>

              <Link className="buttonGhost" href="/sell-us-your-car">
                Sell Us Your Car
              </Link>
            </div>

            <div className="heroFacts" aria-label="Dealership highlights">
              <div>
                <strong>{siteConfig.phoneDisplay}</strong>
                <span>Main phone</span>
              </div>
              <div>
                <strong>{siteConfig.addressLine1}</strong>
                <span>Vernal, UT</span>
              </div>
              <div>
                <strong>AutoManager</strong>
                <span>Inventory feed</span>
              </div>
            </div>
          </div>

          <div className="heroPanelCard">
            <div className="heroPanelTop">
              <span>Inventory Status</span>
              <span className="liveDot">{snapshot.source === "automanager-xml" ? "Live Feed" : "Fixture Mode"}</span>
            </div>

            <div className="vehicleSilhouette">
              <div className="vehicleCab" />
              <div className="vehicleBed" />
              <div className="wheel wheelOne" />
              <div className="wheel wheelTwo" />
            </div>

            <div>
              <p>Current build</p>
              <h2>{snapshot.vehicleCount} vehicles loaded</h2>
              <span>
                Inventory display is powered by a cached AutoManager XML feed and designed to preserve the existing DeskManager/WebManager workflow.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="sectionBlock inventoryPreviewSection" id="inventory">
        <div className="shell sectionHeaderBlock">
          <div>
            <p className="eyebrow">Current Inventory</p>
            <h2>Inventory preview</h2>
          </div>

          <Link className="textLink" href="/inventory">
            Open inventory <ArrowRight size={16} />
          </Link>
        </div>

        {previewVehicles.length > 0 ? (
          <div className="shell inventoryGridPremium">
            {previewVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="noticeCard">
            <h2>Inventory preview is loading.</h2>
            <p>Call Repete Auto for current availability.</p>
          </div>
        )}
      </section>

      <section className="whySection" id="why">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">The Pitch</p>
            <h2>A better site should make the phone ring.</h2>
          </div>
        </div>

        <div className="whyGrid">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <article className="whyCard" key={item.title}>
                <Icon size={24} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="finderSection">
        <div className="finderCard">
          <div>
            <p className="eyebrow">Sell Us Your Car</p>
            <h2>Have a vehicle to sell or trade?</h2>
            <p>
              Repete Auto can review cars, trucks, SUVs, and work vehicles. This launch keeps the process simple:
              customers contact Repete directly while inventory remains controlled by AutoManager.
            </p>
          </div>

          <div className="finderForm">
            <Link className="buttonPrimary fullWidth" href="/sell-us-your-car">
              Start Sell Us Your Car Request
            </Link>

            <a className="buttonGhost fullWidth" href={siteConfig.phoneHref}>
              Call {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="contactSection" id="contact">
        <div className="contactGrid">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Repete Auto</h2>

            <p className="contactLead">
              Call, visit the lot, or use this site to find the vehicle that fits your work, family, and road needs.
            </p>

            <div className="contactRows">
              <a href={siteConfig.phoneHref} className="contactRow">
                <Phone size={20} />
                <span>
                  <small>Phone</small>
                  {siteConfig.phoneDisplay}
                </span>
              </a>

              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="contactRow"
              >
                <MapPin size={20} />
                <span>
                  <small>Address</small>
                  {siteConfig.addressLine1}, {siteConfig.cityStateZip}
                </span>
              </a>
            </div>
          </div>

          <div className="detailCard">
            <p className="eyebrow">Primary Actions</p>
            <h2>What customers can do</h2>

            <div className="actionStack">
              <Link className="buttonPrimary fullWidth" href="/inventory">Browse Inventory</Link>
              <Link className="buttonGhost fullWidth" href="/sell-us-your-car">Sell Us Your Car</Link>
              <Link className="buttonGhost fullWidth" href="/contact">Contact Us</Link>
              <Link className="buttonGhost fullWidth" href="/location">Location</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
