import Link from "next/link";

import {
  formatMoney,
  getDashboardData,
  getSetupStatus,
} from "@/lib/garage-data";

export default async function Home() {
  const [dashboard, setupStatus] = await Promise.all([
    getDashboardData(),
    getSetupStatus(),
  ]);

  return (
    <main className="flex-1 py-6 sm:py-8">
      <div className="shell space-y-6">
        <section className="panel subtle-grid overflow-hidden rounded-[2rem] px-5 py-6 sm:px-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <span className="pill">WhatsApp Cloud API + Next.js + Supabase</span>
              <div className="space-y-3">
                <h1 className="section-title max-w-2xl">
                  LuckyStar Garages bot and admin workspace, built for phones
                  first and ready for a PWA path.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                  The app is set up as one Next.js project with a WhatsApp webhook,
                  garage conversation engine, direct schema-scoped Supabase access,
                  and a responsive operations dashboard for services, parts, and
                  customer requests.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary text-center" href="/admin">
                  Open admin panel
                </Link>
                <a
                  className="btn-secondary text-center"
                  href="/api/whatsapp/webhook"
                >
                  View webhook route
                </a>
              </div>
            </div>

            <div className="panel-strong rounded-[1.6rem] border border-[var(--border)] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Setup status</h2>
                <span className="pill">{setupStatus.modeLabel}</span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {setupStatus.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--border)] px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="mt-1 text-[var(--muted)]">{item.detail}</p>
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
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Service prices",
              value: dashboard.servicePrices.length,
              helper: "Managed rates and labour bands",
            },
            {
              label: "Parts catalog",
              value: dashboard.parts.length,
              helper: "Parts, stock notes, and quoted prices",
            },
            {
              label: "Customer requests",
              value: dashboard.requests.length,
              helper: "Captured from WhatsApp flows",
            },
            {
              label: "Quick replies",
              value: dashboard.quickReplies.length,
              helper: "Greeting, location, and handoff responses",
            },
          ].map((card) => (
            <article key={card.label} className="panel rounded-[1.4rem] p-5">
              <p className="text-sm text-[var(--muted)]">{card.label}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight">{card.value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {card.helper}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="panel rounded-[1.8rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Sample WhatsApp flow</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  This is the default guided conversation the bot follows.
                </p>
              </div>
              <span className="pill">Intent-aware</span>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              {[
                ["Customer", "Hi"],
                [
                  "Bot",
                  "Good day sir/madam. Welcome to LuckyStar Garages. Reply with a number or type what you want: 1. Car service 2. Mechanic assessment / diagnosis 3. Spare parts 4. Prices 5. Location / working hours 6. Talk to a person",
                ],
                ["Customer", "Service for my Benz C180"],
                [
                  "Bot",
                  "You need car service. Please share your name first, then I will collect the vehicle details and check the estimated price.",
                ],
                ["Customer", "Tafadzwa"],
                [
                  "Bot",
                  "Thank you Tafadzwa. What is the vehicle brand? Example: Mercedes, Toyota, Volvo, BMW.",
                ],
              ].map(([speaker, message], index) => (
                <div
                  key={`${speaker}-${index}`}
                  className="rounded-[1.3rem] border border-[var(--border)] px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {speaker}
                  </p>
                  <p className="mt-1 leading-6">{message}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel rounded-[1.8rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Current pricing snapshot</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Pulled from Supabase when configured, otherwise demo data.
                </p>
              </div>
              <Link className="btn-secondary text-sm" href="/admin">
                Manage prices
              </Link>
            </div>

            <div className="mt-5 grid gap-3">
              {dashboard.servicePrices.slice(0, 4).map((price) => (
                <div
                  key={price.id}
                  className="flex flex-col gap-3 rounded-[1.25rem] border border-[var(--border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
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
                      {price.notes || "Price estimate"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
