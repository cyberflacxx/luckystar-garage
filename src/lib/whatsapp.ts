import { getEnv, isWhatsAppConfigured } from "@/lib/env";

export async function sendWhatsAppText(to: string, body: string) {
  if (!isWhatsAppConfigured()) {
    return { ok: false, skipped: true };
  }

  const phoneNumberId = getEnv("WHATSAPP_PHONE_NUMBER_ID");
  const accessToken = getEnv("WHATSAPP_ACCESS_TOKEN");

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: false,
          body,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`WhatsApp send failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}
