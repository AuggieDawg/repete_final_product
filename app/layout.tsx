import type { Metadata } from "next";
import localFont from "next/font/local";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { getBaseUrl, shouldIndexSite } from "@/lib/seo/site-url";
import "./globals.css";

/**
 * Self-hosted fonts via next/font/local: removes the render-blocking
 * Google Fonts CSS @import chain (stylesheet -> font CSS -> woff2),
 * preloads the woff2 files from our own origin, and keeps builds
 * deterministic (next/font/google downloads from Google at build time
 * and fails the build if Google Fonts is unreachable).
 *
 * Files are the latin subsets from @fontsource/barlow and
 * @fontsource/bebas-neue (SIL Open Font License).
 */
const barlow = localFont({
  src: [
    { path: "./fonts/barlow-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/barlow-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/barlow-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/barlow-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/barlow-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/barlow-latin-700-normal.woff2", weight: "700", style: "normal" }
  ],
  display: "swap",
  variable: "--font-barlow"
});

const bebasNeue = localFont({
  src: [
    { path: "./fonts/bebas-neue-latin-400-normal.woff2", weight: "400", style: "normal" }
  ],
  display: "swap",
  variable: "--font-bebas"
});

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
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Repete Auto - used cars, trucks, and SUVs in Vernal, Utah"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Repete Auto | Used Cars, Trucks & SUVs in Vernal, Utah",
    description:
      "Browse current inventory and contact Repete Auto in Vernal, Utah.",
    images: ["/og-default.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsEnabled =
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";

  return (
    <html lang="en" className={`${barlow.variable} ${bebasNeue.variable}`}>
      <body>
        <LocalBusinessJsonLd />
        {children}
        {analyticsEnabled ? (
          <>
            <SiteAnalytics />
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
