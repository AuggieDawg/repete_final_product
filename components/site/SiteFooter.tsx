import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site/site";

export function SiteFooter() {
  return (
    <footer>
      <Image
        src="/repete-logo.png"
        alt="Repete Auto logo"
        width={380}
        height={90}
      />

      <p>
        © 2026 Repete Auto. Custom website powered by an approved AutoManager inventory feed.
      </p>

      <div className="footerLinks">
        <Link href="/inventory">Inventory</Link>
        <Link href="/sell-us-your-car">Sell Us Your Car</Link>
        <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
      </div>
    </footer>
  );
}
