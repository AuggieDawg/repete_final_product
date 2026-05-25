import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { siteConfig } from "@/lib/site/site";

export const metadata: Metadata = {
  title: "Sell Us Your Car | Repete Auto",
  description:
    "Interested in selling or trading your car, truck, or SUV? Contact Repete Auto in Vernal, Utah."
};

export default function SellUsYourCarPage() {
  return (
    <main>
      <SiteNav />

      <section className="pageHero">
        <p className="eyebrow">Sell or Trade</p>
        <h1>Sell Us Your Car</h1>
        <p>
          Have a vehicle you want to sell or trade? Send Repete Auto the details and the team can follow up with next steps.
        </p>
      </section>

      <section className="finderSection">
        <div className="finderCard">
          <div>
            <p className="eyebrow">Vehicle Acquisition</p>
            <h2>Tell Repete what you have.</h2>
            <p>
              For the first launch, this page routes customers directly to Repete Auto without creating a separate lead system.
            </p>
          </div>

          <form className="finderForm">
            <label>Vehicle year<input placeholder="2020" /></label>
            <label>Make<input placeholder="Chevrolet" /></label>
            <label>Model<input placeholder="Silverado 1500" /></label>
            <label>Mileage<input placeholder="85,000" /></label>
            <label>Notes<textarea placeholder="Tell Repete Auto about condition, payoff, title status, and what you are hoping to get." /></label>

            <a
              className="buttonPrimary fullWidth"
              href={`mailto:${siteConfig.email}?subject=Sell%20Us%20Your%20Car%20Request`}
            >
              Send Vehicle Info
            </a>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
