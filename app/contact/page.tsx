import { Clock3, MapPin, Phone, Send } from "lucide-react";

import { RevealOnScroll } from "../../components/site/RevealOnScroll";
import { SiteFooter } from "../../components/site/SiteFooter";
import { SiteHeader } from "../../components/site/SiteHeader";

export default function ContactPage() {
  return (
    <main>
      <SiteHeader />

      <section className="pageHero contactHeroSection">
        <div className="shell pageHeroShell">
          <div className="pageHeroCopy">
            <p className="eyebrow">Contact</p>
            <h1>Give customers a cleaner path to call, ask, and schedule.</h1>
            <p>
              This page is structured to support test-drive requests,
              financing questions, trade-in conversations, and direct
              dealership contact.
            </p>
          </div>
        </div>
      </section>

      <RevealOnScroll>
        <section className="sectionBlock contactPageSection">
          <div className="shell contactPageGrid">
            <div className="contactInfoStack">
              <article className="contactInfoCard">
                <Phone size={20} />
                <div>
                  <small>Phone</small>
                  <strong>435-789-2886</strong>
                </div>
              </article>
              <article className="contactInfoCard">
                <MapPin size={20} />
                <div>
                  <small>Address</small>
                  <strong>2295 US-40, Vernal, UT 84078</strong>
                </div>
              </article>
              <article className="contactInfoCard">
                <Clock3 size={20} />
                <div>
                  <small>Hours</small>
                  <strong>Mon-Fri 9am-6pm · Sat 10am-2pm</strong>
                </div>
              </article>
            </div>

            <form className="leadFormCard">
              <div className="sectionHeaderBlock compactHeader">
                <div>
                  <p className="eyebrow">Lead Form</p>
                  <h2>Start a conversation.</h2>
                </div>
              </div>

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
                Inquiry type
                <select defaultValue="">
                  <option value="" disabled>
                    Select one
                  </option>
                  <option>Inventory question</option>
                  <option>Schedule test drive</option>
                  <option>Financing question</option>
                  <option>Trade-in question</option>
                  <option>Vehicle finder request</option>
                </select>
              </label>

              <label>
                Message
                <textarea placeholder="Tell Repete Auto what vehicle or question you have..." />
              </label>

              <a
                href="mailto:pete@repeteauto.com?subject=Repete%20Auto%20Website%20Inquiry"
                className="buttonPrimary fullWidth"
              >
                Send Inquiry <Send size={16} />
              </a>
            </form>
          </div>
        </section>
      </RevealOnScroll>

      <SiteFooter />
    </main>
  );
}
