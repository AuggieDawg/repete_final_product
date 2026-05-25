import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { siteConfig } from "@/lib/site/site";
import { businessHours } from "@/lib/site/business-hours";

export const metadata: Metadata = {
  title: "Location & Hours | Repete Auto",
  description:
    "Find Repete Auto at 2295 US-40 in Vernal, Utah. View hours, directions, and contact details."
};

export default function LocationPage() {
  return (
    <main>
      <SiteNav />

      <section className="pageHero">
        <p className="eyebrow">Location</p>
        <h1>Visit Repete Auto</h1>
        <p>
          {siteConfig.addressLine1}, {siteConfig.cityStateZip}. Call ahead to confirm inventory availability and test drive timing.
        </p>

        <div className="heroActions">
          <a className="buttonPrimary" href={siteConfig.mapsUrl} target="_blank" rel="noreferrer">
            Get Directions
          </a>

          <a className="buttonGhost" href={siteConfig.phoneHref}>
            Call {siteConfig.phoneDisplay}
          </a>
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
