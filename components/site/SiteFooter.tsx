import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="shell footerShell">
        <div className="footerBrand">
          <Image
            src="/repete-logo.png"
            alt="Repete Auto logo"
            width={360}
            height={86}
          />
          <p>
            Premium custom front end built to plug into Repete Auto&apos;s
            current inventory workflow.
          </p>
        </div>

        <div className="footerLinks">
          <Link href="/">Home</Link>
          <Link href="/inventory">Inventory</Link>
          <Link href="/contact">Contact</Link>
          <a
            href="https://maps.google.com/?q=2295+US-40+Vernal+UT+84078"
            target="_blank"
            rel="noreferrer"
          >
            Directions
          </a>
        </div>
      </div>
    </footer>
  );
}
