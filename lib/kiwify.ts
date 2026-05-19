const ACTIVE_EVENTS = [
  "order_approved",
  "subscription_renewed",
  "compra aprovada",
  "compra_aprovada",
  "venda aprovada",
  "venda_aprovada",
  "pagamento aprovado",
  "pagamento_aprovado",
  "assinatura renovada",
  "assinatura_renovada",
  "renovada",
  "subscription renewed",
  "order paid",
  "paid",
  "approved"
];

const INACTIVE_EVENTS = [
  "reembolso",
  "chargeback",
  "compra recusada",
  "compra_recusada",
  "pagamento recusado",
  "pagamento_recusado",
  "assinatura cancelada",
  "assinatura_cancelada",
  "assinatura atrasada",
  "assinatura_atrasada",
  "cancelada",
  "atrasada",
  "refunded",
  "canceled",
  "cancelled",
  "order_refunded",
  "subscription_cancelled",
  "subscription_canceled",
  "overdue"
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
  const data = toRecord(record.data) ?? toRecord(record.Data);
  const source = data ?? record;
  const eventType =
    firstString(record, ["event", "event_type", "webhook_event_type", "type"]) ??
    firstString(source, ["event", "event_type", "webhook_event_type", "type", "status", "order_status"]) ??
    "";
  const customer = toRecord(record.customer) ?? toRecord(record.Customer) ?? toRecord(record.buyer) ?? toRecord(record.client);
  const dataCustomer = toRecord(source.customer) ?? toRecord(source.Customer) ?? toRecord(source.buyer) ?? toRecord(source.client);
  const product = toRecord(source.product) ?? toRecord(source.Product);
  const subscription = toRecord(source.subscription) ?? toRecord(source.Subscription);
  const order = toRecord(source.order) ?? toRecord(source.Order) ?? source;
  const email =
    firstString(source, ["email", "customer_email", "buyer_email", "client_email"]) ??
    firstString(dataCustomer, ["email"]) ??
    firstString(customer, ["email"]) ??
    findDeepString(source, ["email"]) ??
    null;
  const name =
    firstString(source, ["name", "customer_name", "buyer_name", "client_name"]) ??
    firstString(dataCustomer, ["name", "full_name"]) ??
    firstString(customer, ["name", "full_name"]) ??
    email;
  const orderId = firstString(order, ["id", "order_id", "order_ref", "code", "reference"]) ?? null;
  const subscriptionId =
    firstString(subscription, ["id", "subscription_id", "code"]) ??
    firstString(record, ["subscription_id"]) ??
    null;
  const plan = inferPlan(source, product);
  const status = inferStatus(eventType || JSON.stringify(source));

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

function findDeepString(value: unknown, keys: string[]): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findDeepString(item, keys);

      if (found) {
        return found;
      }
    }

    return null;
  }

  const record = value as Record<string, unknown>;
  const directValue = firstString(record, keys);

  if (directValue) {
    return directValue;
  }

  for (const nestedValue of Object.values(record)) {
    const found = findDeepString(nestedValue, keys);

    if (found) {
      return found;
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
