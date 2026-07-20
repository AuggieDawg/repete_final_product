import type { Metadata } from "next";
import Link from "next/link";
import { LeadConfirmationAnalytics } from "@/components/analytics/LeadConfirmationAnalytics";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import { siteConfig } from "@/lib/site/site";

export const metadata: Metadata = {
  title: "Test Drive Request Received",
  description: "Confirmation that Repete Auto received a test-drive request.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ScheduleTestDriveThankYouPage() {
  return (
    <main className="webmanagerPage">
      <SiteNav />
      <LeadConfirmationAnalytics />

      <section className="webmanagerHero">
        <div className="heroOverlay" />
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />

        <div className="shell webmanagerHeroShell">
          <div className="webmanagerHeroCopy">
            <p className="eyebrow">Request Received</p>
            <h1>Thank you.</h1>
            <p>
              Your test-drive request was submitted. A Repete Auto team member will
              follow up to confirm the vehicle and appointment time.
            </p>
          </div>

          <div className="webmanagerHeroActions">
            <a className="buttonPrimary" href={siteConfig.phoneHref}>
              Call {siteConfig.phoneDisplay}
            </a>
            <a className="buttonGhost" href={siteConfig.textHref}>
              Text {siteConfig.textDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="shell">
          <div className="detailCard">
            <h2>Keep shopping while we follow up</h2>
            <p>
              Inventory can change quickly. You can return to the current inventory or
              contact the dealership if you need an immediate answer.
            </p>
            <div className="heroActions">
              <Link className="buttonPrimary" href="/inventory">
                View Inventory
              </Link>
              <Link className="buttonGhost" href="/contact">
                Contact Repete Auto
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
