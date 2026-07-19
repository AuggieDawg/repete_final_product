"use client";

import { track } from "@vercel/analytics";
import Script from "next/script";
import { useEffect } from "react";
import { getDirectContactClick } from "@/lib/analytics/direct-contact-click";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const MAX_PARAM_LENGTH = 120;

type AnalyticsParamValue = string | number | boolean;
type AnalyticsParams = Record<string, AnalyticsParamValue>;

type AnalyticsEvent = {
  name: string;
  gaParams?: AnalyticsParams;
  vercelParams?: AnalyticsParams;
};

function cleanParam(value: string) {
  const cleaned = value.replace(/\s+/g, " ").trim();

  if (!cleaned) return "unknown";

  return cleaned.slice(0, MAX_PARAM_LENGTH);
}

function getInternalPath(href: string) {
  try {
    const parsed = new URL(href, window.location.origin);

    if (parsed.origin !== window.location.origin) return "";

    return parsed.pathname || "/";
  } catch {
    if (href.startsWith("/")) return href.split("?")[0] || "/";

    return "";
  }
}

function getSafeDestination(href: string) {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("sms:")) return "sms";
  if (href.startsWith("mailto:")) return "email";

  try {
    const parsed = new URL(href, window.location.origin);

    if (parsed.href.includes("maps.google") || parsed.href.includes("google.com/maps")) {
      return "google_maps";
    }

    if (parsed.origin === window.location.origin) {
      return parsed.pathname || "/";
    }

    return parsed.hostname.replace(/^www\./, "") || "external";
  } catch {
    return href.split("?")[0] || "unknown";
  }
}

function getPlacement(element: Element) {
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";

  const section = element.closest("section");
  const sectionId = section?.getAttribute("id");

  if (sectionId) return sectionId;

  const sectionClass = section?.getAttribute("class") || "";

  if (sectionClass.includes("vehicleConversion")) return "vehicle_conversion";
  if (sectionClass.includes("vehicleDetail")) return "vehicle_detail";
  if (sectionClass.includes("webmanagerHero")) return "lead_form_hero";
  if (sectionClass.includes("webmanagerForm")) return "lead_form";
  if (sectionClass.includes("inventory")) return "inventory";
  if (sectionClass.includes("contact")) return "contact";
  if (sectionClass.includes("hero")) return "hero";

  return "body";
}

function buildEvent(
  name: string,
  element: Element,
  gaParams: AnalyticsParams = {},
  vercelParams: AnalyticsParams = {}
): AnalyticsEvent {
  const placement = cleanParam(getPlacement(element));

  return {
    name,
    gaParams: {
      placement,
      ...gaParams
    },
    vercelParams: {
      placement,
      ...vercelParams
    }
  };
}

function getClickEvent(anchor: HTMLAnchorElement): AnalyticsEvent | null {
  const href = anchor.getAttribute("href") || "";

  if (!href) return null;

  const directContactClick = getDirectContactClick(href);

  if (directContactClick) {
    const { name, destination } = directContactClick;

    return buildEvent(name, anchor, { destination }, { destination });
  }

  const label = cleanParam(anchor.textContent || "unlabeled");
  const destination = cleanParam(getSafeDestination(href));
  const path = getInternalPath(href);
  const isMapsLink = href.includes("maps.google") || href.includes("google.com/maps");
  const gaParams = {
    label,
    destination
  };

  if (isMapsLink) {
    return buildEvent("directions_click", anchor, gaParams, { destination });
  }

  if (path.includes("/credit-application")) {
    return buildEvent("credit_application_click", anchor, gaParams, { destination });
  }

  if (path.includes("/schedule-test-drive")) {
    return buildEvent("schedule_test_drive_click", anchor, gaParams, { destination });
  }

  if (path.includes("/vehicle-finder")) {
    return buildEvent("vehicle_finder_click", anchor, gaParams, { destination });
  }

  if (path.includes("/sell-us-your-car")) {
    return buildEvent("sell_or_trade_click", anchor, gaParams, { destination });
  }

  if (path.includes("/contact")) {
    return buildEvent("contact_click", anchor, gaParams, { destination });
  }

  if (path === "/inventory") {
    return buildEvent("inventory_click", anchor, gaParams, { destination });
  }

  if (path.startsWith("/inventory/")) {
    return buildEvent("vehicle_detail_click", anchor, gaParams, { destination });
  }

  return null;
}

function getSubmitEvent(form: HTMLFormElement): AnalyticsEvent | null {
  const action = form.getAttribute("action") || "";
  const path = getInternalPath(action);

  if (path !== "/inventory") return null;

  const formData = new FormData(form);
  const filters = [
    String(formData.get("q") || "").trim() ? "query" : "",
    String(formData.get("make") || "").trim() ? "make" : "",
    String(formData.get("price") || "").trim() ? "price" : ""
  ].filter(Boolean);
  const filterSet = filters.join("+") || "none";

  return buildEvent(
    "inventory_search_submit",
    form,
    { filters: filterSet },
    { filters: filterSet }
  );
}

function sendGaEvent({ name, gaParams = {} }: AnalyticsEvent) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", name, gaParams);
}

function sendVercelEvent({ name, vercelParams = {} }: AnalyticsEvent) {
  try {
    track(name, vercelParams);
  } catch {
    // Keep analytics failures from affecting clicks, forms, or navigation.
  }
}

function sendAnalyticsEvent(event: AnalyticsEvent) {
  sendGaEvent(event);
  sendVercelEvent(event);
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

      sendAnalyticsEvent(analyticsEvent);
    }

    function handleSubmit(event: SubmitEvent) {
      const target = event.target;

      if (!(target instanceof HTMLFormElement)) return;

      const analyticsEvent = getSubmitEvent(target);

      if (!analyticsEvent) return;

      sendAnalyticsEvent(analyticsEvent);
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
    };
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
