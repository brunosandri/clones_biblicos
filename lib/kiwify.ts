const ACTIVE_EVENTS = [
  "compra aprovada",
  "venda aprovada",
  "pagamento aprovado",
  "assinatura renovada",
  "renovada",
  "subscription renewed",
  "order paid",
  "paid"
];

const INACTIVE_EVENTS = [
  "reembolso",
  "chargeback",
  "compra recusada",
  "pagamento recusado",
  "assinatura cancelada",
  "assinatura atrasada",
  "cancelada",
  "atrasada",
  "refunded",
  "canceled",
  "cancelled",
  "overdue",
  "chargeback"
];

export type ParsedKiwifyWebhook = {
  eventType: string;
  email: string | null;
  name: string | null;
  status: "active" | "inactive" | "ignored";
  plan: string | null;
  orderId: string | null;
  subscriptionId: string | null;
  accessExpiresAt: Date | null;
};

export function parseKiwifyWebhook(payload: unknown): ParsedKiwifyWebhook {
  const record = toRecord(payload) ?? {};
  const eventType = firstString(record, ["event", "event_type", "webhook_event_type", "type", "status", "order_status"]) ?? "";
  const customer = toRecord(record.customer) ?? toRecord(record.Customer) ?? toRecord(record.buyer) ?? toRecord(record.client);
  const product = toRecord(record.product) ?? toRecord(record.Product);
  const subscription = toRecord(record.subscription) ?? toRecord(record.Subscription);
  const order = toRecord(record.order) ?? toRecord(record.Order) ?? record;
  const email =
    firstString(record, ["email", "customer_email", "buyer_email"]) ??
    firstString(customer, ["email"]) ??
    null;
  const name =
    firstString(record, ["name", "customer_name", "buyer_name"]) ??
    firstString(customer, ["name", "full_name"]) ??
    email;
  const orderId = firstString(order, ["id", "order_id", "order_ref", "code", "reference"]) ?? null;
  const subscriptionId =
    firstString(subscription, ["id", "subscription_id", "code"]) ??
    firstString(record, ["subscription_id"]) ??
    null;
  const plan = inferPlan(record, product);
  const status = inferStatus(eventType || JSON.stringify(record));

  return {
    eventType: eventType || "unknown",
    email,
    name,
    status,
    plan,
    orderId,
    subscriptionId,
    accessExpiresAt: status === "active" ? inferAccessExpiration(plan) : null
  };
}

function inferStatus(value: string): "active" | "inactive" | "ignored" {
  const normalizedValue = normalize(value);

  if (INACTIVE_EVENTS.some((event) => normalizedValue.includes(normalize(event)))) {
    return "inactive";
  }

  if (ACTIVE_EVENTS.some((event) => normalizedValue.includes(normalize(event)))) {
    return "active";
  }

  return "ignored";
}

function inferPlan(record: Record<string, unknown>, product?: Record<string, unknown>): string | null {
  const planText = [
    firstString(record, ["plan", "offer_name", "product_name"]),
    firstString(product, ["name", "title"]),
    firstString(record, ["checkout_url", "checkout_link"])
  ]
    .filter(Boolean)
    .join(" ");
  const normalizedPlan = normalize(planText);

  if (normalizedPlan.includes("zimm1d9") || normalizedPlan.includes("anual") || normalizedPlan.includes("annual")) {
    return "annual";
  }

  if (normalizedPlan.includes("hjxtoaf") || normalizedPlan.includes("mensal") || normalizedPlan.includes("monthly")) {
    return "monthly";
  }

  return null;
}

function inferAccessExpiration(plan: string | null) {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + (plan === "annual" ? 370 : 40));
  return expiration;
}

function firstString(record: Record<string, unknown> | undefined, keys: string[]) {
  if (!record) {
    return null;
  }

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return null;
}

function toRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
