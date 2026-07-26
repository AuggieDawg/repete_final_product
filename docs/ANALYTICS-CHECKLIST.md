# Repete Auto Analytics Checklist

## Installed

- Vercel Web Analytics
- Vercel Speed Insights
- GA4-ready event tracking through `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Analytics mounts only when `NEXT_PUBLIC_ANALYTICS_ENABLED=true`

Set `NEXT_PUBLIC_ANALYTICS_ENABLED=false` in Development and Preview. Set it
to `true` only in Production so internal testing does not contaminate reports.

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

## Staging Event Test

1. Open the staging deployment with the browser console and Vercel Analytics events visible.
2. Click each call-to-action once and confirm its placement and safe destination.
3. Confirm the home-page and vehicle-detail text buttons create `sms_click` without a phone number or message in the event payload.
4. Open a WebManager form and confirm one `lead_form_view` and one `lead_form_loaded` event.
5. Confirm with AutoManager that the redirect happens only after WebManager accepts a lead, then point Schedule Test Drive to `/thank-you/schedule-test-drive`.
6. Start on the Schedule Test Drive form and complete a test. Confirm the thank-you page creates one `generate_lead` event for that form attempt, with `intent=schedule_test_drive` and `source=webmanager_redirect`.
7. Open the thank-you URL directly and confirm it does not create `generate_lead` without a form-attempt marker.
8. Confirm the same event names in GA4 DebugView when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured.

Do not include names, email addresses, phone numbers, VINs, or free-text form content in analytics events.

## Launch Notes

- Do not judge analytics until the real domain is live and traffic has had time to accumulate.
- After launch, connect Google Search Console and submit the sitemap.
- After launch, update Google Business Profile to use the final website URL.
