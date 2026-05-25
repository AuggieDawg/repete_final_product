import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site/site";

export function SiteNav() {
  return (
    <header className="siteHeader">
      <div className="shell navShell">
        <Link href="/" className="brandMark" aria-label="Repete Auto home">
          <Image
            src="/repete-logo.png"
            alt="Repete Auto logo"
            width={520}
            height={120}
            priority
          />
        </Link>

        <nav className="siteNav" aria-label="Primary navigation">
          <Link href="/inventory">{siteConfig.inventoryLabel}</Link>
          <Link href="/sell-us-your-car">{siteConfig.sellUsYourCarLabel}</Link>
          <Link href="/contact">{siteConfig.contactLabel}</Link>
          <Link href="/location" className="navCta">
            {siteConfig.locationLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
