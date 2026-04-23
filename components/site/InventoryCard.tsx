import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import type { InventoryVehicle } from "../../lib/inventory";

export function InventoryCard({ vehicle }: { vehicle: InventoryVehicle }) {
  const cardStyle = {
    "--vehicle-accent": vehicle.accent
  } as CSSProperties;

  const cardClassName = vehicle.imageSrc
    ? "inventoryCard inventoryCardPhoto"
    : "inventoryCard";

  return (
    <Link
      href={`/inventory/${vehicle.slug}`}
      className={cardClassName}
      style={cardStyle}
    >
      <div className="inventoryMedia">
        {vehicle.imageSrc ? (
          <div className="inventoryVehicleImageWrap">
            <Image
              src={vehicle.imageSrc}
              alt={
                vehicle.imageAlt ||
                `${vehicle.year} ${vehicle.make} ${vehicle.model}`
              }
              fill
              className="inventoryVehicleImage"
              sizes="(max-width: 900px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="inventoryMediaGlow" />
        )}

        <div className="inventoryHoverOverlay" />

        <div className="inventoryInfoReveal">
          <div className="inventoryBadgeRow">
            <span>{vehicle.badge}</span>
            <strong>{vehicle.status}</strong>
          </div>

          <div className="inventoryTitleTop">
            <p>{vehicle.year}</p>
            <h3>
              {vehicle.make} {vehicle.model}
            </h3>
            <em>{vehicle.trim}</em>
          </div>

          {!vehicle.imageSrc && (
            <div className="inventoryVisualWordmark">{vehicle.make}</div>
          )}

          <div className="inventoryBottomBar">
            <div>
              <small>Price</small>
              <strong>{vehicle.price}</strong>
            </div>

            <div>
              <small>Mileage</small>
              <span>{vehicle.mileage}</span>
            </div>

            <div>
              <small>Drive</small>
              <span>{vehicle.drivetrain}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
