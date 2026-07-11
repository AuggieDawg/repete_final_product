"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef } from "react";

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

function trackLeadFormEvent(
  eventName: "lead_form_view" | "lead_form_loaded",
  intent: LeadFormIntent,
  context: LeadFormContext
) {
  try {
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

    trackLeadFormEvent("lead_form_view", intent, context);
  }, [intent, context]);

  return (
    <iframe
      title={title}
      src={src}
      className={className}
      style={{ height: iframeHeight }}
      loading="lazy"
      onLoad={() => {
        if (!intent || hasTrackedLoad.current) return;

        hasTrackedLoad.current = true;
        trackLeadFormEvent("lead_form_loaded", intent, context);
      }}
    />
  );
}
