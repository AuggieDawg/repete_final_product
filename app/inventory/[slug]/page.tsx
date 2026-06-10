import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
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

  const primaryPhoto = vehicle.photos[0];
  const emailSubject = encodeURIComponent(`Question about ${vehicle.title}`);

  return (
    <main>
      <SiteNav />

      <section className="vehicleDetailHero">
        <div>
          <p className="eyebrow">{vehicle.stockNumber ? `Stock #${vehicle.stockNumber}` : "Repete Auto Inventory"}</p>
          <h1>{vehicle.title}</h1>
          <p>
            {vehicle.description ||
              "Review photos, mileage, price, and key details. Call Repete Auto to confirm availability, ask questions, or schedule a time to see the vehicle in person."}
          </p>

          <div className="heroActions">
            <a className="buttonPrimary" href={siteConfig.phoneHref}>
              Call About This Vehicle
            </a>

            <a className="buttonGhost" href="/schedule-test-drive">
              Schedule Test Drive
            </a>

            <a
              className="buttonGhost"
              href={`mailto:${siteConfig.email}?subject=${emailSubject}`}
            >
              Email Repete Auto
            </a>
          </div>
        </div>

        <div className="vehicleDetailMedia">
          {primaryPhoto ? (
            <img src={primaryPhoto} alt={vehicle.title} />
          ) : (
            <div className="vehiclePlaceholder">Photo coming soon</div>
          )}
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

        <div className="detailCard">
          <h2>Interested in this vehicle?</h2>
          <p>
            Inventory can change quickly. Call Repete Auto to confirm availability, ask about the vehicle,
            or request a test drive before visiting the lot.
          </p>

          <div className="heroActions">
            <a className="buttonPrimary" href={siteConfig.phoneHref}>
              Call {siteConfig.phoneDisplay}
            </a>

            <a className="buttonGhost" href="/schedule-test-drive">
              Schedule Test Drive
            </a>

            <a className="buttonGhost" href="/inventory">
              Back to Inventory
            </a>
          </div>
        </div>
      </section>

      {vehicle.photos.length > 1 ? (
        <section className="photoStrip">
          {vehicle.photos.slice(1, 7).map((photo) => (
            <img key={photo} src={photo} alt={vehicle.title} loading="lazy" />
          ))}
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
}
