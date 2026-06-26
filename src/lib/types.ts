export type Intent =
  | "service"
  | "assessment"
  | "parts"
  | "pricing"
  | "location"
  | "human"
  | "unknown";

export type ServicePrice = {
  id: string;
  serviceSlug: string;
  serviceName: string;
  category: string;
  vehicleBrand: string | null;
  vehicleModel: string | null;
  engineType: string | null;
  priceMin: number;
  priceMax: number | null;
  currency: string;
  notes: string | null;
  isActive: boolean;
};

export type PartItem = {
  id: string;
  partSlug: string;
  partName: string;
  vehicleBrand: string | null;
  vehicleModel: string | null;
  engineType: string | null;
  price: number;
  currency: string;
  stockStatus: string;
  notes: string | null;
  isActive: boolean;
};

export type QuickReply = {
  id: string;
  replyKey: string;
  title: string;
  message: string;
  isActive: boolean;
};

export type BusinessSetting = {
  key: string;
  value: string;
};

export type CustomerRequest = {
  id: string;
  phone: string;
  customerName: string | null;
  requestType: string;
  vehicleBrand: string | null;
  vehicleModel: string | null;
  vehicleYear: string | null;
  engineType: string | null;
  requestedService: string | null;
  requestedPart: string | null;
  hasParts: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  location: string | null;
  summary: string;
  status: string;
};

export type MessageLog = {
  id: string;
  phone: string;
  direction: "incoming" | "outgoing";
  textBody: string;
  intent: string | null;
  createdAt: string;
};

export type ConversationSession = {
  id: string;
  phone: string;
  customerName: string | null;
  currentIntent: Intent | null;
  currentStep: string | null;
  status: string;
  collectedData: Record<string, string>;
};

export type DashboardData = {
  servicePrices: ServicePrice[];
  parts: PartItem[];
  quickReplies: QuickReply[];
  settings: BusinessSetting[];
  requests: CustomerRequest[];
  messages: MessageLog[];
};

export type SetupItem = {
  label: string;
  detail: string;
  ready: boolean;
};
