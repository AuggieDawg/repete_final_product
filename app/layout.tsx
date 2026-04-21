import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repete Auto | Used Cars & Trucks in Vernal, Utah",
  description:
    "Repete Auto is a community-driven used car dealership in Vernal, Utah. Browse inventory, request a vehicle, schedule a test drive, or contact the lot.",
  keywords: [
    "Repete Auto",
    "used cars Vernal Utah",
    "used trucks Vernal UT",
    "car dealership Vernal",
    "Uintah Basin vehicles"
  ],
  openGraph: {
    title: "Repete Auto | Community Driven",
    description:
      "Used cars, trucks, SUVs, and financing support for Vernal and the Uintah Basin.",
    type: "website",
    locale: "en_US"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
