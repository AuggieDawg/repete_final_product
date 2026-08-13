/**
 * Analytics is deliberately opt-in in every environment.
 *
 * Keep this check strict so an unset value, `false`, or a typo cannot start
 * sending traffic or performance data during an ownership handoff.
 */
export function isAnalyticsEnabled(
  value = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED
) {
  return value === "true";
}
