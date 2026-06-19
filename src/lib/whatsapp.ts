import { getWhatsAppConfig } from "@/lib/garage-data";

export async function sendWhatsAppText(to: string, body: string) {
  const config = await getWhatsAppConfig();

  if (!config.accessToken || !config.phoneNumberId) {
    return { ok: false, skipped: true };
  }

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
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
