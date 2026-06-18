const defaultSchema = "luckystar_garage";

export function getEnv(name: string) {
  return process.env[name]?.trim() || "";
}

export function getDbSchema() {
  return getEnv("SUPABASE_DB_SCHEMA") || defaultSchema;
}

export function isSupabaseConfigured() {
  return Boolean(
    getEnv("NEXT_PUBLIC_SUPABASE_URL") &&
      getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") &&
      getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

export function isWhatsAppConfigured() {
  return Boolean(
    getEnv("WHATSAPP_ACCESS_TOKEN") &&
      getEnv("WHATSAPP_PHONE_NUMBER_ID") &&
      getEnv("WHATSAPP_WEBHOOK_VERIFY_TOKEN"),
  );
}
