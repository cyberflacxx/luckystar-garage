import { getWhatsAppConfig } from "@/lib/garage-data";

type WhatsAppButton = {
  id: string;
  title: string;
};

type WhatsAppListRow = {
  id: string;
  title: string;
  description?: string;
};

type WhatsAppListSection = {
  title: string;
  rows: WhatsAppListRow[];
};

export type WhatsAppOutbound =
  | {
      kind: "text";
      body: string;
    }
  | {
      kind: "buttons";
      body: string;
      buttons: WhatsAppButton[];
    }
  | {
      kind: "list";
      body: string;
      buttonText: string;
      sections: WhatsAppListSection[];
    };

async function sendWhatsAppPayload(payload: Record<string, unknown>) {
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
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`WhatsApp send failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}

export async function sendWhatsAppText(to: string, body: string) {
  return sendWhatsAppPayload({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: {
      preview_url: false,
      body,
    },
  });
}

export async function sendWhatsAppButtons(
  to: string,
  body: string,
  buttons: WhatsAppButton[],
) {
  return sendWhatsAppPayload({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: {
        buttons: buttons.slice(0, 3).map((button) => ({
          type: "reply",
          reply: {
            id: button.id,
            title: button.title,
          },
        })),
      },
    },
  });
}

export async function sendWhatsAppList(
  to: string,
  body: string,
  buttonText: string,
  sections: WhatsAppListSection[],
) {
  return sendWhatsAppPayload({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: body },
      action: {
        button: buttonText,
        sections: sections.map((section) => ({
          title: section.title,
          rows: section.rows.slice(0, 10).map((row) => ({
            id: row.id,
            title: row.title,
            description: row.description,
          })),
        })),
      },
    },
  });
}

export async function sendWhatsAppOutbound(
  to: string,
  outbound: WhatsAppOutbound,
) {
  if (outbound.kind === "text") {
    return sendWhatsAppText(to, outbound.body);
  }

  if (outbound.kind === "buttons") {
    return sendWhatsAppButtons(to, outbound.body, outbound.buttons);
  }

  return sendWhatsAppList(
    to,
    outbound.body,
    outbound.buttonText,
    outbound.sections,
  );
}
