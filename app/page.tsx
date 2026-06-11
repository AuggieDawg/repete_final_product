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
    title: "Built for Local Roads",
    text: "Shop used cars, trucks, SUVs, and work-ready vehicles selected for Vernal drivers, Uintah Basin roads, and everyday needs.",
    icon: Sparkles
  },
  {
    title: "Current Vehicle Details",
    text: "Browse pricing, mileage, photos, stock numbers, and key details before calling or visiting the lot.",
    icon: CarFront
  },
  {
    title: "Simple Next Steps",
    text: "View inventory, schedule a test drive, ask about a vehicle, or contact the dealership without digging through a cluttered site.",
    icon: BadgeCheck
  },
  {
    title: "Sell or Trade",
    text: "Have a vehicle to sell or trade? Send Repete Auto the details and the team can review the opportunity.",
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
              Shop used cars, trucks, SUVs, and work-ready vehicles selected for Vernal,
              the Uintah Basin, and drivers who need something dependable for real roads,
              real weather, and real life.
            </p>

            <div className="heroActions">
              <Link className="buttonPrimary" href="/inventory">
                View Inventory <ArrowRight size={16} />
              </Link>

              <Link className="buttonGhost" href="/schedule-test-drive">
                Schedule Test Drive
              </Link>

              <Link className="buttonGhost" href="/vehicle-finder">
                Vehicle Finder
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

          <div className="heroPanelCard availabilityPanel">
            <div className="heroPanelTop">
              <span>Before You Drive In</span>
              <span className="liveDot">Call Ahead</span>
            </div>

            <div className="availabilityPanelBody">
              <p>Inventory moves quickly</p>
              <h2>Call Repete Auto to confirm availability before making the trip.</h2>
              <span>
                Ask about current vehicles, test drive timing, trade-in questions, and the best next step before heading to the lot.
              </span>
            </div>

            <div className="availabilityPanelActions">
              <a className="buttonPrimary fullWidth" href={siteConfig.phoneHref}>
                Call {siteConfig.phoneDisplay}
              </a>

              <Link className="buttonGhost fullWidth" href="/schedule-test-drive">
                Schedule Test Drive
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sectionBlock inventoryPreviewSection" id="inventory">
        <div className="shell sectionHeaderBlock">
          <div>
            <p className="eyebrow">Current Inventory</p>
            <h2>Shop current vehicles</h2>
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
            <p className="eyebrow">Why Shop Here</p>
            <h2>A simpler way to find your next vehicle.</h2>
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
            <p className="eyebrow">Sell or Trade</p>
            <h2>Have a vehicle to sell or trade?</h2>
            <p>
              Repete Auto can review cars, trucks, SUVs, and work vehicles. Send the details,
              ask about trade options, or call the dealership before stopping by.
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
              Call, visit the lot, schedule a test drive, or use the vehicle finder to help locate the right fit.
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
            <p className="eyebrow">Start Here</p>
            <h2>Choose your next step</h2>

            <div className="actionStack">
              <Link className="buttonPrimary fullWidth" href="/inventory">Browse Inventory</Link>
              <Link className="buttonGhost fullWidth" href="/schedule-test-drive">Schedule Test Drive</Link>
              <Link className="buttonGhost fullWidth" href="/vehicle-finder">Vehicle Finder</Link>
              <Link className="buttonGhost fullWidth" href="/sell-us-your-car">Sell or Trade</Link>
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
