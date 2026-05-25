import Link from "next/link";
import type { Vehicle } from "@/lib/inventory/types";

function formatPrice(price: Vehicle["price"]) {
  if (price === null || price === undefined) return "Call for price";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

function formatMileage(mileage?: number) {
  if (!mileage) return "Mileage unavailable";

  return `${new Intl.NumberFormat("en-US").format(mileage)} miles`;
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const primaryPhoto = vehicle.photos[0];

  return (
    <article className="vehicleCard">
      <Link href={vehicle.detailUrl} className="vehicleImage vehiclePhotoLink">
        {primaryPhoto ? (
          <img src={primaryPhoto} alt={vehicle.title} loading="lazy" />
        ) : (
          <>
            <span>{vehicle.bodyStyle || "Vehicle"}</span>
            <div className="miniVehicle">
              <div className="miniBody" />
              <div className="miniBed" />
              <div className="miniWheel miniWheelOne" />
              <div className="miniWheel miniWheelTwo" />
            </div>
          </>
        )}
      </Link>

      <div className="vehicleContent">
        <p>{vehicle.stockNumber ? `Stock #${vehicle.stockNumber}` : vehicle.bodyStyle || "Inventory"}</p>
        <h3>
          <Link href={vehicle.detailUrl}>{vehicle.title}</Link>
        </h3>
        <span>
          {[vehicle.drivetrain, vehicle.engine, vehicle.transmission]
            .filter(Boolean)
            .join(" · ") || "Call Repete Auto for full details."}
        </span>

        <div className="vehicleFooter">
          <strong>{formatPrice(vehicle.price)}</strong>
          <em>{formatMileage(vehicle.mileage)}</em>
        </div>
      </div>
    </article>
  );
}
