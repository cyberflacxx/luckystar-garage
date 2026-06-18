import Link from "next/link";

import {
  savePart,
  saveQuickReply,
  saveServicePrice,
  saveSetting,
} from "@/app/actions";
import { formatMoney, getDashboardData } from "@/lib/garage-data";

export default async function AdminPage() {
  const dashboard = await getDashboardData();

  return (
    <main className="flex-1 py-6 sm:py-8">
      <div className="shell space-y-6">
        <section className="panel rounded-[2rem] px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="pill">Mobile-first admin panel</span>
              <h1 className="mt-3 section-title">Garage control room</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Manage service pricing, parts pricing, customer requests, and
                WhatsApp quick replies. The layout is already tuned for small
                screens so it can later move cleanly into a PWA or Flutter shell.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <Link className="btn-secondary text-center" href="/">
                Overview
              </Link>
              <a className="btn-primary text-center" href="/api/whatsapp/webhook">
                Webhook
              </a>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <article className="panel rounded-[1.6rem] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Service pricing</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Add labour bands for service jobs and diagnostics.
                  </p>
                </div>
                <span className="pill">{dashboard.servicePrices.length} items</span>
              </div>

              <form action={saveServicePrice} className="mt-5 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="field"
                    name="serviceName"
                    placeholder="Service name e.g. Major service"
                    required
                  />
                  <input
                    className="field"
                    name="category"
                    placeholder="Category e.g. service or assessment"
                    defaultValue="service"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <input className="field" name="vehicleBrand" placeholder="Brand" />
                  <input className="field" name="vehicleModel" placeholder="Model" />
                  <input className="field" name="engineType" placeholder="Engine type" />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    className="field"
                    name="priceMin"
                    placeholder="Min price"
                    inputMode="decimal"
                    required
                  />
                  <input
                    className="field"
                    name="priceMax"
                    placeholder="Max price"
                    inputMode="decimal"
                  />
                  <input
                    className="field"
                    name="currency"
                    placeholder="Currency"
                    defaultValue="USD"
                  />
                </div>
                <textarea
                  className="field min-h-28"
                  name="notes"
                  placeholder="Notes for the quote or labour assumptions"
                />
                <button className="btn-primary w-full sm:w-fit" type="submit">
                  Save service price
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {dashboard.servicePrices.map((price) => (
                  <div
                    key={price.id}
                    className="rounded-[1.2rem] border border-[var(--border)] px-4 py-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold">{price.serviceName}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {[price.category, price.vehicleBrand, price.vehicleModel]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatMoney(price.priceMin, price.currency)}
                        {price.priceMax
                          ? ` - ${formatMoney(price.priceMax, price.currency)}`
                          : ""}
                      </p>
                    </div>
                    {price.notes ? (
                      <p className="mt-2 text-sm text-[var(--muted)]">{price.notes}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>

            <article className="panel rounded-[1.6rem] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Parts catalog</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Keep fast-moving parts and quoted prices current.
                  </p>
                </div>
                <span className="pill">{dashboard.parts.length} parts</span>
              </div>

              <form action={savePart} className="mt-5 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="field"
                    name="partName"
                    placeholder="Part name e.g. Brake pads"
                    required
                  />
                  <input
                    className="field"
                    name="price"
                    placeholder="Price"
                    inputMode="decimal"
                    required
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <input className="field" name="vehicleBrand" placeholder="Brand" />
                  <input className="field" name="vehicleModel" placeholder="Model" />
                  <input className="field" name="engineType" placeholder="Engine type" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="field"
                    name="stockStatus"
                    placeholder="Stock status"
                    defaultValue="in_stock"
                  />
                  <input
                    className="field"
                    name="currency"
                    placeholder="Currency"
                    defaultValue="USD"
                  />
                </div>
                <textarea
                  className="field min-h-24"
                  name="notes"
                  placeholder="Stock note, source, or fitment note"
                />
                <button className="btn-primary w-full sm:w-fit" type="submit">
                  Save part
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {dashboard.parts.map((part) => (
                  <div
                    key={part.id}
                    className="rounded-[1.2rem] border border-[var(--border)] px-4 py-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">{part.partName}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {[part.vehicleBrand, part.vehicleModel, part.engineType]
                            .filter(Boolean)
                            .join(" · ") || "General fitment"}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-semibold">
                          {formatMoney(part.price, part.currency)}
                        </p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {part.stockStatus.replaceAll("_", " ")}
                        </p>
                      </div>
                    </div>
                    {part.notes ? (
                      <p className="mt-2 text-sm text-[var(--muted)]">{part.notes}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <article className="panel rounded-[1.6rem] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Bot responses</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Edit greeting, location, and escalation responses.
                  </p>
                </div>
                <span className="pill">{dashboard.quickReplies.length} replies</span>
              </div>

              <form action={saveQuickReply} className="mt-5 grid gap-3">
                <input
                  className="field"
                  name="replyKey"
                  placeholder="Reply key e.g. greeting"
                  required
                />
                <input
                  className="field"
                  name="title"
                  placeholder="Short title"
                  required
                />
                <textarea
                  className="field min-h-28"
                  name="message"
                  placeholder="Message body"
                  required
                />
                <button className="btn-primary w-full sm:w-fit" type="submit">
                  Save quick reply
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {dashboard.quickReplies.map((reply) => (
                  <div
                    key={reply.id}
                    className="rounded-[1.2rem] border border-[var(--border)] px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold">{reply.title}</p>
                      <span className="pill">{reply.replyKey}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {reply.message}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel rounded-[1.6rem] p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Business settings</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                These values feed the bot responses and dashboard labels.
              </p>

              <form action={saveSetting} className="mt-5 grid gap-3">
                <input
                  className="field"
                  name="key"
                  placeholder="Setting key e.g. business_hours"
                  required
                />
                <textarea
                  className="field min-h-24"
                  name="value"
                  placeholder="Setting value"
                  required
                />
                <button className="btn-primary w-full sm:w-fit" type="submit">
                  Save setting
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {dashboard.settings.map((setting) => (
                  <div
                    key={setting.key}
                    className="rounded-[1.2rem] border border-[var(--border)] px-4 py-3"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {setting.key}
                    </p>
                    <p className="mt-2 text-sm leading-6">{setting.value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel rounded-[1.6rem] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Latest customer requests</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Leads captured from WhatsApp sessions.
                  </p>
                </div>
                <span className="pill">{dashboard.requests.length} open</span>
              </div>

              <div className="mt-5 space-y-3">
                {dashboard.requests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-[1.2rem] border border-[var(--border)] px-4 py-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold">
                          {request.customerName || request.phone}
                        </p>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {request.requestType} · {request.phone}
                        </p>
                      </div>
                      <span className="pill">{request.status}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6">{request.summary}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
