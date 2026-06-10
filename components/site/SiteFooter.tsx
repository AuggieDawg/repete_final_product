import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site/site";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="shell footerShell">
        <div className="footerBrand">
          <Image
            src="/repete-logo.png"
            alt="Repete Auto logo"
            width={380}
            height={90}
          />

          <p>
            © 2026 Repete Auto. Used cars, trucks, SUVs, and local dealership support in Vernal, Utah.
          </p>
        </div>

        <div className="footerLinks">
          <Link href="/inventory">Inventory</Link>
          <Link href="/schedule-test-drive">Schedule Test Drive</Link>
          <Link href="/vehicle-finder">Vehicle Finder</Link>
          <Link href="/sell-us-your-car">Sell or Trade</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/location">Location</Link>
          <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
        </div>
      </div>
    </footer>
  );
}
