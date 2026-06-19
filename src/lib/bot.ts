import {
  createCustomerRequest,
  findQuickReply,
  getConversationSession,
  logMessage,
  matchServicePrice,
  saveConversationSession,
} from "@/lib/garage-data";
import type { ConversationSession, Intent } from "@/lib/types";
import type { WhatsAppOutbound } from "@/lib/whatsapp";

type StepChoice = {
  id: string;
  title: string;
  description?: string;
};

type FlowStep = {
  key: string;
  question: string;
  ui?: "text" | "buttons" | "list";
  buttonText?: string;
  choices?: StepChoice[];
};

const welcomeMenu: StepChoice[] = [
  {
    id: "service",
    title: "Car service",
    description: "Minor, major, engine and Benz service work",
  },
  {
    id: "assessment",
    title: "Diagnosis",
    description: "Fault finding, inspections and engine assessment",
  },
  {
    id: "parts",
    title: "Spare parts",
    description: "Mercedes-Benz parts, filters, brakes and more",
  },
  {
    id: "pricing",
    title: "Prices",
    description: "Service, labour and diagnostic estimates",
  },
  {
    id: "location",
    title: "Location",
    description: "Workshop address and operating hours",
  },
  {
    id: "human",
    title: "Talk to us",
    description: "Get handed over to a person",
  },
];

const mercedesModels = [
  "C180",
  "C200",
  "C250",
  "E200",
  "E320",
  "CLA",
  "ML",
  "GLA",
  "GLC",
  "Sprinter",
  "Other",
];

const conversationFlows: Record<
  Exclude<Intent, "unknown" | "location" | "human" | "pricing">,
  FlowStep[]
> = {
  service: [
    { key: "customer_name", question: "Please share your name first." },
    {
      key: "vehicle_brand",
      question: "Choose the vehicle brand below.",
      ui: "list",
      buttonText: "Choose brand",
      choices: [
        {
          id: "Mercedes-Benz",
          title: "Mercedes-Benz",
          description: "LuckyStar specialization",
        },
        { id: "Toyota", title: "Toyota" },
        { id: "Volvo", title: "Volvo" },
        { id: "BMW", title: "BMW" },
        { id: "Nissan", title: "Nissan" },
        { id: "Other", title: "Other" },
      ],
    },
    {
      key: "vehicle_model",
      question:
        "Choose a model below or type it if it is not listed. Mercedes-Benz models are prioritized here.",
      ui: "list",
      buttonText: "Choose model",
      choices: mercedesModels.map((model) => ({ id: model, title: model })),
    },
    { key: "vehicle_year", question: "What year is the car?" },
    {
      key: "engine_type",
      question: "Choose the engine type if known.",
      ui: "buttons",
      choices: [
        { id: "petrol", title: "Petrol" },
        { id: "diesel", title: "Diesel" },
        { id: "hybrid", title: "Hybrid" },
      ],
    },
    {
      key: "service_type",
      question: "Choose the service you need.",
      ui: "list",
      buttonText: "Choose service",
      choices: [
        {
          id: "Minor service",
          title: "Minor service",
          description: "Routine maintenance and checks",
        },
        {
          id: "Major service",
          title: "Major service",
          description: "Deep service for Mercedes-Benz and other brands",
        },
        {
          id: "Engine repair",
          title: "Engine repair",
          description: "Repairs, rebuilds and diagnosis",
        },
        {
          id: "Engine replacement",
          title: "Engine replacement",
          description: "Complete engine swap enquiry",
        },
        {
          id: "Brake service",
          title: "Brake service",
          description: "Pads, discs, sensors and fitting",
        },
        {
          id: "Suspension check",
          title: "Suspension check",
          description: "Arms, shocks and steering checks",
        },
        {
          id: "Oil change",
          title: "Oil change",
          description: "Quick service and filter replacement",
        },
        { id: "Other", title: "Other", description: "Type your own request" },
      ],
    },
    {
      key: "has_parts",
      question: "Do you already have the service parts?",
      ui: "buttons",
      choices: [
        { id: "yes", title: "Yes" },
        { id: "no", title: "No" },
      ],
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
    {
      key: "vehicle_brand",
      question: "Choose the vehicle brand below.",
      ui: "list",
      buttonText: "Choose brand",
      choices: [
        {
          id: "Mercedes-Benz",
          title: "Mercedes-Benz",
          description: "Diagnostics and specialist repair",
        },
        { id: "Toyota", title: "Toyota" },
        { id: "Volvo", title: "Volvo" },
        { id: "BMW", title: "BMW" },
        { id: "Nissan", title: "Nissan" },
        { id: "Other", title: "Other" },
      ],
    },
    { key: "vehicle_model", question: "What is the vehicle model?" },
    { key: "vehicle_year", question: "What year is the car?" },
    {
      key: "engine_type",
      question: "Choose the engine type if known.",
      ui: "buttons",
      choices: [
        { id: "petrol", title: "Petrol" },
        { id: "diesel", title: "Diesel" },
        { id: "hybrid", title: "Hybrid" },
      ],
    },
    {
      key: "problem_description",
      question:
        "What problem is the car showing? Example: overheating, no start, gearbox issue, smoke, knock.",
    },
    {
      key: "is_movable",
      question: "Is the car movable?",
      ui: "buttons",
      choices: [
        { id: "yes", title: "Yes" },
        { id: "no", title: "No" },
        { id: "needs towing", title: "Needs towing" },
      ],
    },
    { key: "preferred_date", question: "Which date do you want the assessment?" },
    {
      key: "location",
      question:
        "Will you bring the car to the workshop, or do you need a location visit? Share the location if needed.",
    },
  ],
  parts: [
    { key: "customer_name", question: "Please share your name first." },
    {
      key: "vehicle_brand",
      question: "Choose the vehicle brand below.",
      ui: "list",
      buttonText: "Choose brand",
      choices: [
        {
          id: "Mercedes-Benz",
          title: "Mercedes-Benz",
          description: "LuckyStar specialization",
        },
        { id: "Toyota", title: "Toyota" },
        { id: "Volvo", title: "Volvo" },
        { id: "BMW", title: "BMW" },
        { id: "Nissan", title: "Nissan" },
        { id: "Other", title: "Other" },
      ],
    },
    { key: "vehicle_model", question: "What is the vehicle model?" },
    { key: "vehicle_year", question: "What year is the car?" },
    {
      key: "engine_type",
      question: "Choose the engine type if known.",
      ui: "buttons",
      choices: [
        { id: "petrol", title: "Petrol" },
        { id: "diesel", title: "Diesel" },
        { id: "hybrid", title: "Hybrid" },
      ],
    },
    {
      key: "part_name",
      question:
        "Which part do you need? Example: brake pads, oil filter, engine mount, shocks, gearbox mount.",
    },
    {
      key: "part_condition",
      question: "What type of part do you want?",
      ui: "buttons",
      choices: [
        { id: "new", title: "New" },
        { id: "used", title: "Used" },
        { id: "either", title: "Either" },
      ],
    },
    {
      key: "needs_installation",
      question: "Do you also need installation?",
      ui: "buttons",
      choices: [
        { id: "yes", title: "Yes" },
        { id: "no", title: "No" },
      ],
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

  if (/(service|oil change|major service|minor service|brake service|engine replacement)/i.test(message)) {
    return "service";
  }

  if (/(assess|diagnos|check engine|overheat|no start|problem|fault|inspect)/i.test(message)) {
    return "assessment";
  }

  if (/(part|spare|brake pad|filter|plug|shock|control arm|sensor|engine mount)/i.test(message)) {
    return "parts";
  }

  if (/(price|cost|how much|quote|quotation)/i.test(message)) {
    return "pricing";
  }

  if (/(location|where|hours|open|close|working hours|map)/i.test(message)) {
    return "location";
  }

  if (/(person|human|call me|speak to someone|agent)/i.test(message)) {
    return "human";
  }

  return "unknown";
}

async function getWelcomeText() {
  const reply = await findQuickReply("greeting");
  const fallback =
    "Welcome to LuckyStar Garages. We specialize in Mercedes-Benz service, repairs, parts and engine replacement. Choose what you need below.";

  if (!reply?.message) {
    return fallback;
  }

  if (/reply with a number/i.test(reply.message)) {
    return fallback;
  }

  return reply.message;
}

function buildMenuOutbound(body: string): WhatsAppOutbound {
  return {
    kind: "list",
    body,
    buttonText: "Choose option",
    sections: [
      {
        title: "Workshop help",
        rows: welcomeMenu,
      },
    ],
  };
}

function buildStepOutbound(step: FlowStep): WhatsAppOutbound {
  if (step.ui === "buttons" && step.choices?.length) {
    return {
      kind: "buttons",
      body: step.question,
      buttons: step.choices.slice(0, 3).map((choice) => ({
        id: choice.id,
        title: choice.title,
      })),
    };
  }

  if (step.ui === "list" && step.choices?.length) {
    return {
      kind: "list",
      body: step.question,
      buttonText: step.buttonText ?? "Choose option",
      sections: [
        {
          title: "Available choices",
          rows: step.choices,
        },
      ],
    };
  }

  return {
    kind: "text",
    body: step.question,
  };
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

  return {
    kind: "text",
    body: `Thank you. Your request has been captured and our team will follow up shortly.${pricingNote} Reply menu anytime to start another request.`,
  } satisfies WhatsAppOutbound;
}

export async function handleIncomingWhatsAppMessage(input: {
  from: string;
  message: string;
}) {
  const welcomeText = await getWelcomeText();
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

    const outbound = buildMenuOutbound(welcomeText);
    await logMessage({
      phone: input.from,
      direction: "outgoing",
      textBody: outbound.body,
    });

    return { outbound };
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
        const outbound = await completeConversation(finalSession);

        await logMessage({
          phone: input.from,
          direction: "outgoing",
          textBody: outbound.body,
          intent: session.currentIntent,
        });

        return { outbound };
      }

      await saveConversationSession({
        phone: input.from,
        customerName,
        currentIntent: session.currentIntent,
        currentStep: nextStep.key,
        status: "active",
        collectedData,
      });

      const outbound = buildStepOutbound(nextStep);

      await logMessage({
        phone: input.from,
        direction: "outgoing",
        textBody: outbound.body,
        intent: session.currentIntent,
      });

      return { outbound };
    }
  }

  const detectedIntent = detectIntent(text);

  if (detectedIntent === "unknown") {
    const outbound = buildMenuOutbound(welcomeText);
    await logMessage({
      phone: input.from,
      direction: "outgoing",
      textBody: outbound.body,
    });
    return { outbound };
  }

  if (detectedIntent === "pricing") {
    const servicePrice = await matchServicePrice({ category: "service" });
    const assessmentPrice = await matchServicePrice({ category: "assessment" });
    const outbound = {
      kind: "list",
      body: `We can quote for Mercedes-Benz service, diagnosis, parts and engine work. ${
        servicePrice
          ? `Typical service labour starts from ${servicePrice.currency} ${servicePrice.priceMin}. `
          : ""
      }${
        assessmentPrice
          ? `Diagnostic assessment is usually ${assessmentPrice.currency} ${assessmentPrice.priceMin}${
              assessmentPrice.priceMax ? ` to ${assessmentPrice.priceMax}` : ""
            }. `
          : ""
      }Choose a path below for a more exact quote.`,
      buttonText: "Get a quote",
      sections: [
        {
          title: "Quote options",
          rows: welcomeMenu.filter((item) =>
            ["service", "assessment", "parts"].includes(item.id),
          ),
        },
      ],
    } satisfies WhatsAppOutbound;

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
      textBody: outbound.body,
      intent: detectedIntent,
    });

    return { outbound };
  }

  if (detectedIntent === "location") {
    const reply =
      (await findQuickReply("location"))?.message ??
      "LuckyStar Garages, 1 Hampden Street, Belvedere, Harare. Share your preferred date and we will confirm availability.";
    const outbound = {
      kind: "buttons",
      body: reply,
      buttons: [
        { id: "service", title: "Book service" },
        { id: "assessment", title: "Get diagnosis" },
        { id: "human", title: "Talk to us" },
      ],
    } satisfies WhatsAppOutbound;
    await logMessage({
      phone: input.from,
      direction: "outgoing",
      textBody: outbound.body,
      intent: detectedIntent,
    });
    return { outbound };
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

    const outbound = { kind: "text", body: reply } satisfies WhatsAppOutbound;
    await logMessage({
      phone: input.from,
      direction: "outgoing",
      textBody: outbound.body,
      intent: detectedIntent,
    });
    return { outbound };
  }

  const firstStep = conversationFlows[detectedIntent][0];
  const label =
    detectedIntent === "service"
      ? "car service"
      : detectedIntent === "assessment"
        ? "a mechanic assessment"
        : "spare parts";
  const firstPrompt = `You need ${label}. ${firstStep.question}`;
  const outbound = buildStepOutbound({
    ...firstStep,
    question: firstPrompt,
  });

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
    textBody: outbound.body,
    intent: detectedIntent,
  });

  return { outbound };
}
