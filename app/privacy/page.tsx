import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { siteConfig } from "@/lib/site/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Repete Auto handles information submitted through this website.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return (
    <main>
      <SiteNav />
      <section className="pageHero policyHero">
        <p className="eyebrow">Website Information</p>
        <h1>Privacy</h1>
        <p>Last updated July 26, 2026</p>
      </section>

      <section className="sectionBlock policySection">
        <div className="shell policyContent">
          <section>
            <h2>Information you choose to provide</h2>
            <p>
              When you use a contact, test-drive, vehicle-finder, financing, or
              sell-or-trade form, the information you enter is submitted through
              Repete Auto&apos;s AutoManager/WebManager services so the dealership can
              respond. Please do not include sensitive financial information in a
              general contact message.
            </p>
          </section>

          <section>
            <h2>Website measurement</h2>
            <p>
              The production website may use Vercel Analytics, Vercel Speed Insights,
              and Google Analytics to understand page use, navigation, and site
              performance. Repete Auto uses this information to improve the website.
              Analytics is disabled on development and preview versions of the site.
            </p>
          </section>

          <section>
            <h2>Calls, texts, maps, and outside services</h2>
            <p>
              Phone, text, map, and embedded dealership-form links may open services
              provided by other companies. Their privacy practices apply when you use
              those services.
            </p>
          </section>

          <section>
            <h2>Questions</h2>
            <p>
              For questions about information submitted to Repete Auto, email{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or call{" "}
              <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>.
            </p>
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
