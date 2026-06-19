import { NextRequest, NextResponse } from "next/server";

import { handleIncomingWhatsAppMessage } from "@/lib/bot";
import { sendWhatsAppText } from "@/lib/whatsapp";

const fallbackVerifyToken = "luckystar_verify_de3842148dd14258a2f5ec1266e42563";

type WebhookMessage = {
  from?: string;
  text?: { body?: string };
  type?: string;
  interactive?: {
    button_reply?: { title?: string; id?: string };
    list_reply?: { title?: string; id?: string };
  };
};

function extractText(message: WebhookMessage) {
  if (message.text?.body) {
    return message.text.body;
  }

  if (message.interactive?.button_reply?.title) {
    return message.interactive.button_reply.title;
  }

  if (message.interactive?.list_reply?.title) {
    return message.interactive.list_reply.title;
  }

  return "";
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (!mode) {
    return NextResponse.json({
      ok: true,
      message: "LuckyStar Garages webhook endpoint is online.",
    });
  }

  if (
    mode === "subscribe" &&
    token &&
    token ===
      (process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || fallbackVerifyToken)
  ) {
    return new NextResponse(challenge ?? "ok");
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    entry?: Array<{
      changes?: Array<{
        value?: {
          messages?: WebhookMessage[];
        };
      }>;
    }>;
  };

  const messages =
    body.entry
      ?.flatMap((entry) => entry.changes ?? [])
      .flatMap((change) => change.value?.messages ?? []) ?? [];

  for (const message of messages) {
    const from = message.from;
    const text = extractText(message).trim();

    if (!from || !text) {
      continue;
    }

    const response = await handleIncomingWhatsAppMessage({
      from,
      message: text,
    });

    if (response.outboundMessage) {
      await sendWhatsAppText(from, response.outboundMessage);
    }
  }

  return NextResponse.json({ received: true });
}
