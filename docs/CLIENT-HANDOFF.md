# Repete Auto Client Handoff

This runbook transfers the repository, Vercel project, and operating knowledge to
the client without changing the AutoManager workflow. It intentionally contains
no passwords, tokens, private feed URLs, account recovery data, or billing details.
Keep those items in a client-controlled password manager or another secure record
outside this public repository.

## Ownership boundary

- The Next.js website owns presentation, local SEO, inventory browsing, mobile UX,
  performance, and customer routing.
- AutoManager DeskManager and WebManager remain the systems of record for inventory,
  accepted leads, credit applications, customers, and deals.
- WebManager forms are embedded vendor forms. Do not replace them or store
  credit-sensitive data without a separately approved integration.
- The client should control the GitHub, Vercel, domain-registrar, AutoManager, billing,
  recovery, and multi-factor-authentication accounts after handoff.

## Fixed deployment contract

| Item | Required state |
| --- | --- |
| Production branch | `main` |
| Client-acceptance branch | `staging` |
| Node.js | `22.x`, matching `package.json` and GitHub Actions |
| Production domain | `https://www.repeteauto.com` |
| Production inventory | Live AutoManager XML with `INVENTORY_MODE=live-cached` |
| Preview inventory | Bundled fixture with `INVENTORY_MODE=fixture` unless a live-feed test is scheduled |
| Production indexing | Enabled deliberately |
| Preview indexing | Disabled |
| Analytics after offboarding | Disabled in code configuration and in the Vercel dashboard |

Repete Auto is a commercial website. Vercel states that Hobby is restricted to
non-commercial, personal use. Use a Vercel plan that permits commercial use or move
to another commercial-compatible host; do not label this project as Hobby-compatible.
See [Vercel's Hobby plan](https://vercel.com/docs/plans/hobby) and
[fair-use guidelines](https://vercel.com/docs/limits/fair-use-guidelines).

## Environment-variable inventory

Audit the variables and their Production/Preview scopes after the Vercel transfer.
Do not copy secret values into GitHub, chat, email, screenshots, or this document.
Any variable beginning with `NEXT_PUBLIC_` is exposed to browsers and must never hold
a secret.

| Variable | Production | Preview | Classification |
| --- | --- | --- | --- |
| `AUTOMANAGER_XML_URL` | Existing approved live-feed URL | Omit for routine fixture previews | Server secret |
| `INVENTORY_MODE` | `live-cached` | `fixture` | Server configuration |
| `INVENTORY_STATUS_SECRET` | Rotated handoff value | Separate value or unset | Server secret |
| `DEALER_TIME_ZONE` | `America/Denver` | `America/Denver` | Server configuration |
| `INVENTORY_ALLOW_EMPTY` | `false` unless the lot is intentionally empty | `false` | Server configuration |
| `NEXT_PUBLIC_WEBMANAGER_BASE_URL` | Approved current WebManager base URL | Same approved URL | Public configuration |
| `NEXT_PUBLIC_SITE_URL` | `https://www.repeteauto.com` | `https://www.repeteauto.com` | Public configuration |
| `NEXT_PUBLIC_INDEXING_ENABLED` | `true` | `false` | Public configuration |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `false` | `false` | Public configuration |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Unset while analytics is disabled | Unset | Public configuration |
| `NEXT_PUBLIC_INVENTORY_IMAGE_HOSTS` | Empty unless an additional approved photo host is required | Same policy | Public configuration |

Vercel supplies `VERCEL_ENV`; do not create or override it manually. The complete
non-secret template is in [`.env.example`](../.env.example).

## Final release gate

Do not merge `staging` into `main` until the client explicitly approves the release.
Record the approved staging commit and the current production commit before merging.

### Automated evidence

Run locally with Node 22 and require the same GitHub Actions workflow to pass:

```bash
npm ci
npm test
npm run lint
npm run build
```

The release pull request must show a successful Vercel Preview deployment. A cancelled
workflow or a workflow that never obtained a runner is not passing evidence; rerun it.

### Staging acceptance

- Check the homepage, navigation, inventory, one vehicle detail page, location, and
  all conversion routes on desktop and a real phone.
- Confirm vehicle galleries contain only valid AutoManager photo URLs and responsive
  optimized images load without broken placeholders.
- Confirm routine staging uses fixture inventory so it does not consume the limited
  AutoManager feed allowance.
- Confirm staging returns `noindex` metadata and `/robots.txt` disallows crawling.
- Load every WebManager iframe and verify its call/text fallback. Do not change iframe
  behavior during this release.
- Submit one scheduled test lead only with client and AutoManager approval. Record the
  WebManager acceptance time, DeskManager arrival, and notification arrival.
- Confirm `NEXT_PUBLIC_ANALYTICS_ENABLED=false` produces no Vercel Analytics,
  Speed Insights, GA4, form-event, or lead-confirmation collection requests.
- Verify `/sitemap.xml` contains current vehicle pages and does not retain known sold
  or removed vehicle URLs.

### Production acceptance

Immediately after the approved merge and deployment:

- Confirm both the apex and `www` domain resolve over HTTPS to the approved release.
- Confirm `/inventory` uses the live feed and at least one current vehicle detail route
  loads its gallery, price, and conversion actions.
- Call `/api/inventory-health` with the secret in the `x-inventory-secret` header, not
  in the query string. Confirm live mode, nonzero inventory, and deliberate indexing.
- Confirm production `/robots.txt`, canonical URLs, and `/sitemap.xml` use the final
  domain. Run `npm run verify:prod-indexable` after the deployment.
- Recheck the WebManager form routes and confirm the client is receiving accepted leads.
- Confirm analytics remains absent and the Vercel dashboard products remain disabled.

## Disable analytics before transfer

1. Set `NEXT_PUBLIC_ANALYTICS_ENABLED=false` for both Production and Preview.
2. Remove `NEXT_PUBLIC_GA_MEASUREMENT_ID` from both environments.
3. Redeploy the approved commit so the build contains the disabled configuration.
4. Disable Web Analytics and Speed Insights in the Vercel project dashboard.
5. Open the production site in a clean browser session and confirm no Vercel Analytics,
   Speed Insights, or Google Analytics requests are sent.
6. Recheck the dashboard after transfer; dashboard product settings and billing are
   operational settings, not merely source-code settings.

The analytics packages may remain installed for a future paid engagement. They are
dormant unless `NEXT_PUBLIC_ANALYTICS_ENABLED` is set to the exact value `true` and the
corresponding dashboard products or GA4 stream are deliberately configured.

## GitHub ownership transfer

1. Create or verify a client-controlled GitHub account with MFA and recovery methods.
2. Record the final release pull request, release commit, and last known-good production
   commit in the private handoff record.
3. Transfer this repository to the client-controlled account or organization by
   following [GitHub's repository-transfer procedure](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository).
4. Have the client accept the transfer. Confirm `main` remains the default branch,
   `staging` still exists, Actions is enabled, and branch protections or rulesets still
   match the release policy.
5. Update local Git remotes to the new canonical repository URL even if GitHub's old URL
   redirect continues to work.
6. Keep the former maintainer as a collaborator only if the client explicitly wants
   future paid support. Otherwise remove access after the full handoff is accepted.

Do not delete and recreate the repository. A repository transfer preserves history and
provides a much cleaner chain of ownership.

## Vercel project transfer

Prefer transferring the existing project instead of importing the repository into a
second project. Vercel documents project transfer as a zero-downtime operation. The
source-team owner must also be a member of the destination team. Follow
[Vercel's current project-transfer procedure](https://vercel.com/docs/projects/transferring-projects).

1. Create the destination under a client-controlled email, recovery method, MFA, and
   payment method. Select a plan that permits commercial use.
2. Add the source-team owner to the destination team temporarily if Vercel requires it
   to perform the transfer.
3. Before transfer, capture the current production URL, release commit, domains,
   environment-variable names and scopes, Production Branch setting, Node version,
   Git connection, and last known-good deployment. Do not capture secret values.
4. In the transfer review, verify the destination team and review the listed domains,
   aliases, and environment variables before confirming.
5. After transfer, confirm the Production Branch is `main`, Node is `22.x`, and the
   destination Vercel GitHub app can read the transferred repository.
6. Verify every environment-variable name and scope against the table above. Rotate
   `INVENTORY_STATUS_SECRET`; do not rotate the AutoManager feed URL without vendor
   coordination.
7. Recheck the apex and `www` domains, HTTPS, redirect behavior, Production deployment,
   staging Preview deployment, logs, and analytics dashboard state.
8. Make a harmless documentation commit on `staging` from the client-controlled GitHub
   account. Confirm it produces a Vercel Preview deployment and remains noindex.
9. Do not remove the former maintainer's access, cancel the source plan, or delete any
   source team until the client-controlled account passes every acceptance check.

The Vercel project transfer does not transfer ownership of the domain registration.
Separately confirm that the client controls the registrar account, renewal billing,
recovery methods, and DNS. Record existing DNS before making changes, and never alter
mail-related MX/TXT records merely to move the website.

## Rollback

Before release and transfer, record:

- last known-good Production deployment URL;
- last known-good `main` commit;
- approved release commit;
- person authorized to roll back; and
- the client contact who approves business-impacting changes.

Rollback is justified when the site is broadly unavailable, inventory is materially
wrong, accepted leads stop reaching AutoManager, a privacy/security issue appears, or
the client-approved conversion path is broken.

1. Promote or roll back to the last known-good Vercel Production deployment.
2. Revert the release commit through a pull request; do not force-push `main`.
3. Confirm inventory and lead delivery after rollback.
4. Preserve timestamps and sanitized evidence for AutoManager or Vercel support when
   the failure is vendor-side.

## Private acceptance record

Complete this outside the repository and have the client approve it in writing:

- final repository owner and URL;
- final Vercel team owner, plan, billing owner, and project URL;
- domain registrar owner, renewal status, and recovery method;
- environment-variable names/scopes verified, with secret values stored securely;
- GitHub MFA and Vercel MFA/recovery confirmed;
- final release commit and last known-good commit;
- production and staging URLs tested;
- AutoManager inventory and one approved lead test verified;
- analytics disabled in deployment and dashboard;
- former-maintainer access retained or removed by client choice;
- future work defined as separately authorized support, not an implied subscription; and
- handoff date and client written acceptance.

The handoff is complete only when the client-controlled accounts can deploy, receive
leads, manage billing and recovery, and execute the documented rollback without relying
on the former maintainer's personal accounts.
