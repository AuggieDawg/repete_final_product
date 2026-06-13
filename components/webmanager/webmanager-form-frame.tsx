import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { siteConfig } from "@/lib/site/site";

type FormAction = {
  label: string;
  href: string;
  variant?: "primary" | "ghost";
};

type WebManagerFormFrameProps = {
  eyebrow?: string;
  title: string;
  description: string;
  src: string;
  iframeHeight?: number;
  actions?: FormAction[];
  floatingBackHref?: string;
  floatingBackLabel?: string;
};

export function WebManagerFormFrame({
  eyebrow = "Repete Auto",
  title,
  description,
  src,
  iframeHeight = 1650,
  actions = [],
  floatingBackHref,
  floatingBackLabel = "Back",
}: WebManagerFormFrameProps) {
  return (
    <main className="webmanagerPage">
      <SiteNav />

      {floatingBackHref ? (
        <Link
          className="floatingBackToInventory"
          href={floatingBackHref}
          aria-label={floatingBackLabel}
          title={floatingBackLabel}
        >
          ←
        </Link>
      ) : null}

      <section className="webmanagerHero">
        <div className="heroOverlay" />
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />
        <div className="heroLine heroLineOne" />
        <div className="heroLine heroLineTwo" />

        <div className="shell webmanagerHeroShell">
          <div className="webmanagerHeroCopy">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="webmanagerHeroActions">
            {actions.map((action) => (
              <Link
                key={`${action.label}-${action.href}`}
                href={action.href}
                className={action.variant === "primary" ? "buttonPrimary" : "buttonGhost"}
              >
                {action.label}
              </Link>
            ))}

            <a className="buttonGhost" href={siteConfig.phoneHref}>
              Call {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="webmanagerFormSection" id="form">
        <div className="webmanagerFormShell">
          <div className="webmanagerFormPanel">
            <iframe
              title={title}
              src={src}
              className="webmanagerFrame"
              style={{ height: iframeHeight }}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
