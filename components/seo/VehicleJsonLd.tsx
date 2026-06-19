import type { Vehicle } from "@/lib/inventory/types";
import { createAbsoluteUrl } from "@/lib/seo/site-url";
import { siteConfig } from "@/lib/site/site";

function formatDescription(vehicle: Vehicle) {
  return (
    vehicle.description ||
    `View details for this ${vehicle.title} at Repete Auto in Vernal, Utah. Call to confirm availability before making the trip.`
  );
}

export function VehicleJsonLd({ vehicle }: { vehicle: Vehicle }) {
  const vehicleUrl = createAbsoluteUrl(`/inventory/${vehicle.slug}`);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Car",
    "@id": `${vehicleUrl}#vehicle`,
    name: vehicle.title,
    url: vehicleUrl,
    description: formatDescription(vehicle),
    image: vehicle.photos,
    brand: vehicle.make
      ? {
          "@type": "Brand",
          name: vehicle.make
        }
      : undefined,
    model: vehicle.model,
    vehicleModelDate: vehicle.year,
    mileageFromOdometer: vehicle.mileage
      ? {
          "@type": "QuantitativeValue",
          value: vehicle.mileage,
          unitCode: "SMI"
        }
      : undefined,
    vehicleIdentificationNumber: vehicle.vin,
    color: vehicle.exteriorColor,
    vehicleEngine: vehicle.engine
      ? {
          "@type": "EngineSpecification",
          name: vehicle.engine
        }
      : undefined,
    seller: {
      "@type": "AutoDealer",
      name: siteConfig.name,
      telephone: siteConfig.phoneDisplay,
      url: createAbsoluteUrl("/")
    }
  };

  if (vehicle.price !== null && vehicle.price !== undefined) {
    jsonLd.offers = {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: vehicleUrl,
      seller: {
        "@type": "AutoDealer",
        name: siteConfig.name
      }
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")
      }}
    />
  );
}
