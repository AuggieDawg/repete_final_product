import Link from "next/link";
import type { CSSProperties } from "react";
import type { Vehicle } from "@/lib/inventory/types";

const accentPalette = [
  "#ffd200",
  "#f7de68",
  "#d62b1f",
  "#b87333",
  "#f3f0df"
];

function formatPrice(price: Vehicle["price"]) {
  if (price === null || price === undefined) return "Call";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

function formatMileage(mileage?: number) {
  if (!mileage) return "Call";

  return new Intl.NumberFormat("en-US").format(mileage);
}

function getVehicleAccent(vehicle: Vehicle) {
  const seed = `${vehicle.make || ""}${vehicle.model || ""}${vehicle.stockNumber || ""}`;
  const index = seed
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0) % accentPalette.length;

  return accentPalette[index];
}

function getWordmark(vehicle: Vehicle) {
  return (vehicle.make || vehicle.bodyStyle || "Repete").slice(0, 10).toUpperCase();
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const primaryPhoto = vehicle.photos[0];
  const accent = getVehicleAccent(vehicle);

  const style = {
    "--vehicle-accent": accent
  } as CSSProperties;

  return (
    <Link
      href={vehicle.detailUrl}
      className={`inventoryCard ${primaryPhoto ? "inventoryCardPhoto" : ""}`}
      style={style}
    >
      <div className="inventoryMedia">
        {primaryPhoto ? (
          <>
            <div className="inventoryVehicleImageWrap">
              <img
                src={primaryPhoto}
                alt={vehicle.title}
                className="inventoryVehicleImage"
                loading="lazy"
              />
            </div>
            <div className="inventoryImageOverlay" />
          </>
        ) : (
          <>
            <div className="inventoryMediaGlow" />
            <div className="inventoryVisualWordmark">{getWordmark(vehicle)}</div>
          </>
        )}

        <div className="inventoryHoverOverlay" />

        <div className="inventoryInfoReveal">
          <div className="inventoryBadgeRow">
            <span>{vehicle.bodyStyle || vehicle.drivetrain || "Inventory"}</span>
            <strong>{vehicle.stockNumber ? `Stock #${vehicle.stockNumber}` : "Repete Auto"}</strong>
          </div>

          <div className="inventoryTitleTop">
            <p>{vehicle.year || "Used"} {vehicle.make || "Vehicle"}</p>
            <h3>{vehicle.model || vehicle.title}</h3>
            <em>{vehicle.trim || vehicle.engine || "Call for full details"}</em>
          </div>

          {primaryPhoto ? (
            <div className="inventoryVisualWordmark">{getWordmark(vehicle)}</div>
          ) : null}

          <div className="inventoryBottomBar">
            <div>
              <small>Price</small>
              <strong>{formatPrice(vehicle.price)}</strong>
            </div>

            <div>
              <small>Miles</small>
              <span>{formatMileage(vehicle.mileage)}</span>
            </div>

            <div>
              <small>Drive</small>
              <span>{vehicle.drivetrain || "Call"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
