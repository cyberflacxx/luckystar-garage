import Image from "next/image";
import Link from "next/link";

import {
  formatMoney,
  getDashboardData,
  getSetupStatus,
} from "@/lib/garage-data";

function getSetting(settings: Array<{ key: string; value: string }>, key: string, fallback: string) {
  return settings.find((setting) => setting.key === key)?.value || fallback;
}

export default async function Home() {
  const [dashboard, setupStatus] = await Promise.all([
    getDashboardData(),
    getSetupStatus(),
  ]);

  const address = getSetting(
    dashboard.settings,
    "business_address",
    "1 Hampden Street, Belvedere, Harare",
  );
  const phone = getSetting(
    dashboard.settings,
    "business_phone",
    "+263 787 209 882",
  );
  const hours = getSetting(
    dashboard.settings,
    "business_hours",
    "Mon-Sat 8:00 AM - 5:30 PM",
  );

  const serviceHighlights = [
    "Mercedes-Benz service and repairs",
    "Engine diagnosis and replacement",
    "Original and aftermarket spare parts",
    "Brake, suspension and steering work",
  ];

  return (
    <main className="flex-1 py-4 sm:py-8">
      <div className="shell space-y-6">
        <section className="panel-dark blueprint-grid overflow-hidden rounded-[2.4rem] px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="space-y-5">
              <span className="pill pill-dark">
                Mercedes-Benz specialists • WhatsApp concierge
              </span>
              <div className="space-y-4">
                <h1 className="display-title max-w-4xl">
                  LuckyStar Garage, rebuilt as a proper digital front desk.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#d4e7fb] sm:text-base">
                  Customers now get a modern workshop experience: guided choices,
                  specialist Mercedes-Benz service paths, parts requests,
                  diagnostics, and a mobile-first admin workspace that can later
                  become a full PWA.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {serviceHighlights.map((item) => (
                  <div key={item} className="service-chip">
                    <p className="text-sm font-medium leading-6">{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary text-center" href="/admin">
                  Open operations panel
                </Link>
                <a
                  className="btn-secondary text-center"
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open workshop map
                </a>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="luxury-card p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#9ecfff]">
                      Brand crest
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Mercedes workshop identity
                    </h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#bed9f0]">
                      A stronger public-facing look for LuckyStar, centred on
                      premium service, engine work and specialist workshop trust.
                    </p>
                  </div>
                  <span className="pill pill-dark">Visual refresh</span>
                </div>
                <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#09111b] p-3">
                  <Image
                    src="/logo.png"
                    alt="LuckyStar Mercedes workshop crest"
                    width={760}
                    height={640}
                    className="h-auto w-full rounded-[1.2rem]"
                    priority
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Contact", value: phone },
                  { label: "Workshop", value: address },
                  { label: "Hours", value: hours },
                ].map((item) => (
                  <div key={item.label} className="metric-frame">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#9ecfff]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-6">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Service prices",
              value: dashboard.servicePrices.length,
              helper: "Structured workshop labour and service pricing",
            },
            {
              label: "Parts catalog",
              value: dashboard.parts.length,
              helper: "Mercedes-Benz and general spare parts management",
            },
            {
              label: "Customer requests",
              value: dashboard.requests.length,
              helper: "Captured leads from the live WhatsApp journey",
            },
            {
              label: "Quick replies",
              value: dashboard.quickReplies.length,
              helper: "Text templates and WhatsApp flow copy",
            },
          ].map((card) => (
            <article key={card.label} className="panel rounded-[1.6rem] p-5">
              <p className="text-sm text-[var(--muted)]">{card.label}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight">{card.value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {card.helper}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="panel rounded-[1.9rem] overflow-hidden">
            <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    WhatsApp experience upgrade
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    The bot now supports interactive menu choices instead of a
                    plain `1, 2, 3` prompt.
                  </p>
                </div>
                <span className="pill">Interactive lists</span>
              </div>
            </div>

            <div className="grid gap-3 px-5 py-5 text-sm sm:px-6">
              {[
                {
                  label: "Welcome menu",
                  body: "Customers can tap Car service, Diagnosis, Spare parts, Prices, Location or Talk to us.",
                },
                {
                  label: "Specialist routing",
                  body: "Mercedes-Benz brands, common models, service types and yes/no decisions are now interactive where possible.",
                },
                {
                  label: "Faster capture",
                  body: "The flow still accepts free text, but key choices are now guided so the user feels like they are using a workshop concierge.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.2rem] border border-[var(--border)] px-4 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {item.label}
                  </p>
                  <p className="mt-2 leading-6">{item.body}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel-dark rounded-[1.9rem] overflow-hidden">
            <div className="border-b border-white/8 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Workshop visual block</h2>
                  <p className="mt-1 text-sm text-[#c4ddf2]">
                    A strategic branded visual for the public landing page while
                    you prepare final marketing artwork.
                  </p>
                </div>
                <span className="pill pill-dark">Hero art</span>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6 sm:py-6">
              <Image
                src="/luckystar-bay.svg"
                alt="LuckyStar Garage workshop visual"
                width={920}
                height={640}
                className="h-auto w-full rounded-[1.5rem] border border-white/8"
              />
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="panel rounded-[1.9rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Current pricing snapshot</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Live service entries from Supabase, surfaced like a premium
                  workshop menu.
                </p>
              </div>
              <Link className="btn-secondary text-sm" href="/admin">
                Manage prices
              </Link>
            </div>

            <div className="mt-5 grid gap-3">
              {dashboard.servicePrices.slice(0, 5).map((price) => (
                <div
                  key={price.id}
                  className="rounded-[1.3rem] border border-[var(--border)] px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold">{price.serviceName}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {[price.vehicleBrand, price.vehicleModel, price.engineType]
                          .filter(Boolean)
                          .join(" · ") || "General fitment"}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold">
                        {formatMoney(price.priceMin, price.currency)}
                        {price.priceMax
                          ? ` - ${formatMoney(price.priceMax, price.currency)}`
                          : ""}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {price.notes || "Labour estimate"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel rounded-[1.9rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Readiness board</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  System and business setup status from the live project.
                </p>
              </div>
              <span className="pill">{setupStatus.modeLabel}</span>
            </div>

            <div className="mt-5 space-y-3">
              {setupStatus.items.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.3rem] border border-[var(--border)] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                        {item.detail}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: item.ready
                          ? "rgba(47,125,87,0.12)"
                          : "rgba(182,107,20,0.12)",
                        color: item.ready ? "var(--success)" : "var(--warning)",
                      }}
                    >
                      {item.ready ? "Ready" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}

              <div className="rounded-[1.3rem] border border-[var(--border)] px-4 py-4">
                <p className="font-semibold">Workshop location</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {address}
                </p>
                <a
                  className="mt-4 inline-flex rounded-full bg-[var(--electric-soft)] px-4 py-2 text-sm font-semibold text-[var(--electric)]"
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
