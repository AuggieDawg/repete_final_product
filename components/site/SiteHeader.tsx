import Image from "next/image";
import Link from "next/link";

import { WEBMANAGER_INVENTORY_URL } from "../../lib/inventory";

export function SiteHeader() {
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
          <Link href="/inventory">Inventory</Link>
          <Link href="/contact">Contact</Link>
          <a
            href={WEBMANAGER_INVENTORY_URL}
            target="_blank"
            rel="noreferrer"
          >
            Live AutoManager Inventory
          </a>
          <a href="tel:14357892886" className="navCta">
            Call Repete Auto
          </a>
        </nav>
      </div>
    </header>
  );
}
