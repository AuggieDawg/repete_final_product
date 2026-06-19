# Repete Auto SEO Launch Checklist

## Code SEO Foundation

- [ ] Root metadata added
- [ ] Canonical URLs configured
- [ ] Open Graph metadata configured
- [ ] Twitter metadata configured
- [ ] robots.ts added
- [ ] sitemap.ts added
- [ ] LocalBusiness JSON-LD added
- [ ] Vehicle JSON-LD added to vehicle detail pages
- [ ] Public pages have page-specific metadata
- [ ] Vehicle-specific form pages are noindex

## Vercel Environment Variables

Before launch:

Preview:
- `NEXT_PUBLIC_SITE_URL=https://www.repeteauto.com`
- `NEXT_PUBLIC_INDEXING_ENABLED=false`

Production before domain launch:
- `NEXT_PUBLIC_SITE_URL=https://www.repeteauto.com`
- `NEXT_PUBLIC_INDEXING_ENABLED=false`

Production after final domain launch:
- `NEXT_PUBLIC_SITE_URL=https://www.repeteauto.com`
- `NEXT_PUBLIC_INDEXING_ENABLED=true`

## Before Connecting GoDaddy Domain

- [ ] Final payment received
- [ ] Pete approves final version
- [ ] Production deployment works
- [ ] Live inventory works
- [ ] Form iframes load
- [ ] Mobile UX checked on real phone
- [ ] Tablet checked
- [ ] Desktop checked

## After GoDaddy Domain Launch

- [ ] Confirm https://www.repeteauto.com loads
- [ ] Confirm root/apex redirects or resolves correctly
- [ ] Confirm /inventory loads
- [ ] Confirm vehicle detail pages load
- [ ] Confirm /sitemap.xml loads
- [ ] Confirm /robots.txt allows indexing
- [ ] Set `NEXT_PUBLIC_INDEXING_ENABLED=true` in Production
- [ ] Redeploy Production
- [ ] Submit sitemap in Google Search Console
- [ ] Update Google Business Profile website URL
- [ ] Check Google Business Profile phone/address/hours
- [ ] Capture screenshots for case study

## Search Console

After domain launch:

- Add property for `https://www.repeteauto.com`
- Verify ownership
- Submit `/sitemap.xml`
- Check indexing status after Google processes the sitemap
- Monitor pages, queries, and crawl issues

## Target Local Search Themes

- Repete Auto
- Used cars Vernal Utah
- Used trucks Vernal Utah
- Used SUVs Vernal Utah
- Used car dealership Vernal
- Uintah Basin used vehicles
- Sell or trade vehicle Vernal
