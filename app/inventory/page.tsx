import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { getInventorySnapshot } from "@/lib/inventory/get-inventory";

type PriceOption = {
  value: string;
  label: string;
  min?: number;
  max?: number;
};

export const metadata: Metadata = {
  title: "Used Cars, Trucks & SUVs in Vernal, Utah",
  description:
    "Browse Repete Auto's current used cars, trucks, SUVs, and work-ready vehicles in Vernal, Utah. Call to confirm availability before making the trip.",
  alternates: {
    canonical: "/inventory"
  }
};

const priceOptions: PriceOption[] = [
  { value: "", label: "Any Price" },
  { value: "under-10000", label: "Under $10,000", max: 10000 },
  { value: "10000-20000", label: "$10,000 – $20,000", min: 10000, max: 20000 },
  { value: "20000-30000", label: "$20,000 – $30,000", min: 20000, max: 30000 },
  { value: "30000-40000", label: "$30,000 – $40,000", min: 30000, max: 40000 },
  { value: "40000-50000", label: "$40,000 – $50,000", min: 40000, max: 50000 },
  { value: "50000-plus", label: "$50,000+", min: 50000 }
];

function getSearchValue(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];

  if (Array.isArray(value)) return value[0] || "";

  return value || "";
}

function vehicleMatchesPrice(price: number | null | undefined, priceOption: PriceOption) {
  if (!priceOption.value) return true;
  if (typeof price !== "number" || !Number.isFinite(price)) return false;
  if (typeof priceOption.min === "number" && price < priceOption.min) return false;
  if (typeof priceOption.max === "number" && price >= priceOption.max) return false;

  return true;
}

export default async function InventoryPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams || {});
  const rawQuery = getSearchValue(resolvedSearchParams, "q").trim();
  const query = rawQuery.toLowerCase();
  const selectedMake = getSearchValue(resolvedSearchParams, "make").trim();
  const requestedPrice = getSearchValue(resolvedSearchParams, "price").trim();
  const selectedPriceOption =
    priceOptions.find((option) => option.value === requestedPrice) || priceOptions[0];
  const snapshot = await getInventorySnapshot();

  const makeOptions = Array.from(
    new Set(
      snapshot.vehicles
        .map((vehicle) => vehicle.make?.trim())
        .filter((make): make is string => Boolean(make))
    )
  ).sort((firstMake, secondMake) => firstMake.localeCompare(secondMake));

  const vehicles = snapshot.vehicles.filter((vehicle) => {
    if (query) {
      const matchesQuery = [
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

      if (!matchesQuery) return false;
    }

    if (selectedMake && vehicle.make?.trim() !== selectedMake) return false;
    if (!vehicleMatchesPrice(vehicle.price, selectedPriceOption)) return false;

    return true;
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
                  defaultValue={rawQuery}
                />
              </label>

              <label>
                Make
                <select name="make" defaultValue={selectedMake}>
                  <option value="">All Makes</option>
                  {makeOptions.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Price
                <select name="price" defaultValue={selectedPriceOption.value}>
                  {priceOptions.map((option) => (
                    <option key={option.value || "any-price"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
              {vehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index < 3} />
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
