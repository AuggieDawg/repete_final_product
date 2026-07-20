# Repete Auto Operations

## Ownership boundary

The custom site is the public conversion layer. It owns the shopping experience,
inventory presentation, SEO, performance, accessibility, call/text routing, and web
analytics. AutoManager WebManager and DeskManager remain authoritative for inventory,
submitted leads, credit applications, customers, and deals.

Do not replace a WebManager form or store credit-sensitive data without a separately
approved scope and a documented AutoManager ingestion method.

## Release workflow

1. Synchronize `staging` with `main` before starting work.
2. Create one focused `agent/**`, `feature/**`, or `chore/**` branch.
3. Open a draft PR into `staging`.
4. Keep Preview noindex and use fixture inventory unless a live-feed test is budgeted.
5. Require tests, lint, build, Vercel deployment, mobile QA, and integration evidence.
6. Merge into `staging` for client acceptance.
7. Release with a separate `staging` to `main` PR.
8. Run production smoke tests and retain the last known-good Vercel deployment for rollback.
9. Delete merged feature branches after the stabilization check.

## Inventory operations

The XML allowance is a hard external constraint even though the application currently
implements a cache target rather than a global request counter.

- Open hours: target a 30-minute cache lifetime.
- After hours: target a 6-hour cache lifetime.
- Sunday: target a 12-hour cache lifetime.
- Routine previews: `INVENTORY_MODE=fixture`.
- Live preview tests, manual fixture downloads, cold caches, and multiple deployments can
  consume additional vendor requests.

Monthly inventory verification:

- Check `/api/inventory-health` with the secret supplied outside the URL when supported.
- Confirm vehicle, photo, feature, warning, and error counts.
- Compare a known add, price change, removal, and hidden-vehicle test with WebManager.
- Confirm the exact XML contract before adding or changing visibility and MPG parsing.

## Form reliability standard

The iframe loading and the downstream notification chain are different systems. Measure
them separately.

For each public lead form, record:

1. Custom page load result and mobile usability.
2. Iframe start and load result.
3. WebManager confirmation result.
4. WebManager lead ID and accepted timestamp.
5. DeskManager appearance timestamp when applicable.
6. Pete notification arrival time and raw email headers for delayed messages.

Required fallbacks on every form route:

- Dealership phone link.
- Monitored text link when approved.
- Clear instruction to call if the embedded form does not load.

Never report `lead_form_view` or `lead_form_loaded` as a completed lead. Count
`generate_lead` only after an accepted redirect or first-party database commit that is
verified by the system receiving the lead.

## Monthly funnel report

Use one calendar-month window and compare it with the previous month and the established
baseline. Keep Production selected when using Vercel Analytics so preview testing is not
mixed with customer traffic.

### Data sources

- Vercel Web Analytics: visitors, page views, devices, pages, and custom intent events.
- Vercel Speed Insights: production Core Web Vitals and mobile/desktop performance.
- GA4: acquisition channel, landing page, campaign, and session analysis.
- Google Search Console: organic clicks, impressions, CTR, position, and queries.
- AutoManager: accepted website leads by type and time.
- Pete's sales log: contacts, appointments, shows, sold deals, and optional gross profit.

### Core formulas

Use the same denominator and naming every month.

- Inventory interest rate = `inventory_click / visitors`.
- Vehicle-detail engagement = `vehicle_detail_click / inventory sessions`.
- Call intent rate = `call_click / visitors`.
- Text intent rate = `sms_click / visitors`.
- Form interest rate = `lead_form_view / visitors`.
- Iframe load success rate = `lead_form_loaded / lead_form_view`.
- Verified lead conversion rate = `AutoManager accepted web leads / visitors`.
- Appointment rate = `appointments set / verified leads`.
- Show rate = `appointments showed / appointments set`.
- Close rate = `sold deals / verified leads`.
- Organic CTR = `Search Console clicks / impressions`.

Clicks are intent signals. Do not label them calls, messages, leads, appointments, or
revenue without the corresponding operational record.

### Monthly deliverable

Keep the report concise:

1. Executive result and data-quality statement.
2. Traffic and organic-search trend.
3. Funnel table from visitor through sold outcome.
4. Top vehicle and landing-page interest.
5. Mobile/desktop performance and reliability issues.
6. One to three prioritized recommendations.
7. Experiments completed, result, and next-month action.

## Incident response

If inventory or forms fail:

1. Preserve the production deployment and record the time, route, browser, and screenshot.
2. Check Vercel deployment status and application logs.
3. Check inventory health or the direct WebManager form endpoint as applicable.
4. Confirm whether AutoManager created the lead before diagnosing notification delivery.
5. Roll back to the last known-good Vercel deployment when the custom release caused the failure.
6. Escalate vendor-side failures with timestamps, lead IDs, and sanitized evidence.
