# Repete Auto Website

Production website and measurable sales funnel for Repete Auto in Vernal, Utah.

The custom Next.js site owns presentation, local SEO, inventory browsing, mobile UX,
performance, and optional conversion analytics. AutoManager WebManager and DeskManager
remain the systems of record for inventory, lead forms, credit applications, customers,
and deals.

## Environments and branches

| Branch | Vercel role | Indexing | Purpose |
| --- | --- | --- | --- |
| `main` | Production | Enabled | Code currently served at `repeteauto.com` |
| `staging` | Preview | Disabled | Integrated client acceptance testing |
| `agent/**`, `feature/**`, `chore/**` | Preview | Disabled | One isolated change or cleanup PR |

Normal release flow:

1. Create a focused branch from current `staging`.
2. Open a draft PR into `staging` and use the Vercel preview.
3. Run CI, mobile checks, form checks, analytics checks, and client acceptance.
4. Merge the feature into `staging`.
5. Open a release PR from `staging` into `main`.
6. Merge only after the production checklist and rollback plan are ready.

Do not push experimental changes directly to `main`.

## Local setup

Use the Node.js major version pinned by `package.json` and CI (`22.x`).

```bash
npm ci
npm run dev
```

Before opening a PR:

```bash
npm test
npm run lint
npm run build
```

## Environment variables

Never commit secret values. Configure them separately in Vercel Production and Preview.

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `AUTOMANAGER_XML_URL` | Server secret | Live inventory XML source |
| `INVENTORY_MODE` | Server | `live-cached` in production; use `fixture` for routine previews |
| `INVENTORY_STATUS_SECRET` | Server secret | Protects inventory health details |
| `DEALER_TIME_ZONE` | Server | Dealer-hours cache policy; normally `America/Denver` |
| `INVENTORY_ALLOW_EMPTY` | Server | `true` only when an intentionally empty lot should replace the last good snapshot |
| `NEXT_PUBLIC_WEBMANAGER_BASE_URL` | Public | Approved WebManager form base URL |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public | Optional GA4 web-stream identifier; has no effect while analytics are off |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Public | Strict opt-in for every analytics provider; only exact `true` enables collection |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical production URL |
| `NEXT_PUBLIC_INDEXING_ENABLED` | Public | `true` only in Production |
| `NEXT_PUBLIC_INVENTORY_IMAGE_HOSTS` | Public | Optional comma-separated exact hosts for additional inventory-photo sources |

Preview deployments should normally use fixture inventory so testing does not consume
Repete Auto's daily XML request allowance.

Analytics is off when `NEXT_PUBLIC_ANALYTICS_ENABLED` is unset, `false`, or any value
other than exact lowercase `true`, including in Production. During handoff, keep it
`false` and disable Web Analytics and Speed Insights in the Vercel project dashboard.
The WebManager iframe forms, lead submission, and session-marker cleanup continue to
work when analytics is off.

## Important routes

- `/inventory` and `/inventory/[slug]`: cached XML inventory and vehicle details
- `/contact`, `/schedule-test-drive`, `/vehicle-finder`, `/sell-us-your-car`: WebManager forms
- `/inventory/[slug]/credit-application`: WebManager credit flow
- `/api/inventory-health`: protected inventory diagnostics
- `/robots.txt` and `/sitemap.xml`: environment-aware SEO controls

## Operating documentation

- [Client ownership and deployment handoff](docs/CLIENT-HANDOFF.md)
- [Repository, funnel, and reporting operations](docs/OPERATIONS.md)
- [Analytics verification](docs/ANALYTICS-CHECKLIST.md)
- [SEO and release checks](docs/SEO-LAUNCH-CHECKLIST.md)

When analytics is enabled, the website records conversion intent, but AutoManager records
submitted leads and Pete records appointments and sales. Monthly reporting must reconcile
those sources instead of claiming that a click automatically became a customer.
