import { demoDashboardData } from "@/lib/demo-data";
import { getEnv, isSupabaseConfigured, isWhatsAppConfigured } from "@/lib/env";
import { getServiceSupabase } from "@/lib/supabase";
import type {
  BusinessSetting,
  ConversationSession,
  CustomerRequest,
  DashboardData,
  PartItem,
  QuickReply,
  ServicePrice,
  SetupItem,
} from "@/lib/types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function asDbKey(value?: string) {
  return value?.trim() ?? "";
}

function mapServicePrice(row: Record<string, unknown>): ServicePrice {
  return {
    id: String(row.id),
    serviceSlug: String(row.service_slug),
    serviceName: String(row.service_name),
    category: String(row.category),
    vehicleBrand: normalizeText(row.vehicle_brand as string | null),
    vehicleModel: normalizeText(row.vehicle_model as string | null),
    engineType: normalizeText(row.engine_type as string | null),
    priceMin: Number(row.price_min),
    priceMax:
      row.price_max === null || row.price_max === undefined
        ? null
        : Number(row.price_max),
    currency: String(row.currency),
    notes: normalizeText(row.notes as string | null),
    isActive: Boolean(row.is_active),
  };
}

function mapPart(row: Record<string, unknown>): PartItem {
  return {
    id: String(row.id),
    partSlug: String(row.part_slug),
    partName: String(row.part_name),
    vehicleBrand: normalizeText(row.vehicle_brand as string | null),
    vehicleModel: normalizeText(row.vehicle_model as string | null),
    engineType: normalizeText(row.engine_type as string | null),
    price: Number(row.price),
    currency: String(row.currency),
    stockStatus: String(row.stock_status),
    notes: normalizeText(row.notes as string | null),
    isActive: Boolean(row.is_active),
  };
}

function mapQuickReply(row: Record<string, unknown>): QuickReply {
  return {
    id: String(row.id),
    replyKey: String(row.reply_key),
    title: String(row.title),
    message: String(row.message),
    isActive: Boolean(row.is_active),
  };
}

function mapSetting(row: Record<string, unknown>): BusinessSetting {
  return {
    key: String(row.key),
    value: String(row.value),
  };
}

const whatsappSettingKeys = {
  accessToken: "whatsapp_access_token",
  phoneNumberId: "whatsapp_phone_number_id",
  businessAccountId: "whatsapp_business_account_id",
  verifyToken: "whatsapp_webhook_verify_token",
} as const;

const fallbackVerifyToken = "luckystar_verify_de3842148dd14258a2f5ec1266e42563";

function mapRequest(row: Record<string, unknown>): CustomerRequest {
  return {
    id: String(row.id),
    phone: String(row.phone),
    customerName: normalizeText(row.customer_name as string | null),
    requestType: String(row.request_type),
    vehicleBrand: normalizeText(row.vehicle_brand as string | null),
    vehicleModel: normalizeText(row.vehicle_model as string | null),
    vehicleYear: normalizeText(row.vehicle_year as string | null),
    engineType: normalizeText(row.engine_type as string | null),
    requestedService: normalizeText(row.requested_service as string | null),
    requestedPart: normalizeText(row.requested_part as string | null),
    hasParts: normalizeText(row.has_parts as string | null),
    preferredDate: normalizeText(row.preferred_date as string | null),
    preferredTime: normalizeText(row.preferred_time as string | null),
    location: normalizeText(row.location as string | null),
    summary: String(row.summary),
    status: String(row.status),
  };
}

export function formatMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = getServiceSupabase();

  if (!supabase) {
    return demoDashboardData;
  }

  const [serviceRes, partsRes, repliesRes, settingsRes, requestsRes] =
    await Promise.all([
      supabase
        .from("service_prices")
        .select("*")
        .eq("is_active", true)
        .order("service_name"),
      supabase
        .from("parts_catalog")
        .select("*")
        .eq("is_active", true)
        .order("part_name"),
      supabase
        .from("quick_replies")
        .select("*")
        .eq("is_active", true)
        .order("reply_key"),
      supabase.from("bot_config").select("*").order("key"),
      supabase
        .from("customer_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  if (
    serviceRes.error ||
    partsRes.error ||
    repliesRes.error ||
    settingsRes.error ||
    requestsRes.error
  ) {
    return demoDashboardData;
  }

  return {
    servicePrices: (serviceRes.data ?? []).map((row) =>
      mapServicePrice(row as Record<string, unknown>),
    ),
    parts: (partsRes.data ?? []).map((row) =>
      mapPart(row as Record<string, unknown>),
    ),
    quickReplies: (repliesRes.data ?? []).map((row) =>
      mapQuickReply(row as Record<string, unknown>),
    ),
    settings: (settingsRes.data ?? []).map((row) =>
      mapSetting(row as Record<string, unknown>),
    ),
    requests: (requestsRes.data ?? []).map((row) =>
      mapRequest(row as Record<string, unknown>),
    ),
  };
}

export async function getSetupStatus() {
  const whatsappConfig = await getWhatsAppConfig();

  const items: SetupItem[] = [
    {
      label: "Supabase connection",
      detail: "Needs URL, anon key, service role key, and schema selection.",
      ready: isSupabaseConfigured(),
    },
    {
      label: "WhatsApp webhook",
      detail: "Needs access token, phone number id, and verify token.",
      ready: Boolean(
        whatsappConfig.accessToken &&
          whatsappConfig.phoneNumberId &&
          whatsappConfig.verifyToken,
      ),
    },
    {
      label: "Business profile",
      detail: "Optional labels for name, phone, address, and opening hours.",
      ready: Boolean(
        getEnv("NEXT_PUBLIC_BUSINESS_NAME") &&
          getEnv("NEXT_PUBLIC_BUSINESS_PHONE") &&
          getEnv("NEXT_PUBLIC_BUSINESS_HOURS"),
      ),
    },
  ];

  return {
    modeLabel: isSupabaseConfigured() ? "Live Supabase" : "Demo fallback",
    items,
  };
}

export async function getSettingValue(key: string) {
  const supabase = getServiceSupabase();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("bot_config")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  return normalizeText(data?.value as string | null) ?? null;
}

export async function getWhatsAppConfig() {
  const [accessToken, phoneNumberId, businessAccountId, verifyToken] =
    await Promise.all([
      getSettingValue(whatsappSettingKeys.accessToken),
      getSettingValue(whatsappSettingKeys.phoneNumberId),
      getSettingValue(whatsappSettingKeys.businessAccountId),
      getSettingValue(whatsappSettingKeys.verifyToken),
    ]);

  return {
    accessToken: accessToken ?? getEnv("WHATSAPP_ACCESS_TOKEN"),
    phoneNumberId: phoneNumberId ?? getEnv("WHATSAPP_PHONE_NUMBER_ID"),
    businessAccountId:
      businessAccountId ?? getEnv("WHATSAPP_BUSINESS_ACCOUNT_ID"),
    verifyToken:
      verifyToken ??
      getEnv("WHATSAPP_WEBHOOK_VERIFY_TOKEN") ??
      fallbackVerifyToken,
    source:
      accessToken || phoneNumberId || businessAccountId || verifyToken
        ? "supabase"
        : isWhatsAppConfigured()
          ? "env"
          : "missing",
  };
}

export async function upsertServicePrice(input: {
  serviceName: string;
  category: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  engineType?: string;
  priceMin: number;
  priceMax?: number;
  currency: string;
  notes?: string;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return;
  }

  await supabase.from("service_prices").upsert(
    {
      service_slug: slugify(input.serviceName),
      service_name: input.serviceName,
      category: input.category,
      vehicle_brand: asDbKey(input.vehicleBrand),
      vehicle_model: asDbKey(input.vehicleModel),
      engine_type: asDbKey(input.engineType),
      price_min: input.priceMin,
      price_max: input.priceMax ?? null,
      currency: input.currency.toUpperCase(),
      notes: normalizeText(input.notes),
      is_active: true,
    },
    {
      onConflict: "service_slug,vehicle_brand,vehicle_model,engine_type",
    },
  );
}

export async function upsertPart(input: {
  partName: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  engineType?: string;
  price: number;
  currency: string;
  stockStatus: string;
  notes?: string;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return;
  }

  await supabase.from("parts_catalog").upsert(
    {
      part_slug: slugify(input.partName),
      part_name: input.partName,
      vehicle_brand: asDbKey(input.vehicleBrand),
      vehicle_model: asDbKey(input.vehicleModel),
      engine_type: asDbKey(input.engineType),
      price: input.price,
      currency: input.currency.toUpperCase(),
      stock_status: slugify(input.stockStatus).replaceAll("-", "_"),
      notes: normalizeText(input.notes),
      is_active: true,
    },
    {
      onConflict: "part_slug,vehicle_brand,vehicle_model,engine_type",
    },
  );
}

export async function upsertQuickReply(input: {
  replyKey: string;
  title: string;
  message: string;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return;
  }

  await supabase.from("quick_replies").upsert(
    {
      reply_key: slugify(input.replyKey).replaceAll("-", "_"),
      title: input.title,
      message: input.message,
      is_active: true,
    },
    { onConflict: "reply_key" },
  );
}

export async function upsertSetting(input: {
  key: string;
  value: string;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return;
  }

  await supabase.from("bot_config").upsert(
    { key: slugify(input.key).replaceAll("-", "_"), value: input.value },
    { onConflict: "key" },
  );
}

export async function findQuickReply(replyKey: string) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return (
      demoDashboardData.quickReplies.find((reply) => reply.replyKey === replyKey) ??
      null
    );
  }

  const { data } = await supabase
    .from("quick_replies")
    .select("*")
    .eq("reply_key", replyKey)
    .eq("is_active", true)
    .maybeSingle();

  return data ? mapQuickReply(data as Record<string, unknown>) : null;
}

export async function logMessage(input: {
  phone: string;
  direction: "incoming" | "outgoing";
  textBody: string;
  intent?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return;
  }

  await supabase.from("messages").insert({
    phone: input.phone,
    direction: input.direction,
    text_body: input.textBody,
    intent: input.intent ?? null,
    metadata: input.metadata ?? {},
  });
}

export async function getConversationSession(
  phone: string,
): Promise<ConversationSession | null> {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("conversation_sessions")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    id: String(data.id),
    phone: String(data.phone),
    customerName: normalizeText(data.customer_name as string | null),
    currentIntent: (data.current_intent as ConversationSession["currentIntent"]) ?? null,
    currentStep: normalizeText(data.current_step as string | null),
    status: String(data.status),
    collectedData: (data.collected_data as Record<string, string>) ?? {},
  };
}

export async function saveConversationSession(input: {
  phone: string;
  customerName?: string | null;
  currentIntent?: string | null;
  currentStep?: string | null;
  status?: string;
  collectedData?: Record<string, string>;
}) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return null;
  }

  const payload = {
    phone: input.phone,
    customer_name: input.customerName ?? null,
    current_intent: input.currentIntent ?? null,
    current_step: input.currentStep ?? null,
    status: input.status ?? "active",
    collected_data: input.collectedData ?? {},
    last_message_at: new Date().toISOString(),
  };

  await supabase.from("conversation_sessions").upsert(payload, {
    onConflict: "phone",
  });

  return payload;
}

export async function createCustomerRequest(
  session: ConversationSession,
  summary: string,
) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return;
  }

  const data = session.collectedData;

  await supabase.from("customer_requests").insert({
    phone: session.phone,
    customer_name: session.customerName ?? data.customer_name ?? null,
    request_type: session.currentIntent ?? "general",
    vehicle_brand: data.vehicle_brand ?? null,
    vehicle_model: data.vehicle_model ?? null,
    vehicle_year: data.vehicle_year ?? null,
    engine_type: data.engine_type ?? null,
    requested_service: data.service_type ?? null,
    requested_part: data.part_name ?? null,
    has_parts: data.has_parts ?? null,
    preferred_date: data.preferred_date ?? null,
    preferred_time: data.preferred_time ?? null,
    location: data.location ?? null,
    summary,
    metadata: data,
  });
}

export async function matchServicePrice(input: {
  serviceType?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  engineType?: string;
  category?: string;
}) {
  const serviceSlug = input.serviceType ? slugify(input.serviceType) : null;
  const supabase = getServiceSupabase();

  const fallback = demoDashboardData.servicePrices.find((item) => {
    if (serviceSlug && item.serviceSlug !== serviceSlug) {
      return false;
    }

    if (input.category && item.category !== input.category) {
      return false;
    }

    if (input.vehicleBrand && item.vehicleBrand && item.vehicleBrand !== input.vehicleBrand) {
      return false;
    }

    if (input.vehicleModel && item.vehicleModel && item.vehicleModel !== input.vehicleModel) {
      return false;
    }

    return true;
  });

  if (!supabase) {
    return fallback ?? null;
  }

  let query = supabase
    .from("service_prices")
    .select("*")
    .eq("is_active", true)
    .limit(6);

  if (serviceSlug) {
    query = query.eq("service_slug", serviceSlug);
  }

  if (input.category) {
    query = query.eq("category", input.category);
  }

  const { data } = await query;

  const matches = (data ?? []).map((row) =>
    mapServicePrice(row as Record<string, unknown>),
  );

  return (
    matches.find((item) => {
      if (
        input.vehicleBrand &&
        item.vehicleBrand &&
        item.vehicleBrand.toLowerCase() !== input.vehicleBrand.toLowerCase()
      ) {
        return false;
      }

      if (
        input.vehicleModel &&
        item.vehicleModel &&
        item.vehicleModel.toLowerCase() !== input.vehicleModel.toLowerCase()
      ) {
        return false;
      }

      if (
        input.engineType &&
        item.engineType &&
        item.engineType.toLowerCase() !== input.engineType.toLowerCase()
      ) {
        return false;
      }

      return true;
    }) ??
    matches[0] ??
    fallback ??
    null
  );
}
