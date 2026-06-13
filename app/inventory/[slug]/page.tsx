import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VehiclePhotoGallery } from "@/components/inventory/VehiclePhotoGallery";
import { getInventorySnapshot } from "@/lib/inventory/get-inventory";
import { siteConfig } from "@/lib/site/site";

function formatPrice(price: number | null | undefined) {
  if (price === null || price === undefined) return "Call for price";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

function formatMileage(mileage?: number) {
  if (!mileage) return "Call for mileage";

  return `${new Intl.NumberFormat("en-US").format(mileage)} miles`;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const snapshot = await getInventorySnapshot();
  const vehicle = snapshot.vehicles.find((item) => item.slug === slug);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found | Repete Auto"
    };
  }

  return {
    title: `${vehicle.title} | Repete Auto`,
    description: `View photos, mileage, price, and key details for this ${vehicle.title} at Repete Auto in Vernal, Utah. Call to confirm availability and test drive options.`
  };
}

export default async function VehicleDetailPage({
  params
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(params);
  const snapshot = await getInventorySnapshot();
  const vehicle = snapshot.vehicles.find((item) => item.slug === slug);

  if (!vehicle) {
    notFound();
  }

  return (
    <main>
      <SiteNav />

      <Link
        className="floatingBackToInventory"
        href="/inventory"
        aria-label="Back to inventory"
        title="Back to Inventory"
      >
        ←
      </Link>

      <section className="vehicleDetailHero">
        <div>
          <p className="eyebrow">{vehicle.stockNumber ? `Stock #${vehicle.stockNumber}` : "Repete Auto Inventory"}</p>
          <h1>{vehicle.title}</h1>
          <p>
            {vehicle.description ||
              "Review photos, mileage, price, and key details. Call Repete Auto to confirm availability before making the trip."}
          </p>

          <div className="heroActions">
            <a className="buttonPrimary" href={siteConfig.phoneHref}>
              Call About This Vehicle
            </a>

            <Link className="buttonGhost" href={`/inventory/${vehicle.slug}/credit-application`}>
              Start Credit Application
            </Link>

            <Link className="buttonGhost" href={`/inventory/${vehicle.slug}/schedule-test-drive`}>
              Schedule Test Drive
            </Link>
          </div>
        </div>

        <VehiclePhotoGallery photos={vehicle.photos} title={vehicle.title} />
      </section>

      <section className="vehicleConversionSection">
        <div className="vehicleConversionGrid">
          <div className="detailCard noDocFeesCard">
            <strong>{siteConfig.noDocFeesLabel}</strong>
            <p>{siteConfig.noDocFeesDescription}</p>
          </div>

          <div className="detailCard vehicleLeadCard">
            <h2>Interested in this vehicle?</h2>
            <p>
              Inventory can change quickly. Call Repete Auto to confirm availability,
              start a credit application, or request a test drive before visiting the lot.
            </p>

            <div className="vehicleActionGrid">
              <a className="buttonPrimary" href={siteConfig.phoneHref}>
                Call {siteConfig.phoneDisplay}
              </a>

              <Link className="buttonGhost" href={`/inventory/${vehicle.slug}/credit-application`}>
                Start Credit Application
              </Link>

              <Link className="buttonGhost" href={`/inventory/${vehicle.slug}/schedule-test-drive`}>
                Schedule Test Drive
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="vehicleDetailGrid">
        <div className="detailCard">
          <h2>Vehicle Details</h2>

          <dl>
            <div><dt>Price</dt><dd>{formatPrice(vehicle.price)}</dd></div>
            <div><dt>Mileage</dt><dd>{formatMileage(vehicle.mileage)}</dd></div>
            <div><dt>VIN</dt><dd>{vehicle.vin || "Call for VIN"}</dd></div>
            <div><dt>Stock</dt><dd>{vehicle.stockNumber || "Call for stock number"}</dd></div>
            <div><dt>Body</dt><dd>{vehicle.bodyStyle || "Call for details"}</dd></div>
            <div><dt>Engine</dt><dd>{vehicle.engine || "Call for details"}</dd></div>
            <div><dt>Transmission</dt><dd>{vehicle.transmission || "Call for details"}</dd></div>
            <div><dt>Drivetrain</dt><dd>{vehicle.drivetrain || "Call for details"}</dd></div>
            <div><dt>Exterior</dt><dd>{vehicle.exteriorColor || "Call for details"}</dd></div>
            <div><dt>Interior</dt><dd>{vehicle.interiorColor || "Call for details"}</dd></div>
          </dl>
        </div>

        <div className="detailCard">
          <h2>Features</h2>

          {vehicle.features.length > 0 ? (
            <ul className="featureList">
              {vehicle.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          ) : (
            <p>Call Repete Auto for the full feature list and current vehicle details.</p>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
