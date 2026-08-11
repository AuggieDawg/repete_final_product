"use client";

import { useEffect, useRef } from "react";
import { isAnalyticsEnabled } from "@/lib/analytics/enabled";
import { markLeadAttempt } from "@/lib/analytics/lead-attempt";

export type LeadFormIntent =
  | "contact"
  | "schedule_test_drive"
  | "vehicle_finder"
  | "sell_or_trade"
  | "credit_application";

export type LeadFormContext = "general" | "vehicle";

type TrackedWebManagerIframeProps = {
  title: string;
  src: string;
  className?: string;
  iframeHeight?: number;
  intent?: LeadFormIntent;
  context?: LeadFormContext;
};

async function trackLeadFormEvent(
  eventName: "lead_form_view" | "lead_form_loaded",
  intent: LeadFormIntent,
  context: LeadFormContext
) {
  if (!isAnalyticsEnabled()) return;

  try {
    const { track } = await import("@vercel/analytics");
    track(eventName, {
      intent,
      context
    });
  } catch {
    // Keep analytics failures from affecting the shopping experience.
  }
}

export function TrackedWebManagerIframe({
  title,
  src,
  className,
  iframeHeight = 1650,
  intent,
  context = "general"
}: TrackedWebManagerIframeProps) {
  const hasTrackedLoad = useRef(false);

  useEffect(() => {
    if (!intent) return;

    if (intent === "schedule_test_drive") {
      try {
        const attemptId = typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

        markLeadAttempt(window.sessionStorage, intent, attemptId);
      } catch {
        // The form still works if browser storage is unavailable.
      }
    }

    void trackLeadFormEvent("lead_form_view", intent, context);
  }, [intent, context]);

  return (
    <iframe
      title={title}
      src={src}
      className={className}
      style={{ height: iframeHeight }}
      loading="eager"
      onLoad={() => {
        if (!intent || hasTrackedLoad.current) return;

        hasTrackedLoad.current = true;
        void trackLeadFormEvent("lead_form_loaded", intent, context);
      }}
    />
  );
}
