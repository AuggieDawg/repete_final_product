import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles
} from "lucide-react";

const featuredVehicles = [
  {
    year: "2022",
    name: "RAM 1500 Sport Crew Cab",
    badge: "4WD",
    detail: "Hemi V8 · Crew cab · Built for work and weekends",
    price: "Call for price",
    mileage: "Availability changes"
  },
  {
    year: "2021",
    name: "Jeep Grand Cherokee",
    badge: "SUV",
    detail: "Comfortable daily driver · Trail-ready confidence",
    price: "Call for price",
    mileage: "Updated by dealer"
  },
  {
    year: "2020",
    name: "Ford F-150 Platinum",
    badge: "Truck",
    detail: "Premium trim · Tow-capable · Basin-ready",
    price: "Call for price",
    mileage: "See current inventory"
  }
];

const trustItems = [
  {
    title: "Community Driven",
    text: "A local dealership experience built around repeat relationships, straight answers, and vehicles that make sense for the Uintah Basin.",
    icon: Sparkles
  },
  {
    title: "Vehicle-Finder Focus",
    text: "If the right car is not on the lot, customers can request what they are looking for and turn the website into a lead engine.",
    icon: CarFront
  },
  {
    title: "Straightforward Contact",
    text: "Fast paths for calls, directions, test drive requests, financing questions, and inventory interest without burying the customer.",
    icon: BadgeCheck
  },
  {
    title: "Built to Expand",
    text: "This launch page can later grow into live inventory, customer intake, admin tools, financing workflows, and analytics.",
    icon: ShieldCheck
  }
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <a href="#top" className="navLogo" aria-label="Repete Auto home">
          <Image
            src="/repete-logo.png"
            alt="Repete Auto logo"
            width={520}
            height={120}
            priority
          />
        </a>

        <div className="navLinks">
          <a href="#inventory">Inventory</a>
          <a href="#why">Why Repete</a>
          <a href="#finder">Vehicle Finder</a>
          <a href="#contact" className="navCta">
            Contact
          </a>
        </div>
      </nav>

      <section className="hero" id="top">
        <video
          className="heroVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/repete-logo.png"
        >
          <source src="/videos/repete-hero.mp4" type="video/mp4" />
        </video>

        <div className="heroBackdrop" />
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />
        <div className="highwayLine highwayLineOne" />
        <div className="highwayLine highwayLineTwo" />

        <div className="heroInner">
          <div className="heroCopy">
            <p className="eyebrow">Vernal, Utah · Used cars, trucks, SUVs</p>

            <h1 className="heroTitle">
              Built for
              <br />
              <span>This Land.</span>
            </h1>

            <p className="heroText">
              Trucks, SUVs, work rigs, and reliable daily drivers chosen for
              Vernal, the Uintah Basin, and the people who need vehicles that
              are ready to move.
            </p>

            <div className="heroActions">
              <a
                className="buttonPrimary"
                href="https://www.repeteauto.com/view-inventory"
                target="_blank"
                rel="noreferrer"
              >
                View Current Inventory <ArrowRight size={16} />
              </a>

              <a className="buttonGhost" href="#contact">
                Schedule a Test Drive
              </a>
            </div>

            <div className="heroFacts" aria-label="Dealership highlights">
              <div>
                <strong>435-789-2886</strong>
                <span>Main phone</span>
              </div>
              <div>
                <strong>2295 US-40</strong>
                <span>Vernal, UT</span>
              </div>
              <div>
                <strong>Mon-Sat</strong>
                <span>Sales hours</span>
              </div>
            </div>
          </div>

          <div className="heroPanel">
            <div className="panelTop">
              <span>Website Preview</span>
              <span className="liveDot">Demo Ready</span>
            </div>

            <div className="vehicleSilhouette">
              <div className="vehicleCab" />
              <div className="vehicleBed" />
              <div className="wheel wheelOne" />
              <div className="wheel wheelTwo" />
            </div>

            <div className="panelCard">
              <p>Next upgrade path</p>
              <h2>Live inventory + lead capture</h2>
              <span>
                Turn browsers into calls, test drives, and financing
                conversations.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="inventorySection" id="inventory">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Current Inventory</p>
            <h2>Featured inventory preview</h2>
          </div>

          <a
            href="https://www.repeteauto.com/view-inventory"
            target="_blank"
            rel="noreferrer"
          >
            Open live inventory <ArrowRight size={16} />
          </a>
        </div>

        <div className="inventoryGrid">
          {featuredVehicles.map((vehicle) => (
            <article className="vehicleCard" key={vehicle.name}>
              <div className="vehicleImage">
                <span>{vehicle.badge}</span>

                <div className="miniVehicle">
                  <div className="miniBody" />
                  <div className="miniBed" />
                  <div className="miniWheel miniWheelOne" />
                  <div className="miniWheel miniWheelTwo" />
                </div>
              </div>

              <div className="vehicleContent">
                <p>{vehicle.year}</p>
                <h3>{vehicle.name}</h3>
                <span>{vehicle.detail}</span>

                <div className="vehicleFooter">
                  <strong>{vehicle.price}</strong>
                  <em>{vehicle.mileage}</em>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="whySection" id="why">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">The Pitch</p>
            <h2>A better site should make the phone ring.</h2>
          </div>
        </div>

        <div className="whyGrid">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <article className="whyCard" key={item.title}>
                <Icon size={24} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="finderSection" id="finder">
        <div className="finderCard">
          <div>
            <p className="eyebrow">Vehicle Finder</p>
            <h2>Looking for something specific?</h2>
            <p>
              A customer should not leave the site just because the exact
              vehicle is not listed. This section can become an intake form for
              make, model, budget, trade-in details, financing needs, and
              preferred contact time.
            </p>
          </div>

          <form className="finderForm">
            <label>
              Vehicle type
              <select defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                <option>Truck</option>
                <option>SUV</option>
                <option>Car</option>
                <option>Van</option>
                <option>Commercial / work vehicle</option>
              </select>
            </label>

            <label>
              Budget range
              <input placeholder="$15,000 - $35,000" />
            </label>

            <label>
              Notes
              <textarea placeholder="Tell Repete Auto what you are looking for..." />
            </label>

            <a className="buttonPrimary fullWidth" href="tel:14357892886">
              Call Repete Auto
            </a>
          </form>
        </div>
      </section>

      <section className="contactSection" id="contact">
        <div className="contactGrid">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Repete Auto</h2>

            <p className="contactLead">
              Call, visit the lot, or use this page as the starting point for a
              better customer acquisition system.
            </p>

            <div className="contactRows">
              <a href="tel:14357892886" className="contactRow">
                <Phone size={20} />
                <span>
                  <small>Phone</small>
                  435-789-2886
                </span>
              </a>

              <a
                href="https://maps.google.com/?q=2295+US-40+Vernal+UT+84078"
                target="_blank"
                rel="noreferrer"
                className="contactRow"
              >
                <MapPin size={20} />
                <span>
                  <small>Address</small>
                  2295 US-40, Vernal, UT 84078
                </span>
              </a>

              <div className="contactRow">
                <Clock size={20} />
                <span>
                  <small>Hours</small>
                  Mon-Fri 9am-6pm · Sat 10am-2pm · Sun closed
                </span>
              </div>
            </div>
          </div>

          <form className="contactForm">
            <div className="formSplit">
              <label>
                First name
                <input placeholder="John" />
              </label>

              <label>
                Last name
                <input placeholder="Smith" />
              </label>
            </div>

            <div className="formSplit">
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
              <textarea placeholder="What vehicle are you interested in?" />
            </label>

            <a
              className="buttonPrimary fullWidth"
              href="mailto:pete@repeteauto.com?subject=Website%20Inquiry%20from%20Repete%20Auto%20Preview"
            >
              Send Inquiry
            </a>
          </form>
        </div>
      </section>

      <footer>
        <Image
          src="/repete-logo.png"
          alt="Repete Auto logo"
          width={380}
          height={90}
        />

        <p>
          © 2026 Repete Auto website preview. Built for a modern local
          dealership experience.
        </p>

        <a href="#top">Back to top</a>
      </footer>
    </main>
  );
}