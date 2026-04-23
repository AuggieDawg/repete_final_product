export type InventoryVehicle = {
  slug: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  price: string;
  mileage: string;
  drivetrain: string;
  transmission: string;
  bodyStyle: string;
  stock: string;
  status: string;
  accent: string;
  summary: string;
  heroLabel: string;
  category: "Truck" | "SUV" | "Car";
  location: string;
  badge: string;
  imageSrc?: string;
  imageAlt?: string;
};

export const REPETE_CLIENT_ID = "043297";
export const WEBMANAGER_BASE_URL = `https://clients.automanager.com/${REPETE_CLIENT_ID}`;
export const WEBMANAGER_INVENTORY_URL = `${WEBMANAGER_BASE_URL}/view-inventory/`;
export const WEBMANAGER_FRAMED_INVENTORY_URL = `${WEBMANAGER_INVENTORY_URL}?Framed=1`;

export const inventoryCategories = [
  "All",
  "Trucks",
  "SUVs",
  "Cars",
  "4x4",
  "Under $20k",
  "Under $30k",
  "New Arrival"
] as const;

export const inventoryVehicles: InventoryVehicle[] = [
  {
    slug: "2022-ram-1500-sport",
    year: "2022",
    make: "RAM",
    model: "1500",
    trim: "Sport Crew Cab",
    price: "$42,995",
    mileage: "38,412 mi",
    drivetrain: "4WD",
    transmission: "Automatic",
    bodyStyle: "Truck",
    stock: "RPT-221",
    status: "Available",
    accent: "rgba(255, 196, 0, 0.9)",
    summary:
      "Clean, aggressive truck presentation with a premium stance. Built for workdays, trails, and Basin weather.",
    heroLabel: "Featured Truck",
    category: "Truck",
    location: "Repete Auto · Vernal, Utah",
    badge: "4WD",
    imageSrc: "/vehicles/ram-2022.jpeg",
    imageAlt: "2022 RAM 1500 Sport Crew Cab"
  },
  {
    slug: "2021-jeep-grand-cherokee-limited",
    year: "2021",
    make: "Jeep",
    model: "Grand Cherokee",
    trim: "Limited",
    price: "$31,995",
    mileage: "51,283 mi",
    drivetrain: "4WD",
    transmission: "Automatic",
    bodyStyle: "SUV",
    stock: "RPT-314",
    status: "Available",
    accent: "rgba(214, 43, 30, 0.85)",
    summary:
      "Comfortable and upscale SUV presentation with enough rugged character to fit the Uintah Basin buyer.",
    heroLabel: "Featured SUV",
    category: "SUV",
    location: "Repete Auto · Vernal, Utah",
    badge: "Trail Ready"
  },
  {
    slug: "2020-ford-f150-platinum",
    year: "2020",
    make: "Ford",
    model: "F-150",
    trim: "Platinum",
    price: "$39,995",
    mileage: "64,902 mi",
    drivetrain: "4WD",
    transmission: "Automatic",
    bodyStyle: "Truck",
    stock: "RPT-198",
    status: "Available",
    accent: "rgba(147, 112, 219, 0.84)",
    summary:
      "High-trim truck positioned as a premium lot vehicle with towing confidence and polished curb appeal.",
    heroLabel: "Premium Pickup",
    category: "Truck",
    location: "Repete Auto · Vernal, Utah",
    badge: "Tow Ready",
    imageSrc: "/vehicles/ford-f150-2020.jpg",
    imageAlt: "2020 Ford F-150 Platinum"
  },
  {
    slug: "2019-chevrolet-silverado-lt",
    year: "2019",
    make: "Chevrolet",
    model: "Silverado 1500",
    trim: "LT Crew Cab",
    price: "$33,995",
    mileage: "79,118 mi",
    drivetrain: "4WD",
    transmission: "Automatic",
    bodyStyle: "Truck",
    stock: "RPT-176",
    status: "Available",
    accent: "rgba(60, 179, 113, 0.85)",
    summary:
      "Workhorse truck positioned for local buyers who need utility first and still want the lot to feel premium.",
    heroLabel: "Basin Utility",
    category: "Truck",
    location: "Repete Auto · Vernal, Utah",
    badge: "Work Truck"
  },
  {
    slug: "2018-toyota-4runner-sr5",
    year: "2018",
    make: "Toyota",
    model: "4Runner",
    trim: "SR5 Premium",
    price: "$29,995",
    mileage: "96,044 mi",
    drivetrain: "4WD",
    transmission: "Automatic",
    bodyStyle: "SUV",
    stock: "RPT-155",
    status: "Available",
    accent: "rgba(0, 173, 181, 0.84)",
    summary:
      "Strong SUV option for customers who want reliability, winter capability, and a rugged profile.",
    heroLabel: "Adventure SUV",
    category: "SUV",
    location: "Repete Auto · Vernal, Utah",
    badge: "Reliable"
  },
  {
    slug: "2017-dodge-charger-rt",
    year: "2017",
    make: "Dodge",
    model: "Charger",
    trim: "R/T",
    price: "$24,995",
    mileage: "88,730 mi",
    drivetrain: "RWD",
    transmission: "Automatic",
    bodyStyle: "Car",
    stock: "RPT-140",
    status: "Available",
    accent: "rgba(255, 87, 51, 0.9)",
    summary:
      "Muscular sedan option that gives the grid visual energy and broadens the lot beyond trucks and SUVs.",
    heroLabel: "Sport Sedan",
    category: "Car",
    location: "Repete Auto · Vernal, Utah",
    badge: "Performance",
    imageSrc: "/vehicles/dodge-charger-2017.jpg",
    imageAlt: "2017 Dodge Charger R/T"
  }
];

export const featuredVehicles = inventoryVehicles.slice(0, 3);

export function getVehicleBySlug(slug: string) {
  return inventoryVehicles.find((vehicle) => vehicle.slug === slug);
}

export function getRelatedVehicles(
  currentSlug: string,
  category: InventoryVehicle["category"]
) {
  return inventoryVehicles
    .filter(
      (vehicle) =>
        vehicle.slug !== currentSlug && vehicle.category === category
    )
    .slice(0, 3);
}
