import { createClient } from "@supabase/supabase-js";

import { getDbSchema, getEnv, isSupabaseConfigured } from "@/lib/env";

function createConfiguredClient(key: string) {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const schema = getDbSchema();

  return createClient(url, key, {
    db: { schema },
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        "X-Client-Info": "luckystar-garage",
      },
    },
  });
}

type AppSupabaseClient = ReturnType<typeof createConfiguredClient>;

let serviceClient: AppSupabaseClient | null = null;
let publicClient: AppSupabaseClient | null = null;

export function getServiceSupabase() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!serviceClient) {
    serviceClient = createConfiguredClient(getEnv("SUPABASE_SERVICE_ROLE_KEY"));
  }

  return serviceClient;
}

export function getPublicSupabase() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!publicClient) {
    publicClient = createConfiguredClient(getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
  }

  return publicClient;
}
