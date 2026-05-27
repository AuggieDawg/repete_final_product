import type { Metadata } from "next";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { siteConfig } from "@/lib/site/site";

export const metadata: Metadata = {
  title: "Contact Repete Auto | Used Cars & Trucks in Vernal, Utah",
  description:
    "Contact Repete Auto in Vernal, Utah for current inventory, vehicle availability, trade-in questions, and dealership information."
};

export default function ContactPage() {
  return (
    <main>
      <SiteNav />

      <section className="pageHero">
        <p className="eyebrow">Contact Repete Auto</p>
        <h1>Talk to the lot.</h1>
        <p>
          Call Repete Auto for current vehicle availability, test drive questions,
          trade-in interest, financing questions, and dealership information.
        </p>
      </section>

      <section className="contactPageSection sectionBlock">
        <div className="shell contactPageGrid">
          <div className="contactInfoStack">
            <article className="contactInfoCard">
              <Phone size={24} />
              <div>
                <small>Phone</small>
                <strong>{siteConfig.phoneDisplay}</strong>
                <p>Best for immediate inventory, pricing, and availability questions.</p>
              </div>
            </article>

            <article className="contactInfoCard">
              <MapPin size={24} />
              <div>
                <small>Location</small>
                <strong>{siteConfig.addressLine1}</strong>
                <p>{siteConfig.cityStateZip}</p>
              </div>
            </article>

            <article className="contactInfoCard">
              <Mail size={24} />
              <div>
                <small>Email</small>
                <strong>{siteConfig.email}</strong>
                <p>Use email for general questions or follow-up details.</p>
              </div>
            </article>

            <article className="contactInfoCard">
              <ShieldCheck size={24} />
              <div>
                <small>Lead Routing</small>
                <strong>Connected to the dealership workflow</strong>
                <p>
                  Online form routing is being aligned with Repete Auto&apos;s existing
                  dealership system so customer inquiries stay in the normal sales process.
                </p>
              </div>
            </article>
          </div>

          <div className="leadFormCard">
            <p className="eyebrow">Customer Inquiry</p>
            <h2>Need help with a vehicle?</h2>
            <p>
              The online inquiry form is being connected to Repete Auto&apos;s existing
              dealership workflow. For immediate help, call the lot directly.
            </p>

            <form>
              <div className="formRow">
                <label>
                  First name
                  <input placeholder="John" />
                </label>

                <label>
                  Last name
                  <input placeholder="Smith" />
                </label>
              </div>

              <div className="formRow">
                <label>
                  Phone
                  <input placeholder="(435) 555-0000" />
                </label>

                <label>
                  Email
                  <input placeholder="john@email.com" />
                </label>
              </div>

              <label>
                Message
                <textarea placeholder="What vehicle are you interested in?" />
              </label>

              <a className="buttonPrimary fullWidth" href={siteConfig.phoneHref}>
                Call {siteConfig.phoneDisplay}
              </a>

              <p className="formNote">
                Online submission will be activated after AutoManager confirms the supported
                lead-routing method for Repete Auto.
              </p>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
