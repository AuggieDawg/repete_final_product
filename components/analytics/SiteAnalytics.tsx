"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type AnalyticsEvent = {
  name: string;
  params?: Record<string, string | number | boolean>;
};

function sendGaEvent({ name, params = {} }: AnalyticsEvent) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", name, params);
}

function getClickEvent(anchor: HTMLAnchorElement): AnalyticsEvent | null {
  const href = anchor.getAttribute("href") || "";
  const label = anchor.textContent?.replace(/\s+/g, " ").trim() || "unlabeled";

  if (!href) return null;

  if (href.startsWith("tel:")) {
    return {
      name: "call_click",
      params: { label, href }
    };
  }

  if (href.includes("maps.google") || href.includes("google.com/maps")) {
    return {
      name: "directions_click",
      params: { label, href }
    };
  }

  if (href.includes("/credit-application")) {
    return {
      name: "credit_application_click",
      params: { label, href }
    };
  }

  if (href.includes("/schedule-test-drive")) {
    return {
      name: "schedule_test_drive_click",
      params: { label, href }
    };
  }

  if (href.includes("/vehicle-finder")) {
    return {
      name: "vehicle_finder_click",
      params: { label, href }
    };
  }

  if (href.includes("/sell-us-your-car")) {
    return {
      name: "sell_or_trade_click",
      params: { label, href }
    };
  }

  if (href.includes("/contact")) {
    return {
      name: "contact_click",
      params: { label, href }
    };
  }

  if (href === "/inventory" || href.includes("/inventory?")) {
    return {
      name: "inventory_click",
      params: { label, href }
    };
  }

  if (href.startsWith("/inventory/")) {
    return {
      name: "vehicle_detail_click",
      params: { label, href }
    };
  }

  return null;
}

export function SiteAnalytics() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");

      if (!(anchor instanceof HTMLAnchorElement)) return;

      const analyticsEvent = getClickEvent(anchor);

      if (!analyticsEvent) return;

      sendGaEvent(analyticsEvent);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
