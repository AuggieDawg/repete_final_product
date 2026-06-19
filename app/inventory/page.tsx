import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { getInventorySnapshot } from "@/lib/inventory/get-inventory";

export const metadata: Metadata = {
  title: "Used Cars, Trucks & SUVs in Vernal, Utah",
  description:
    "Browse Repete Auto's current used cars, trucks, SUVs, and work-ready vehicles in Vernal, Utah. Call to confirm availability before making the trip.",
  alternates: {
    canonical: "/inventory"
  }
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

      <section className="inventoryPageHeroCompact">
        <div className="shell inventoryHeroCompactShell">
          <div className="inventoryHeroCompactCopy">
            <p className="eyebrow">Current Used Vehicle Inventory</p>
            <h1>Used Cars, Trucks & SUVs in Vernal</h1>
            <p>
              Browse current used cars, trucks, SUVs, and work-ready vehicles at Repete Auto.
              Inventory can move quickly, so call to confirm availability before making the trip.
            </p>
          </div>

          <div className="inventoryAvailabilityNote">
            <strong>Call Repete Auto to confirm availability before making the trip.</strong>
            <span>
              Current inventory can move quickly. Call ahead, schedule a test drive, or use Vehicle Finder if you are searching for something specific.
            </span>
          </div>
        </div>
      </section>

      <section className="inventoryFocusSection">
        <div className="inventoryFocusShell">
          <div className="inventoryFilterRow">
            <form className="filterRow" action="/inventory" method="get">
              <label>
                Search inventory
                <input
                  name="q"
                  placeholder="Search trucks, SUVs, make, model, stock, VIN..."
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
            <div className="inventoryGridPremium inventoryGridShowcase">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="noticeCard">
              <h2>No matching vehicles found.</h2>
              <p>Try another search, use Vehicle Finder, or call Repete Auto for help finding the right vehicle.</p>
              <div className="heroActions">
                <Link className="buttonPrimary" href="/inventory">
                  View All Inventory
                </Link>
                <Link className="buttonGhost" href="/vehicle-finder">
                  Vehicle Finder
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
