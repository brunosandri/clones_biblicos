import { NextResponse } from "next/server";
import { upsertKiwifyAccess } from "@/lib/access-store";
import { parseKiwifyWebhook } from "@/lib/kiwify";

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Webhook nao autorizado." }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = parseKiwifyWebhook(payload);

  if (!parsed.email) {
    return NextResponse.json({ error: "Payload sem email do comprador." }, { status: 400 });
  }

  if (parsed.status === "ignored") {
    return NextResponse.json({ ok: true, ignored: true, event: parsed.eventType });
  }

  await upsertKiwifyAccess({
    email: parsed.email,
    name: parsed.name,
    status: parsed.status,
    plan: parsed.plan,
    orderId: parsed.orderId,
    subscriptionId: parsed.subscriptionId,
    eventType: parsed.eventType,
    payload,
    accessExpiresAt: parsed.accessExpiresAt
  });

  return NextResponse.json({
    ok: true,
    email: parsed.email,
    status: parsed.status,
    plan: parsed.plan,
    event: parsed.eventType
  });
}

function isAuthorized(request: Request) {
  const secret = process.env.KIWIFY_WEBHOOK_SECRET;

  if (!secret) {
    return true;
  }

  const url = new URL(request.url);
  const receivedSecret =
    request.headers.get("x-webhook-secret") ||
    request.headers.get("x-kiwify-secret") ||
    request.headers.get("token") ||
    request.headers.get("x-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    url.searchParams.get("secret");

  return receivedSecret === secret;
}
