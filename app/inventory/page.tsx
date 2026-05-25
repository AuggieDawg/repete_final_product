import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { getInventorySnapshot } from "@/lib/inventory/get-inventory";

export const metadata: Metadata = {
  title: "Inventory | Repete Auto in Vernal, Utah",
  description:
    "Browse Repete Auto inventory in Vernal, Utah. Trucks, SUVs, cars, and work-ready vehicles powered by AutoManager inventory data."
};

function getSearchValue(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];

  if (Array.isArray(value)) return value[0] || "";

  return value || "";
}

export default async function InventoryPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams || {});
  const query = getSearchValue(resolvedSearchParams, "q").toLowerCase();
  const snapshot = await getInventorySnapshot();

  const vehicles = snapshot.vehicles.filter((vehicle) => {
    if (!query) return true;

    return [
      vehicle.title,
      vehicle.make,
      vehicle.model,
      vehicle.trim,
      vehicle.bodyStyle,
      vehicle.engine,
      vehicle.drivetrain,
      vehicle.stockNumber,
      vehicle.vin
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <main>
      <SiteNav />

      <section className="pageHero">
        <p className="eyebrow">AutoManager Inventory Feed</p>
        <h1>Repete Auto Inventory</h1>
        <p>
          Inventory is displayed from the approved AutoManager XML feed. Call Repete Auto to confirm availability, price, and final details.
        </p>

        <div className="inventoryStatus">
          <span>{snapshot.vehicleCount} vehicles loaded</span>
          <span>Photos: {snapshot.photoCount}</span>
          <span>{snapshot.cachePolicy?.label}</span>
        </div>
      </section>

      <section className="inventorySection inventoryPageSection">
        <div className="inventoryToolbar">
          <form action="/inventory" method="get">
            <label>
              Search inventory
              <input
                name="q"
                placeholder="Search trucks, SUVs, make, model, stock..."
                defaultValue={query}
              />
            </label>

            <button className="buttonPrimary" type="submit">
              Search
            </button>

            <Link className="buttonGhost" href="/inventory">
              Reset
            </Link>
          </form>
        </div>

        {snapshot.errors.length > 0 ? (
          <div className="noticeCard">
            <h2>Inventory is temporarily unavailable.</h2>
            <p>Please call Repete Auto for current availability.</p>
          </div>
        ) : vehicles.length > 0 ? (
          <div className="inventoryGrid">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="noticeCard">
            <h2>No matching vehicles found.</h2>
            <p>Try another search or call Repete Auto for help finding the right vehicle.</p>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
