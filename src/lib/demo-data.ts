import type {
  BusinessSetting,
  CustomerRequest,
  DashboardData,
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
    vehicleBrand: "Toyota",
    vehicleModel: null,
    engineType: null,
    priceMin: 45,
    priceMax: 80,
    currency: "USD",
    notes: "Labour estimate before service parts",
    isActive: true,
  },
  {
    id: "srv-2",
    serviceSlug: "major-service",
    serviceName: "Major service",
    category: "service",
    vehicleBrand: "Mercedes",
    vehicleModel: "C180",
    engineType: "Petrol",
    priceMin: 120,
    priceMax: 210,
    currency: "USD",
    notes: "Model-dependent estimate before parts",
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
  {
    id: "part-1",
    partSlug: "brake-pads-front",
    partName: "Front brake pads",
    vehicleBrand: "Mercedes",
    vehicleModel: "C180",
    engineType: null,
    price: 55,
    currency: "USD",
    stockStatus: "on_order",
    notes: "Premium aftermarket set",
    isActive: true,
  },
  {
    id: "part-2",
    partSlug: "oil-filter",
    partName: "Oil filter",
    vehicleBrand: "Toyota",
    vehicleModel: null,
    engineType: null,
    price: 12,
    currency: "USD",
    stockStatus: "in_stock",
    notes: "OEM equivalent",
    isActive: true,
  },
];

export const demoQuickReplies: QuickReply[] = [
  {
    id: "reply-1",
    replyKey: "greeting",
    title: "Welcome message",
    message:
      "Good day sir/madam. Welcome to LuckyStar Garages. Reply with a number or type what you want: 1. Car service 2. Mechanic assessment / diagnosis 3. Spare parts 4. Prices 5. Location / working hours 6. Talk to a person",
    isActive: true,
  },
  {
    id: "reply-2",
    replyKey: "location",
    title: "Location and hours",
    message:
      "LuckyStar Garages is open Monday to Saturday, 8:00 AM to 5:30 PM. Share your preferred day and we will confirm availability.",
    isActive: true,
  },
  {
    id: "reply-3",
    replyKey: "human_handoff",
    title: "Human handoff",
    message:
      "Thank you. A LuckyStar Garages team member will contact you shortly.",
    isActive: true,
  },
];

export const demoSettings: BusinessSetting[] = [
  { key: "business_name", value: "LuckyStar Garages" },
  { key: "business_hours", value: "Mon-Sat 8:00 AM - 5:30 PM" },
  {
    key: "quote_note",
    value: "Exact prices depend on model, engine, and current parts availability.",
  },
];

export const demoRequests: CustomerRequest[] = [
  {
    id: "req-1",
    phone: "+263771000001",
    customerName: "Tafadzwa",
    requestType: "service",
    vehicleBrand: "Mercedes",
    vehicleModel: "C180",
    vehicleYear: "2012",
    engineType: "Petrol",
    requestedService: "Major service",
    requestedPart: null,
    hasParts: "no",
    preferredDate: "2026-06-21",
    preferredTime: "09:00",
    location: null,
    summary:
      "Major service request for Mercedes C180, 2012 petrol. Customer does not have parts and wants a Saturday morning booking.",
    status: "new",
  },
  {
    id: "req-2",
    phone: "+263771000002",
    customerName: "Nyasha",
    requestType: "parts",
    vehicleBrand: "Toyota",
    vehicleModel: "Corolla",
    vehicleYear: "2016",
    engineType: null,
    requestedService: null,
    requestedPart: "Oil filter and front brake pads",
    hasParts: null,
    preferredDate: null,
    preferredTime: null,
    location: null,
    summary:
      "Customer wants a parts quote for a 2016 Toyota Corolla and may also need fitting.",
    status: "quoted",
  },
];

export const demoDashboardData: DashboardData = {
  servicePrices: demoServicePrices,
  parts: demoParts,
  quickReplies: demoQuickReplies,
  settings: demoSettings,
  requests: demoRequests,
};
