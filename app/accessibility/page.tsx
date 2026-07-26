import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { siteConfig } from "@/lib/site/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Repete Auto's website accessibility commitment and contact options.",
  alternates: { canonical: "/accessibility" }
};

export default function AccessibilityPage() {
  return (
    <main>
      <SiteNav />
      <section className="pageHero policyHero">
        <p className="eyebrow">Website Assistance</p>
        <h1>Accessibility</h1>
        <p>Last updated July 26, 2026</p>
      </section>

      <section className="sectionBlock policySection">
        <div className="shell policyContent">
          <section>
            <h2>Our commitment</h2>
            <p>
              Repete Auto wants customers to be able to browse vehicles and contact
              the dealership regardless of ability or technology. The site is
              reviewed and improved over time as content, inventory, and third-party
              dealership tools change.
            </p>
          </section>

          <section>
            <h2>Need help using the website?</h2>
            <p>
              If a page, vehicle listing, image, or form is difficult to use, call{" "}
              <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>, text{" "}
              <a href={siteConfig.textHref}>{siteConfig.textDisplay}</a>, or email{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. The
              dealership can provide vehicle information and help through another
              channel.
            </p>
          </section>

          <section>
            <h2>Send feedback</h2>
            <p>
              Please include the page address, what you were trying to do, and the
              device or assistive technology you were using. That detail helps the
              website team investigate and improve the experience.
            </p>
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
