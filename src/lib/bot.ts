import {
  createCustomerRequest,
  findQuickReply,
  getConversationSession,
  logMessage,
  matchServicePrice,
  saveConversationSession,
} from "@/lib/garage-data";
import type { ConversationSession, Intent } from "@/lib/types";

type FlowStep = {
  key: string;
  question: string;
};

const conversationFlows: Record<
  Exclude<Intent, "unknown" | "location" | "human" | "pricing">,
  FlowStep[]
> = {
  service: [
    { key: "customer_name", question: "Please share your name first." },
    {
      key: "vehicle_brand",
      question: "What is the vehicle brand? Example: Mercedes, Toyota, Volvo, BMW, Nissan.",
    },
    {
      key: "vehicle_model",
      question: "What is the vehicle model or make? Example: C180, CLA250, E320, Hilux, S40.",
    },
    { key: "vehicle_year", question: "What year is the car?" },
    {
      key: "engine_type",
      question: "What is the engine type if known? Reply with petrol, diesel, hybrid, or unknown.",
    },
    {
      key: "service_type",
      question: "Which service do you need? Example: minor service, major service, brake service, oil change, suspension check.",
    },
    {
      key: "has_parts",
      question: "Do you already have the service parts? Reply yes or no.",
    },
    { key: "preferred_date", question: "Which date would you prefer for the booking?" },
    { key: "preferred_time", question: "Which time works best for you?" },
    {
      key: "notes",
      question: "Please share any extra notes or symptoms. You can type none if not needed.",
    },
  ],
  assessment: [
    { key: "customer_name", question: "Please share your name first." },
    { key: "vehicle_brand", question: "What is the vehicle brand?" },
    { key: "vehicle_model", question: "What is the vehicle model?" },
    { key: "vehicle_year", question: "What year is the car?" },
    {
      key: "engine_type",
      question: "What is the engine type if known? Reply petrol, diesel, hybrid, or unknown.",
    },
    {
      key: "problem_description",
      question: "What problem is the car showing? Example: overheating, misfire, gearbox slipping, no start.",
    },
    {
      key: "is_movable",
      question: "Is the car movable? Reply yes, no, or needs towing.",
    },
    { key: "preferred_date", question: "Which date do you want the assessment?" },
    {
      key: "location",
      question: "Will you bring the car to the workshop, or do you need a location visit? Share the location if needed.",
    },
  ],
  parts: [
    { key: "customer_name", question: "Please share your name first." },
    { key: "vehicle_brand", question: "What is the vehicle brand?" },
    { key: "vehicle_model", question: "What is the vehicle model?" },
    { key: "vehicle_year", question: "What year is the car?" },
    {
      key: "engine_type",
      question: "What is the engine type if known? Reply petrol, diesel, hybrid, or unknown.",
    },
    {
      key: "part_name",
      question: "Which part do you need? Example: brake pads, oil filter, control arm, shocks.",
    },
    {
      key: "part_condition",
      question: "Do you need new parts, used parts, or either?",
    },
    {
      key: "needs_installation",
      question: "Do you also need us to fit the parts? Reply yes or no.",
    },
  ],
};

const numberedIntentMap: Record<string, Intent> = {
  "1": "service",
  "2": "assessment",
  "3": "parts",
  "4": "pricing",
  "5": "location",
  "6": "human",
};

function normalizeMessage(message: string) {
  return message.trim().toLowerCase();
}

function shouldReset(message: string) {
  const normalized = normalizeMessage(message);
  return ["hi", "hello", "hey", "start", "menu", "hie"].includes(normalized);
}

function detectIntent(message: string): Intent {
  const normalized = normalizeMessage(message);

  if (numberedIntentMap[normalized]) {
    return numberedIntentMap[normalized];
  }

  if (/(service|oil change|major service|minor service|brake service)/i.test(message)) {
    return "service";
  }

  if (/(assess|diagnos|check engine|overheat|no start|problem|fault|inspect)/i.test(message)) {
    return "assessment";
  }

  if (/(part|spare|brake pad|filter|plug|shock|control arm|sensor)/i.test(message)) {
    return "parts";
  }

  if (/(price|cost|how much|quote|quotation)/i.test(message)) {
    return "pricing";
  }

  if (/(location|where|hours|open|close|working hours)/i.test(message)) {
    return "location";
  }

  if (/(person|human|call me|speak to someone|agent)/i.test(message)) {
    return "human";
  }

  return "unknown";
}

async function getWelcomeMessage() {
  const reply = await findQuickReply("greeting");
  return (
    reply?.message ??
    "Good day sir/madam. Welcome to LuckyStar Garages. Reply with a number or type what you want: 1. Car service 2. Mechanic assessment / diagnosis 3. Spare parts 4. Prices 5. Location / working hours 6. Talk to a person"
  );
}

function findCurrentStep(session: ConversationSession) {
  if (!session.currentIntent || !(session.currentIntent in conversationFlows)) {
    return null;
  }

  const flow = conversationFlows[
    session.currentIntent as keyof typeof conversationFlows
  ];

  if (!session.currentStep) {
    return flow[0] ?? null;
  }

  return flow.find((step) => step.key === session.currentStep) ?? null;
}

function findNextStep(session: ConversationSession) {
  if (!session.currentIntent || !(session.currentIntent in conversationFlows)) {
    return null;
  }

  const flow = conversationFlows[
    session.currentIntent as keyof typeof conversationFlows
  ];

  const index = flow.findIndex((step) => step.key === session.currentStep);

  if (index < 0) {
    return flow[0] ?? null;
  }

  return flow[index + 1] ?? null;
}

async function completeConversation(session: ConversationSession) {
  const data = session.collectedData;
  const summary = [
    session.currentIntent ? `Request type: ${session.currentIntent}` : null,
    data.customer_name ? `Customer: ${data.customer_name}` : null,
    data.vehicle_brand ? `Brand: ${data.vehicle_brand}` : null,
    data.vehicle_model ? `Model: ${data.vehicle_model}` : null,
    data.vehicle_year ? `Year: ${data.vehicle_year}` : null,
    data.engine_type ? `Engine: ${data.engine_type}` : null,
    data.service_type ? `Service: ${data.service_type}` : null,
    data.part_name ? `Part: ${data.part_name}` : null,
    data.has_parts ? `Has parts: ${data.has_parts}` : null,
    data.problem_description ? `Problem: ${data.problem_description}` : null,
    data.preferred_date ? `Preferred date: ${data.preferred_date}` : null,
    data.preferred_time ? `Preferred time: ${data.preferred_time}` : null,
    data.location ? `Location: ${data.location}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  await createCustomerRequest(session, summary);

  let pricingNote = "";
  if (session.currentIntent === "service") {
    const match = await matchServicePrice({
      serviceType: data.service_type,
      vehicleBrand: data.vehicle_brand,
      vehicleModel: data.vehicle_model,
      engineType: data.engine_type,
      category: "service",
    });

    if (match) {
      pricingNote = ` Estimated labour is ${match.currency} ${match.priceMin}${
        match.priceMax ? ` to ${match.priceMax}` : ""
      }.`;
    }
  }

  if (session.currentIntent === "assessment") {
    const match = await matchServicePrice({
      serviceType: "diagnostic assessment",
      category: "assessment",
    });

    if (match) {
      pricingNote = ` Diagnostic assessment is usually ${match.currency} ${match.priceMin}${
        match.priceMax ? ` to ${match.priceMax}` : ""
      }.`;
    }
  }

  await saveConversationSession({
    phone: session.phone,
    customerName: session.customerName ?? data.customer_name ?? null,
    currentIntent: null,
    currentStep: null,
    status: "captured",
    collectedData: {},
  });

  return `Thank you. Your request has been captured and our team will follow up shortly.${pricingNote} Reply menu anytime to start another request.`;
}

export async function handleIncomingWhatsAppMessage(input: {
  from: string;
  message: string;
}) {
  const welcomeMessage = await getWelcomeMessage();
  const text = input.message.trim();

  await logMessage({
    phone: input.from,
    direction: "incoming",
    textBody: text,
  });

  if (shouldReset(text)) {
    await saveConversationSession({
      phone: input.from,
      currentIntent: null,
      currentStep: null,
      status: "active",
      collectedData: {},
    });

    await logMessage({
      phone: input.from,
      direction: "outgoing",
      textBody: welcomeMessage,
    });

    return { outboundMessage: welcomeMessage };
  }

  let session = await getConversationSession(input.from);

  if (!session) {
    session = {
      id: "",
      phone: input.from,
      customerName: null,
      currentIntent: null,
      currentStep: null,
      status: "active",
      collectedData: {},
    };
  }

  if (session.currentIntent && session.currentStep) {
    const currentStep = findCurrentStep(session);

    if (currentStep) {
      const collectedData = {
        ...session.collectedData,
        [currentStep.key]: text,
      };

      const customerName =
        currentStep.key === "customer_name"
          ? text
          : session.customerName ?? collectedData.customer_name ?? null;

      const updatedSession: ConversationSession = {
        ...session,
        customerName,
        collectedData,
      };

      const nextStep = findNextStep(updatedSession);

      if (!nextStep) {
        const finalSession: ConversationSession = {
          ...updatedSession,
          currentStep: currentStep.key,
        };
        const completion = await completeConversation(finalSession);

        await logMessage({
          phone: input.from,
          direction: "outgoing",
          textBody: completion,
          intent: session.currentIntent,
        });

        return { outboundMessage: completion };
      }

      await saveConversationSession({
        phone: input.from,
        customerName,
        currentIntent: session.currentIntent,
        currentStep: nextStep.key,
        status: "active",
        collectedData,
      });

      await logMessage({
        phone: input.from,
        direction: "outgoing",
        textBody: nextStep.question,
        intent: session.currentIntent,
      });

      return { outboundMessage: nextStep.question };
    }
  }

  const detectedIntent = detectIntent(text);

  if (detectedIntent === "unknown") {
    await logMessage({
      phone: input.from,
      direction: "outgoing",
      textBody: welcomeMessage,
    });
    return { outboundMessage: welcomeMessage };
  }

  if (detectedIntent === "pricing") {
    const servicePrice = await matchServicePrice({ category: "service" });
    const assessmentPrice = await matchServicePrice({ category: "assessment" });
    const message = `We can quote for service, diagnosis, and parts. ${
      servicePrice
        ? `Typical service labour starts from ${servicePrice.currency} ${servicePrice.priceMin}. `
        : ""
    }${
      assessmentPrice
        ? `Diagnostic assessment is usually ${assessmentPrice.currency} ${assessmentPrice.priceMin}${
            assessmentPrice.priceMax ? ` to ${assessmentPrice.priceMax}` : ""
          }. `
        : ""
    }Reply 1 for service, 2 for assessment, or 3 for spare parts for a more exact quote.`;

    await saveConversationSession({
      phone: input.from,
      currentIntent: null,
      currentStep: null,
      status: "active",
      collectedData: {},
    });

    await logMessage({
      phone: input.from,
      direction: "outgoing",
      textBody: message,
      intent: detectedIntent,
    });

    return { outboundMessage: message };
  }

  if (detectedIntent === "location") {
    const reply =
      (await findQuickReply("location"))?.message ??
      "LuckyStar Garages is available during our posted working hours. Share your preferred date and we will confirm availability.";
    await logMessage({
      phone: input.from,
      direction: "outgoing",
      textBody: reply,
      intent: detectedIntent,
    });
    return { outboundMessage: reply };
  }

  if (detectedIntent === "human") {
    const reply =
      (await findQuickReply("human_handoff"))?.message ??
      "Thank you. A team member from LuckyStar Garages will contact you shortly.";

    await saveConversationSession({
      phone: input.from,
      currentIntent: null,
      currentStep: null,
      status: "handoff",
      collectedData: {},
    });

    await logMessage({
      phone: input.from,
      direction: "outgoing",
      textBody: reply,
      intent: detectedIntent,
    });
    return { outboundMessage: reply };
  }

  const firstStep = conversationFlows[detectedIntent][0];
  const label =
    detectedIntent === "service"
      ? "car service"
      : detectedIntent === "assessment"
        ? "a mechanic assessment"
        : "spare parts";
  const openingPrompt = `You need ${label}. ${firstStep.question}`;

  await saveConversationSession({
    phone: input.from,
    currentIntent: detectedIntent,
    currentStep: firstStep.key,
    status: "active",
    collectedData: {},
  });

  await logMessage({
    phone: input.from,
    direction: "outgoing",
    textBody: openingPrompt,
    intent: detectedIntent,
  });

  return { outboundMessage: openingPrompt };
}
