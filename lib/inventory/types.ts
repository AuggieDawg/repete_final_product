export type Vehicle = {
  id: string;
  slug: string;
  detailUrl: string;
  webManagerId?: string;
  webManagerDetailUrl?: string;
  stockNumber?: string;
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  bodyStyle?: string;
  exteriorColor?: string;
  interiorColor?: string;
  mileage?: number;
  price?: number | null;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  description?: string;
  features: string[];
  photos: string[];
  title: string;
};

export type InventorySnapshot = {
  vehicles: Vehicle[];
  source: "fixture" | "automanager-xml";
  fetchedAt: string;
  parsedAt: string;
  vehicleCount: number;
  photoCount: number;
  featureCount: number;
  warnings: string[];
  errors: string[];
  cachePolicy?: {
    mode: string;
    ttlSeconds: number;
    label: string;
  };
};
