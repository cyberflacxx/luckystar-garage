import Image from "next/image";

import {
  deletePart,
  saveCompanyInfo,
  savePart,
  saveQuickReply,
} from "@/app/actions";
import { LocationPicker } from "@/app/admin/location-picker";
import {
  formatMoney,
  getDashboardData,
} from "@/lib/garage-data";

const mercedesModelOptions = [
  "W203",
  "W204",
  "C180",
  "C200",
  "C220",
  "C230",
  "C250",
  "C300",
  "E200",
  "E220",
  "E250",
  "E300",
  "E350",
  "S350",
  "CLA",
  "GLA",
  "GLC",
  "GLE",
  "ML",
  "Sprinter",
];

const mobileNavItems = [
  { href: "#overview", label: "Home", icon: "home" },
  { href: "#company-info", label: "Info", icon: "building" },
  { href: "#responses", label: "Responses", icon: "chat" },
  { href: "#parts", label: "Parts", icon: "parts" },
] as const;

function MobileNavIcon({ icon }: { icon: (typeof mobileNavItems)[number]["icon"] }) {
  const baseProps = {
    className: "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };

  if (icon === "home") {
    return (
      <svg {...baseProps}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
      </svg>
    );
  }

  if (icon === "building") {
    return (
      <svg {...baseProps}>
        <path d="M4 21V7l8-3 8 3v14" />
        <path d="M9 21v-4h6v4" />
        <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
      </svg>
    );
  }

  if (icon === "chat") {
    return (
      <svg {...baseProps}>
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H9l-5 4v-3.5A2.5 2.5 0 0 1 4 14V6.5Z" />
      </svg>
    );
  }

  return (
    <svg {...baseProps}>
      <path d="M4 7h16" />
      <path d="M6 12h12" />
      <path d="M8 17h8" />
      <path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function MercedesModelSelect({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const showCustomValue =
    defaultValue &&
    defaultValue !== "Other" &&
    !mercedesModelOptions.includes(defaultValue);

  return (
    <select className="field" name={name} defaultValue={defaultValue || ""}>
      <option value="">Select model</option>
      {showCustomValue ? (
        <option value={defaultValue}>{defaultValue}</option>
      ) : null}
      {mercedesModelOptions.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
      <option value="Other">Other</option>
    </select>
  );
}

function getSetting(
  settings: Array<{ key: string; value: string }>,
  key: string,
  fallback: string,
) {
  return settings.find((setting) => setting.key === key)?.value || fallback;
}

function groupByModel<T extends { vehicleModel: string | null }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = item.vehicleModel || "Mercedes-Benz";
    groups[key] = groups[key] ? [...groups[key], item] : [item];
    return groups;
  }, {});
}

export default async function AdminPage() {
  const dashboard = await getDashboardData();
  const company = {
    name: getSetting(
      dashboard.settings,
      "business_name",
      "LuckyStar Mercedes Garage",
    ),
    phone: getSetting(dashboard.settings, "business_phone", "+263 787 209 882"),
    address: getSetting(
      dashboard.settings,
      "business_address",
      "1 Hampden Street, Belvedere, Harare",
    ),
    hours: getSetting(
      dashboard.settings,
      "business_hours",
      "Mon-Sat 8:00 AM - 5:30 PM",
    ),
    latitude: getSetting(dashboard.settings, "business_latitude", "-17.8292"),
    longitude: getSetting(dashboard.settings, "business_longitude", "31.0127"),
    quoteNote: getSetting(
      dashboard.settings,
      "quote_note",
      "Prices are subject to change. Request a quotation for updated prices.",
    ),
  };
  const groupedParts = groupByModel(dashboard.parts);

  return (
    <main className="flex-1 px-0 pb-24 pt-4 sm:pb-7 sm:pt-7">
      <div className="shell space-y-4">
        <header className="sticky top-0 z-40 -mx-0 rounded-b-[1.4rem] border-b border-[var(--border)] bg-white/92 px-4 py-3 shadow-[0_10px_30px_rgba(8,17,26,0.08)] backdrop-blur md:rounded-[1.4rem] md:border md:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#07111e] p-1.5 shadow-[0_10px_24px_rgba(8,17,26,0.18)]">
              <Image
                src="/logo.png"
                alt="LuckyStar Mercedes logo"
                width={760}
                height={640}
                className="h-full w-full rounded-xl object-contain"
                priority
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Admin Portal
              </p>
              <h1 className="truncate text-lg font-bold tracking-tight sm:text-2xl">
                {company.name}
              </h1>
            </div>
          </div>
        </header>

        <section
          id="overview"
          className="panel overflow-hidden rounded-2xl p-4 sm:p-5"
        >
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Company
              </p>
              <p className="mt-1 text-sm font-semibold">Profile and location</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Catalog
              </p>
              <p className="mt-1 text-sm font-semibold">{dashboard.parts.length} parts listed</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Inbox
              </p>
              <p className="mt-1 text-sm font-semibold">{dashboard.messages.length} latest messages</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-4">
            <article id="company-info" className="panel rounded-2xl p-4 sm:p-5">
              <details open>
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">Company info</h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        These details appear in the dashboard and chatbot.
                      </p>
                    </div>
                    <span className="pill">syncs to bot</span>
                  </div>
                </summary>

                <form action={saveCompanyInfo} className="mt-5 grid gap-3">
                  <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
                    Company name
                    <input
                      className="field"
                      name="business_name"
                      defaultValue={company.name}
                      required
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
                      Phone number
                      <input
                        className="field"
                        name="business_phone"
                        defaultValue={company.phone}
                        required
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
                      Business hours
                      <input
                        className="field"
                        name="business_hours"
                        defaultValue={company.hours}
                        required
                      />
                    </label>
                  </div>
                  <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
                    Address
                    <textarea
                      className="field min-h-20"
                      name="business_address"
                      defaultValue={company.address}
                      required
                    />
                  </label>
                  <LocationPicker
                    address={company.address}
                    latitude={company.latitude}
                    longitude={company.longitude}
                  />
                  <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
                    Price note shown by the chatbot
                    <textarea
                      className="field min-h-20"
                      name="quote_note"
                      defaultValue={company.quoteNote}
                      required
                    />
                  </label>
                  <button className="btn-primary w-full sm:w-fit" type="submit">
                    Save changes
                  </button>
                </form>
              </details>
            </article>

            <article className="panel rounded-2xl p-4 sm:p-5">
              <details>
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">Chatbot welcome</h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Edit the first message customers see on WhatsApp.
                      </p>
                    </div>
                    <span className="pill">dropdown</span>
                  </div>
                </summary>
                <form action={saveQuickReply} className="mt-5 grid gap-3">
                  <input name="replyKey" type="hidden" value="greeting" />
                  <input
                    className="field"
                    name="title"
                    defaultValue="Welcome message"
                    required
                  />
                  <textarea
                    className="field min-h-32"
                    name="message"
                    defaultValue={
                      dashboard.quickReplies.find(
                        (reply) => reply.replyKey === "greeting",
                      )?.message ||
                      "Welcome to LuckyStar Mercedes Garage, the home of all Benz spare parts, repairs, diagnostics and service."
                    }
                    required
                  />
                  <button className="btn-primary w-full sm:w-fit" type="submit">
                    Save welcome
                  </button>
                </form>
              </details>
            </article>

            <article id="responses" className="panel rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">WhatsApp responses</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Customer replies and bot messages are stored here.
                  </p>
                </div>
                <span className="pill">{dashboard.messages.length} latest</span>
              </div>

              <div className="mt-4 space-y-2">
                {dashboard.messages.length ? (
                  dashboard.messages.map((message) => (
                    <div
                      key={message.id}
                      className="rounded-xl border border-[var(--border)] px-3 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{message.phone}</p>
                        <span className="pill">{message.direction}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6">{message.textBody}</p>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {new Date(message.createdAt).toLocaleString("en-ZW")}
                        {message.intent ? ` / ${message.intent}` : ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-[var(--border)] px-3 py-4 text-sm text-[var(--muted)]">
                    No WhatsApp messages yet. Once customers interact with the
                    chatbot, incoming and outgoing replies will appear here.
                  </p>
                )}
              </div>
            </article>
          </div>

          <article id="parts" className="panel rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Parts and prices</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Available Mercedes-Benz parts. Saving edits updates chatbot
                  pricing immediately.
                </p>
              </div>
              <span className="pill">{dashboard.parts.length} parts</span>
            </div>

            <details className="mt-5 rounded-xl border border-[var(--border)] p-3">
              <summary className="cursor-pointer text-sm font-semibold">
                Add new part
              </summary>
              <form action={savePart} className="mt-4 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="field"
                    name="partName"
                    placeholder="Part name e.g. W204 shocks"
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
                  <input
                    className="field"
                    name="vehicleBrand"
                    defaultValue="Mercedes-Benz"
                    placeholder="Brand"
                  />
                  <MercedesModelSelect name="vehicleModel" />
                  <select className="field" name="stockStatus" defaultValue="in_stock">
                    <option value="in_stock">In stock</option>
                    <option value="on_order">On order</option>
                    <option value="out_of_stock">Out of stock</option>
                  </select>
                </div>
                <input name="currency" type="hidden" value="USD" />
                <textarea
                  className="field min-h-20"
                  name="notes"
                  placeholder="Notes e.g. suspension parts"
                />
                <button className="btn-primary w-full sm:w-fit" type="submit">
                  Add part
                </button>
              </form>
            </details>

            <div className="mt-5 space-y-3">
              {Object.entries(groupedParts).map(([model, parts]) => (
                <details
                  key={model}
                  className="rounded-xl border border-[var(--border)] p-3"
                  open={model === "W204"}
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{model}</p>
                      <span className="pill">{parts.length} items</span>
                    </div>
                  </summary>

                  <div className="mt-3 divide-y divide-[var(--border)]">
                    {parts.map((part) => (
                      <details key={part.id} className="py-3">
                        <summary className="cursor-pointer list-none">
                          <div className="grid gap-1 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                            <p className="text-sm font-semibold">{part.partName}</p>
                            <p className="text-sm font-semibold">
                              {formatMoney(part.price, part.currency)}
                            </p>
                            <span className="pill w-fit">
                              {part.stockStatus.replaceAll("_", " ")}
                            </span>
                          </div>
                        </summary>

                        <form action={savePart} className="mt-3 grid gap-3">
                          <input name="id" type="hidden" value={part.id} />
                          <div className="grid gap-3 sm:grid-cols-2">
                            <input
                              className="field"
                              name="partName"
                              defaultValue={part.partName}
                              required
                            />
                            <input
                              className="field"
                              name="price"
                              defaultValue={part.price}
                              inputMode="decimal"
                              required
                            />
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <input
                              className="field"
                              name="vehicleBrand"
                              defaultValue={part.vehicleBrand || "Mercedes-Benz"}
                            />
                            <MercedesModelSelect
                              name="vehicleModel"
                              defaultValue={part.vehicleModel || ""}
                            />
                            <select
                              className="field"
                              name="stockStatus"
                              defaultValue={part.stockStatus}
                            >
                              <option value="in_stock">In stock</option>
                              <option value="on_order">On order</option>
                              <option value="out_of_stock">Out of stock</option>
                            </select>
                          </div>
                          <input
                            name="currency"
                            type="hidden"
                            value={part.currency || "USD"}
                          />
                          <textarea
                            className="field min-h-20"
                            name="notes"
                            defaultValue={part.notes || ""}
                          />
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button className="btn-primary" type="submit">
                              Save changes
                            </button>
                          </div>
                        </form>
                        <form action={deletePart} className="mt-2">
                          <input name="id" type="hidden" value={part.id} />
                          <button
                            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
                            type="submit"
                          >
                            Delete part
                          </button>
                        </form>
                      </details>
                    ))}
                  </div>
                </details>
              ))}
            </div>

            <p className="mt-5 rounded-xl bg-[var(--electric-soft)] px-4 py-3 text-sm leading-6 text-[var(--electric)]">
              Prices are subject to change. Customers should request a quotation
              for updated prices before ordering.
            </p>
          </article>
        </section>

        <nav
          className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 gap-2 rounded-[1.35rem] border border-[rgba(6,59,157,0.12)] bg-white/95 p-2 shadow-[0_18px_42px_rgba(8,17,26,0.14)] backdrop-blur md:hidden"
          aria-label="Mobile dashboard navigation"
        >
          {mobileNavItems.map((item) => (
            <a
              key={item.href}
              className="grid justify-items-center gap-1 rounded-2xl px-1 py-2 text-center text-[0.68rem] font-bold text-[var(--muted)] active:bg-[var(--electric-soft)] active:text-[var(--accent-strong)] focus-visible:bg-[var(--electric-soft)] focus-visible:text-[var(--accent-strong)] focus-visible:outline-none"
              href={item.href}
            >
              <MobileNavIcon icon={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
