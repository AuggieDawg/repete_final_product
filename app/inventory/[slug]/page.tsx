import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Gauge,
  MapPin,
  PhoneCall
} from "lucide-react";

import { InventoryCard } from "../../../components/site/InventoryCard";
import { RevealOnScroll } from "../../../components/site/RevealOnScroll";
import { SiteFooter } from "../../../components/site/SiteFooter";
import { SiteHeader } from "../../../components/site/SiteHeader";
import {
  WEBMANAGER_INVENTORY_URL,
  getRelatedVehicles,
  getVehicleBySlug
} from "../../../lib/inventory";

export default async function VehicleDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = getRelatedVehicles(vehicle.slug, vehicle.category);

  return (
    <main>
      <SiteHeader />

      <section className="pageHero detailHeroSection">
        <div className="shell detailHeroShell">
          <div
            className="detailHeroVisual"
            style={{ ["--vehicle-accent" as string]: vehicle.accent }}
          >
            {vehicle.imageSrc ? (
              <div className="detailHeroImageWrap">
                <Image
                  src={vehicle.imageSrc}
                  alt={
                    vehicle.imageAlt ||
                    `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                  }
                  fill
                  className="detailHeroImage"
                  sizes="(max-width: 1080px) 100vw, 60vw"
                />
              </div>
            ) : (
              <>
                <div className="inventoryMediaGlow" />
                <div className="detailHeroWordmark">{vehicle.make}</div>
              </>
            )}

            <div className="detailHeroBottom">
              <span>{vehicle.heroLabel}</span>
              <strong>{vehicle.badge}</strong>
            </div>
          </div>

          <div className="detailHeroCopy">
            <Link href="/inventory" className="detailBackLink">
              <ArrowLeft size={16} />
              Back to inventory
            </Link>

            <p className="eyebrow">Vehicle Detail Layout</p>
            <h1>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="detailTrim">{vehicle.trim}</p>
            <p className="detailSummary">{vehicle.summary}</p>

            <div className="detailPriceRow">
              <div>
                <small>Price</small>
                <strong>{vehicle.price}</strong>
              </div>
              <div>
                <small>Mileage</small>
                <strong>{vehicle.mileage}</strong>
              </div>
            </div>

            <div className="detailActions">
              <a href="tel:14357892886" className="buttonPrimary">
                Call About This Vehicle <PhoneCall size={16} />
              </a>
              <a
                href={WEBMANAGER_INVENTORY_URL}
                target="_blank"
                rel="noreferrer"
                className="buttonGhost"
              >
                View Current Inventory Source <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <RevealOnScroll>
        <section className="sectionBlock specsSection">
          <div className="shell specsGrid">
            <article className="specCard">
              <Gauge size={20} />
              <small>Mileage</small>
              <strong>{vehicle.mileage}</strong>
            </article>
            <article className="specCard">
              <BadgeCheck size={20} />
              <small>Drivetrain</small>
              <strong>{vehicle.drivetrain}</strong>
            </article>
            <article className="specCard">
              <BadgeCheck size={20} />
              <small>Transmission</small>
              <strong>{vehicle.transmission}</strong>
            </article>
            <article className="specCard">
              <MapPin size={20} />
              <small>Location</small>
              <strong>{vehicle.location}</strong>
            </article>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={90}>
        <section className="sectionBlock detailContentSection">
          <div className="shell detailContentGrid">
            <div className="detailNotesCard">
              <p className="eyebrow">Integration note</p>
              <h2>This page is the target vehicle-detail experience.</h2>
              <p>
                Once inventory is fed from WebManager XML, these fields should
                be populated from live data instead of mock data. The structure
                is already prepared for that swap.
              </p>

              <ul className="detailChecklist">
                <li>Year / make / model / trim</li>
                <li>Price and mileage</li>
                <li>Stock number and status</li>
                <li>Drivetrain and transmission</li>
                <li>Direct lead capture and call-to-action</li>
              </ul>
            </div>

            <div className="detailVehicleMeta">
              <div>
                <small>Body style</small>
                <strong>{vehicle.bodyStyle}</strong>
              </div>
              <div>
                <small>Stock</small>
                <strong>{vehicle.stock}</strong>
              </div>
              <div>
                <small>Status</small>
                <strong>{vehicle.status}</strong>
              </div>
              <div>
                <small>Category</small>
                <strong>{vehicle.category}</strong>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={150}>
        <section className="sectionBlock relatedSection">
          <div className="shell">
            <div className="sectionHeaderBlock narrowHeader">
              <div>
                <p className="eyebrow">Related Vehicles</p>
                <h2>Keep the customer browsing the lot.</h2>
              </div>
            </div>

            <div className="inventoryGridPremium">
              {relatedVehicles.map((relatedVehicle) => (
                <InventoryCard
                  key={relatedVehicle.slug}
                  vehicle={relatedVehicle}
                />
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <SiteFooter />
    </main>
  );
}
