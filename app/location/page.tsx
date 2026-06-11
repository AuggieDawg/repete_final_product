import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { siteConfig } from "@/lib/site/site";
import { businessHours } from "@/lib/site/business-hours";

export const metadata: Metadata = {
  title: "Location & Hours | Repete Auto in Vernal, Utah",
  description:
    "Visit Repete Auto at 2295 US-40 in Vernal, Utah. View hours, get directions, call the dealership, or schedule a test drive."
};

export default function LocationPage() {
  return (
    <main>
      <SiteNav />

      <section className="pageHero">
        <p className="eyebrow">Location & Hours</p>
        <h1>Visit Repete Auto in Vernal</h1>
        <p>
          Find Repete Auto at {siteConfig.addressLine1}, {siteConfig.cityStateZip}.
          Call ahead to confirm vehicle availability, schedule a test drive, or ask questions before stopping by.
        </p>

        <div className="heroActions">
          <a className="buttonPrimary" href={siteConfig.mapsUrl} target="_blank" rel="noreferrer">
            Get Directions
          </a>

          <a className="buttonGhost" href={siteConfig.phoneHref}>
            Call {siteConfig.phoneDisplay}
          </a>

          <Link className="buttonGhost" href="/schedule-test-drive">
            Schedule Test Drive
          </Link>

          <Link className="buttonGhost" href="/inventory">
            View Inventory
          </Link>
        </div>
      </section>

      <section className="locationSection">
        <div className="detailCard">
          <h2>Hours</h2>

          <dl>
            {businessHours.map((item) => (
              <div key={item.key}>
                <dt>{item.day}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mapCard">
          <iframe
            title="Repete Auto location map"
            src="https://www.google.com/maps?q=2295%20US-40%20Vernal%20UT%2084078&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
