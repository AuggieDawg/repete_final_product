"use client";

import { useEffect } from "react";
import { isAnalyticsEnabled } from "@/lib/analytics/enabled";
import { consumeLeadAttempt } from "@/lib/analytics/lead-attempt";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function LeadConfirmationAnalytics() {
  const analyticsEnabled = isAnalyticsEnabled();

  useEffect(() => {
    try {
      const attemptId = consumeLeadAttempt(
        window.sessionStorage,
        "schedule_test_drive"
      );

      if (!attemptId) return;
    } catch {
      // Do not count a lead when a valid form attempt cannot be established.
      return;
    }

    if (!analyticsEnabled) return;

    const eventParams = {
      intent: "schedule_test_drive",
      source: "webmanager_redirect"
    };

    void import("@vercel/analytics")
      .then(({ track }) => track("generate_lead", eventParams))
      .catch(() => {
        // Keep analytics failures from affecting the confirmation page.
      });

    if (!GA_MEASUREMENT_ID) return;

    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function sendGaEvent() {
      if (window.gtag) {
        window.gtag("event", "generate_lead", eventParams);
        return;
      }

      attempts += 1;

      if (attempts < 10) {
        timeoutId = setTimeout(sendGaEvent, 250);
      }
    }

    sendGaEvent();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [analyticsEnabled]);

  return null;
}
