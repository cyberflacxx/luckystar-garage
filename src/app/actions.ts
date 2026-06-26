"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  deactivatePart,
  upsertPart,
  upsertQuickReply,
  upsertServicePrice,
  upsertSetting,
  upsertSettings,
} from "@/lib/garage-data";

const serviceSchema = z.object({
  serviceName: z.string().min(2),
  category: z.string().default("service"),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),
  engineType: z.string().optional(),
  priceMin: z.coerce.number().nonnegative(),
  priceMax: z.coerce.number().nonnegative().optional(),
  currency: z.string().min(3).max(5).default("USD"),
  notes: z.string().optional(),
});

const partSchema = z.object({
  id: z.string().optional(),
  partName: z.string().min(2),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),
  engineType: z.string().optional(),
  price: z.coerce.number().nonnegative(),
  currency: z.string().min(3).max(5).default("USD"),
  stockStatus: z.string().default("in_stock"),
  notes: z.string().optional(),
});

const quickReplySchema = z.object({
  replyKey: z.string().min(2),
  title: z.string().min(2),
  message: z.string().min(5),
});

const settingSchema = z.object({
  key: z.string().min(2),
  value: z.string().min(1),
});

const companyInfoSchema = z.object({
  business_name: z.string().min(2),
  business_phone: z.string().min(3),
  business_address: z.string().min(3),
  business_hours: z.string().min(2),
  business_latitude: z.string().optional(),
  business_longitude: z.string().optional(),
  quote_note: z.string().min(5),
});

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function saveServicePrice(formData: FormData) {
  const parsed = serviceSchema.parse({
    serviceName: readString(formData, "serviceName"),
    category: readString(formData, "category"),
    vehicleBrand: readString(formData, "vehicleBrand") || undefined,
    vehicleModel: readString(formData, "vehicleModel") || undefined,
    engineType: readString(formData, "engineType") || undefined,
    priceMin: readString(formData, "priceMin"),
    priceMax: readString(formData, "priceMax") || undefined,
    currency: readString(formData, "currency") || "USD",
    notes: readString(formData, "notes") || undefined,
  });

  await upsertServicePrice(parsed);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function savePart(formData: FormData) {
  const parsed = partSchema.parse({
    id: readString(formData, "id") || undefined,
    partName: readString(formData, "partName"),
    vehicleBrand: readString(formData, "vehicleBrand") || undefined,
    vehicleModel: readString(formData, "vehicleModel") || undefined,
    engineType: readString(formData, "engineType") || undefined,
    price: readString(formData, "price"),
    currency: readString(formData, "currency") || "USD",
    stockStatus: readString(formData, "stockStatus") || "in_stock",
    notes: readString(formData, "notes") || undefined,
  });

  await upsertPart(parsed);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deletePart(formData: FormData) {
  const id = readString(formData, "id");

  if (id) {
    await deactivatePart(id);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveQuickReply(formData: FormData) {
  const parsed = quickReplySchema.parse({
    replyKey: readString(formData, "replyKey"),
    title: readString(formData, "title"),
    message: readString(formData, "message"),
  });

  await upsertQuickReply(parsed);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveSetting(formData: FormData) {
  const parsed = settingSchema.parse({
    key: readString(formData, "key"),
    value: readString(formData, "value"),
  });

  await upsertSetting(parsed);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveCompanyInfo(formData: FormData) {
  const parsed = companyInfoSchema.parse({
    business_name: readString(formData, "business_name"),
    business_phone: readString(formData, "business_phone"),
    business_address: readString(formData, "business_address"),
    business_hours: readString(formData, "business_hours"),
    business_latitude: readString(formData, "business_latitude") || undefined,
    business_longitude: readString(formData, "business_longitude") || undefined,
    quote_note: readString(formData, "quote_note"),
  });

  await upsertSettings(parsed);

  revalidatePath("/");
  revalidatePath("/admin");
}
