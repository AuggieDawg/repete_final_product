# Repete Auto Analytics Checklist

## Capability and default state

- Vercel Web Analytics is installed but disabled unless explicitly opted in.
- Vercel Speed Insights is installed but disabled unless explicitly opted in.
- GA4-ready event tracking is available through `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Site and WebManager intent events are available when analytics is enabled.

All analytics is strictly opt-in in every environment. Only exact lowercase
`NEXT_PUBLIC_ANALYTICS_ENABLED=true` mounts or sends analytics. An unset value,
`false`, or any other value keeps Vercel Web Analytics, Speed Insights, GA4,
`SiteAnalytics`, WebManager form events, and lead-confirmation events off—even in
Production.

For an analytics-free handoff:

1. Set `NEXT_PUBLIC_ANALYTICS_ENABLED=false` in Vercel Production and Preview, or remove it.
2. Redeploy both environments because `NEXT_PUBLIC_*` values are embedded at build time.
3. Disable Web Analytics and Speed Insights in the Vercel project dashboard so their
   product settings and billing state also match the code.
4. In browser developer tools, confirm no requests load from `googletagmanager.com` or
   the Vercel insights and speed-insights endpoints.

The analytics packages remain installed so the owner can deliberately opt back in.
Disabling analytics does not remove, replace, or alter any AutoManager WebManager iframe.

## Core Page Metrics

Track page views for:

- Homepage
- Inventory
- Vehicle detail pages
- Contact
- Schedule Test Drive
- Vehicle Finder
- Sell or Trade
- Location
- Credit Application pages

## Buyer Intent Events

The site is prepared to track:

- `call_click`
- `sms_click`
- `directions_click`
- `inventory_click`
- `vehicle_detail_click`
- `credit_application_click`
- `schedule_test_drive_click`
- `vehicle_finder_click`
- `sell_or_trade_click`
- `contact_click`
- `lead_form_view`
- `lead_form_loaded`
- `generate_lead` (after a successful WebManager redirect)

## Business Questions

Use analytics to answer:

- How many people visit the site?
- How many visitors are on mobile?
- Which vehicles get the most views?
- Do customers click from inventory to vehicle details?
- Do customers click call, schedule test drive, or credit application?
- Are customers using Vehicle Finder?
- Are customers clicking directions?
- Which pages should be improved first?

## Staging Event Test (only when deliberately opted in)

1. Temporarily set `NEXT_PUBLIC_ANALYTICS_ENABLED=true` for Preview and redeploy.
2. Open the staging deployment with the browser console and Vercel Analytics events visible.
3. Click each call-to-action once and confirm its placement and safe destination.
4. Confirm the home-page and vehicle-detail text buttons create `sms_click` without a phone number or message in the event payload.
5. Open a WebManager form and confirm one `lead_form_view` and one `lead_form_loaded` event.
6. Confirm with AutoManager that the redirect happens only after WebManager accepts a lead, then point Schedule Test Drive to `/thank-you/schedule-test-drive`.
7. Start on the Schedule Test Drive form and complete a test. Confirm the thank-you page creates one `generate_lead` event for that form attempt, with `intent=schedule_test_drive` and `source=webmanager_redirect`.
8. Open the thank-you URL directly and confirm it does not create `generate_lead` without a form-attempt marker.
9. Confirm the same event names in GA4 DebugView when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured.
10. Restore `NEXT_PUBLIC_ANALYTICS_ENABLED=false` (or remove it) and redeploy Preview.

Do not include names, email addresses, phone numbers, VINs, or free-text form content in analytics events.

## Launch Notes

- Do not judge analytics until the real domain is live and traffic has had time to accumulate.
- After launch, connect Google Search Console and submit the sitemap.
- After launch, update Google Business Profile to use the final website URL.
