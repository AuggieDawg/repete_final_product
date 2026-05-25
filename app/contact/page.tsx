import type { Metadata } from "next";
import { Phone, MapPin, Clock } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { siteConfig } from "@/lib/site/site";
import { businessHours } from "@/lib/site/business-hours";

export const metadata: Metadata = {
  title: "Contact Repete Auto | Vernal, Utah",
  description:
    "Contact Repete Auto in Vernal, Utah for inventory questions, test drives, financing questions, and vehicle finder requests."
};

export default function ContactPage() {
  return (
    <main>
      <SiteNav />

      <section className="contactSection contactStandalone">
        <div className="contactGrid">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Repete Auto</h2>

            <p className="contactLead">
              Call, visit the lot, or send an inquiry about current inventory, test drives, trade-ins, or vehicle finder requests.
            </p>

            <div className="contactRows">
              <a href={siteConfig.phoneHref} className="contactRow">
                <Phone size={20} />
                <span><small>Phone</small>{siteConfig.phoneDisplay}</span>
              </a>

              <a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer" className="contactRow">
                <MapPin size={20} />
                <span><small>Address</small>{siteConfig.addressLine1}, {siteConfig.cityStateZip}</span>
              </a>

              <div className="contactRow">
                <Clock size={20} />
                <span>
                  <small>Hours</small>
                  {businessHours.map((item) => `${item.day}: ${item.label}`).join(" · ")}
                </span>
              </div>
            </div>
          </div>

          <form className="contactForm">
            <div className="formSplit">
              <label>First name<input placeholder="John" /></label>
              <label>Last name<input placeholder="Smith" /></label>
            </div>

            <div className="formSplit">
              <label>Phone<input placeholder="(435) 555-0000" /></label>
              <label>Email<input placeholder="john@email.com" /></label>
            </div>

            <label>
              Inquiry type
              <select defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Inventory question</option>
                <option>Schedule test drive</option>
                <option>Financing question</option>
                <option>Trade-in question</option>
                <option>Vehicle finder request</option>
              </select>
            </label>

            <label>Message<textarea placeholder="What vehicle are you interested in?" /></label>

            <a
              className="buttonPrimary fullWidth"
              href={`mailto:${siteConfig.email}?subject=Website%20Inquiry%20from%20Repete%20Auto`}
            >
              Send Inquiry
            </a>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
