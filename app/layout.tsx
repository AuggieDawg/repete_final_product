import type { Metadata } from "next";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { getBaseUrl, shouldIndexSite } from "@/lib/seo/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "Repete Auto | Used Cars, Trucks & SUVs in Vernal, Utah",
    template: "%s | Repete Auto"
  },
  description:
    "Shop used cars, trucks, SUVs, and work-ready vehicles at Repete Auto in Vernal, Utah. Browse current inventory, schedule a test drive, sell or trade your vehicle, and call to confirm availability before making the trip.",
  keywords: [
    "Repete Auto",
    "used cars Vernal Utah",
    "used trucks Vernal Utah",
    "used SUVs Vernal Utah",
    "used car dealership Vernal",
    "Uintah Basin used vehicles",
    "Vernal car dealership"
  ],
  alternates: {
    canonical: "/"
  },
  robots: shouldIndexSite()
    ? {
        index: true,
        follow: true
      }
    : {
        index: false,
        follow: false,
        nocache: true
      },
  openGraph: {
    title: "Repete Auto | Used Cars, Trucks & SUVs in Vernal, Utah",
    description:
      "Browse current inventory, schedule a test drive, use Vehicle Finder, or sell or trade your vehicle with Repete Auto in Vernal, Utah.",
    url: "/",
    siteName: "Repete Auto",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/repete-logo.png",
        alt: "Repete Auto logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Repete Auto | Used Cars, Trucks & SUVs in Vernal, Utah",
    description:
      "Browse current inventory and contact Repete Auto in Vernal, Utah.",
    images: ["/repete-logo.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LocalBusinessJsonLd />
        {children}
        <SiteAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
