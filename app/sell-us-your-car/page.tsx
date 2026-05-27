import type { Metadata } from "next";
import { CarFront, ClipboardCheck, Phone, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { siteConfig } from "@/lib/site/site";

export const metadata: Metadata = {
  title: "Sell Us Your Car | Repete Auto in Vernal, Utah",
  description:
    "Interested in selling or trading your vehicle? Contact Repete Auto in Vernal, Utah to discuss cars, trucks, SUVs, work vehicles, and trade-in options."
};

export default function SellUsYourCarPage() {
  return (
    <main>
      <SiteNav />

      <section className="pageHero">
        <p className="eyebrow">Sell Us Your Car</p>
        <h1>Have a vehicle to sell or trade?</h1>
        <p>
          Repete Auto reviews cars, trucks, SUVs, and work vehicles. Call the lot
          to talk through condition, title status, mileage, payoff details, and
          what you are hoping to get.
        </p>
      </section>

      <section className="contactPageSection sectionBlock">
        <div className="shell contactPageGrid">
          <div className="contactInfoStack">
            <article className="contactInfoCard">
              <CarFront size={24} />
              <div>
                <small>Vehicle Types</small>
                <strong>Cars, trucks, SUVs, and work vehicles</strong>
                <p>Repete Auto can review vehicles that fit local buyer demand.</p>
              </div>
            </article>

            <article className="contactInfoCard">
              <ClipboardCheck size={24} />
              <div>
                <small>Helpful Details</small>
                <strong>Year, make, model, mileage, VIN, and condition</strong>
                <p>More detail helps the dealership evaluate the vehicle faster.</p>
              </div>
            </article>

            <article className="contactInfoCard">
              <ShieldCheck size={24} />
              <div>
                <small>Dealership Workflow</small>
                <strong>Lead handling stays with Repete Auto</strong>
                <p>
                  The online intake flow is being aligned with the existing dealership
                  system so inquiries do not create a separate process.
                </p>
              </div>
            </article>

            <article className="contactInfoCard">
              <Phone size={24} />
              <div>
                <small>Immediate Help</small>
                <strong>{siteConfig.phoneDisplay}</strong>
                <p>Call Repete Auto to start the conversation now.</p>
              </div>
            </article>
          </div>

          <div className="leadFormCard">
            <p className="eyebrow">Vehicle Intake</p>
            <h2>Tell Repete Auto about your vehicle.</h2>
            <p>
              This intake layout is ready for the dealership&apos;s lead-routing method.
              Until AutoManager confirms the supported submission format, call the lot
              directly to discuss your vehicle.
            </p>

            <form>
              <div className="formRow">
                <label>
                  Vehicle year
                  <input placeholder="2020" />
                </label>

                <label>
                  Make
                  <input placeholder="Chevrolet" />
                </label>
              </div>

              <div className="formRow">
                <label>
                  Model
                  <input placeholder="Silverado 1500" />
                </label>

                <label>
                  Mileage
                  <input placeholder="85,000" />
                </label>
              </div>

              <div className="formRow">
                <label>
                  VIN
                  <input placeholder="Optional for now" />
                </label>

                <label>
                  Title / payoff status
                  <input placeholder="Clean title, loan payoff, etc." />
                </label>
              </div>

              <label>
                Notes
                <textarea placeholder="Tell Repete Auto about condition, options, damage, payoff, title status, and what you are hoping to get." />
              </label>

              <a className="buttonPrimary fullWidth" href={siteConfig.phoneHref}>
                Call {siteConfig.phoneDisplay}
              </a>

              <p className="formNote">
                Online submission will be activated after AutoManager confirms the supported
                trade-in or vehicle-acquisition lead method for Repete Auto.
              </p>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
