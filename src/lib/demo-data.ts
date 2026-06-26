import type {
  BusinessSetting,
  CustomerRequest,
  DashboardData,
  MessageLog,
  PartItem,
  QuickReply,
  ServicePrice,
} from "@/lib/types";

export const demoServicePrices: ServicePrice[] = [
  {
    id: "srv-1",
    serviceSlug: "minor-service",
    serviceName: "Minor service",
    category: "service",
    vehicleBrand: "Mercedes-Benz",
    vehicleModel: "W204",
    engineType: null,
    priceMin: 45,
    priceMax: 80,
    currency: "USD",
    notes: "Labour estimate before service parts. Confirm current pricing by quotation.",
    isActive: true,
  },
  {
    id: "srv-2",
    serviceSlug: "major-service",
    serviceName: "Major service",
    category: "service",
    vehicleBrand: "Mercedes-Benz",
    vehicleModel: "W203 / W204",
    engineType: "Petrol",
    priceMin: 120,
    priceMax: 210,
    currency: "USD",
    notes: "Model-dependent Mercedes-Benz estimate before parts.",
    isActive: true,
  },
  {
    id: "srv-3",
    serviceSlug: "diagnostic-assessment",
    serviceName: "Diagnostic assessment",
    category: "assessment",
    vehicleBrand: null,
    vehicleModel: null,
    engineType: null,
    priceMin: 25,
    priceMax: 45,
    currency: "USD",
    notes: "Workshop inspection fee",
    isActive: true,
  },
];

export const demoParts: PartItem[] = [
  ["W204 shocks", "W204", 120, "Suspension parts"],
  ["W204 knuckles", "W204", 30, "Suspension parts"],
  ["W204 tie rod ends", "W204", 30, "Suspension parts"],
  ["W204 lower control arms x2", "W204", 80, "Suspension parts"],
  ["W204 upper control arms x2", "W204", 80, "Suspension parts"],
  ["W204 links", "W204", 40, "Suspension parts"],
  ["W204 front brake pads", "W204", 30, "Brake parts"],
  ["W204 rear brake pads", "W204", 25, "Brake parts"],
  ["W203 cast control arms x2", "W203", 80, "Suspension parts"],
  ["W203 aluminum control arms x2", "W203", 80, "Suspension parts"],
  ["W203 stabilizer bar links x2", "W203", 25, "Suspension parts"],
  ["W203 stabilizer bar bushes x2", "W203", 20, "Suspension parts"],
  ["W203 knuckles x2", "W203", 25, "Suspension parts"],
  ["W203 tie rod ends x2", "W203", 25, "Suspension parts"],
  ["W203 front shocks x2", "W203", 100, "Suspension parts"],
  ["W203 rear shocks x2", "W203", 80, "Suspension parts"],
  ["W203 front brake pads x2", "W203", 30, "Brake parts"],
  ["W203 rear brake pads x2", "W203", 20, "Brake parts"],
].map(([partName, model, price, notes], index) => ({
  id: `part-${index + 1}`,
  partSlug: String(partName).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  partName: String(partName),
  vehicleBrand: "Mercedes-Benz",
  vehicleModel: String(model),
  engineType: null,
  price: Number(price),
  currency: "USD",
  stockStatus: "in_stock",
  notes: String(notes),
  isActive: true,
}));

export const demoQuickReplies: QuickReply[] = [
  {
    id: "reply-1",
    replyKey: "greeting",
    title: "Welcome message",
    message:
      "Welcome to LuckyStar Mercedes Garage, the home of all Benz spare parts, repairs, diagnostics and service. Note: prices are subject to change. Request a quotation for updated prices.",
    isActive: true,
  },
  {
    id: "reply-2",
    replyKey: "location",
    title: "Location and hours",
    message:
      "LuckyStar Mercedes Garage is open Monday to Saturday, 8:00 AM to 5:30 PM. Use View GPS directions to open Google Maps to the garage.",
    isActive: true,
  },
  {
    id: "reply-3",
    replyKey: "human_handoff",
    title: "Human handoff",
    message:
      "Thank you. A LuckyStar Mercedes Garage team member will contact you shortly.",
    isActive: true,
  },
];

export const demoSettings: BusinessSetting[] = [
  { key: "business_name", value: "LuckyStar Mercedes Garage" },
  { key: "business_phone", value: "+263 787 209 882" },
  { key: "business_address", value: "1 Hampden Street, Belvedere, Harare" },
  { key: "business_latitude", value: "-17.8292" },
  { key: "business_longitude", value: "31.0127" },
  { key: "business_hours", value: "Mon-Sat 8:00 AM - 5:30 PM" },
  {
    key: "quote_note",
    value: "Prices are subject to change. Request a quotation for updated prices.",
  },
];

export const demoRequests: CustomerRequest[] = [
  {
    id: "req-1",
    phone: "+263771000001",
    customerName: "Tafadzwa",
    requestType: "service",
    vehicleBrand: "Mercedes-Benz",
    vehicleModel: "W204 C180",
    vehicleYear: "2012",
    engineType: "Petrol",
    requestedService: "Major service",
    requestedPart: null,
    hasParts: "no",
    preferredDate: "2026-06-21",
    preferredTime: "09:00",
    location: null,
    summary:
      "Major service request for Mercedes-Benz W204 C180, 2012 petrol. Customer does not have parts and wants a Saturday morning booking.",
    status: "new",
  },
  {
    id: "req-2",
    phone: "+263771000002",
    customerName: "Nyasha",
    requestType: "parts",
    vehicleBrand: "Mercedes-Benz",
    vehicleModel: "W203",
    vehicleYear: "2016",
    engineType: null,
    requestedService: null,
    requestedPart: "Front shocks and brake pads",
    hasParts: null,
    preferredDate: null,
    preferredTime: null,
    location: null,
    summary:
      "Customer wants a parts quote for a Mercedes-Benz W203 front shocks and brake pads and may also need fitting.",
    status: "quoted",
  },
];

export const demoMessages: MessageLog[] = [
  {
    id: "msg-1",
    phone: "+263771000001",
    direction: "incoming",
    textBody: "Hi, do you have W204 lower control arms?",
    intent: "parts",
    createdAt: new Date().toISOString(),
  },
  {
    id: "msg-2",
    phone: "+263771000001",
    direction: "outgoing",
    textBody:
      "We can help with Mercedes-Benz parts. Please share your name first.",
    intent: "parts",
    createdAt: new Date().toISOString(),
  },
];

export const demoDashboardData: DashboardData = {
  servicePrices: demoServicePrices,
  parts: demoParts,
  quickReplies: demoQuickReplies,
  settings: demoSettings,
  requests: demoRequests,
  messages: demoMessages,
};
