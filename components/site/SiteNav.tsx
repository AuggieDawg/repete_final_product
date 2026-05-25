import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site/site";

export function SiteNav() {
  return (
    <nav className="nav">
      <Link href="/" className="navLogo" aria-label="Repete Auto home">
        <Image
          src="/repete-logo.png"
          alt="Repete Auto logo"
          width={520}
          height={120}
          priority
        />
      </Link>

      <div className="navLinks">
        <Link href="/inventory">{siteConfig.inventoryLabel}</Link>
        <Link href="/sell-us-your-car">{siteConfig.sellUsYourCarLabel}</Link>
        <Link href="/contact">{siteConfig.contactLabel}</Link>
        <Link href="/location" className="navCta">
          {siteConfig.locationLabel}
        </Link>
      </div>
    </nav>
  );
}
