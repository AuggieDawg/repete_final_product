type FormAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

type WebManagerFormFrameProps = {
  eyebrow?: string;
  title: string;
  description: string;
  src: string;
  fallbackLabel?: string;
  iframeHeight?: number;
  actions?: FormAction[];
  highlights?: string[];
};

function getActionClass(variant: FormAction["variant"] = "secondary") {
  if (variant === "primary") {
    return "bg-red-600 text-white hover:bg-red-500 border border-red-500";
  }

  if (variant === "ghost") {
    return "border border-white/15 text-white hover:bg-white/10";
  }

  return "border border-white/20 bg-white/10 text-white hover:bg-white/15";
}

export function WebManagerFormFrame({
  eyebrow = "Repete Auto",
  title,
  description,
  src,
  fallbackLabel = "Open form in a new tab",
  iframeHeight = 1280,
  actions = [],
  highlights = [
    "Local dealership support",
    "Existing Repete Auto workflow",
    "Fast follow-up from the team",
  ],
}: WebManagerFormFrameProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-neutral-950 text-white">
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.38em] text-red-400">
              {eyebrow}
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 sm:text-lg">
              {description}
            </p>

            {actions.length > 0 ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {actions.map((action) => {
                  const isExternal = action.href.startsWith("http");

                  return (
                    <a
                      key={`${action.label}-${action.href}`}
                      href={action.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${getActionClass(action.variant)}`}
                    >
                      {action.label}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
              What to expect
            </p>

            <div className="mt-6 space-y-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="text-sm leading-6 text-neutral-200">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-red-500/25 bg-red-500/10 p-4">
              <p className="text-sm leading-6 text-red-100">
                This page connects through Repete Auto&apos;s current WebManager
                process, keeping the dealership&apos;s existing lead workflow intact.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="form" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-3 border-b border-neutral-200 bg-neutral-100 px-5 py-4 text-neutral-950 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 text-xs text-neutral-600">
                Complete the secure Repete Auto form below.
              </p>
            </div>

            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-900 transition hover:bg-white"
            >
              {fallbackLabel}
            </a>
          </div>

          <iframe
            title={title}
            src={src}
            className="w-full bg-white"
            style={{ height: iframeHeight }}
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}
