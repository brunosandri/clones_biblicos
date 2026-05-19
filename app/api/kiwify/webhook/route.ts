import { NextResponse } from "next/server";
import { upsertKiwifyAccess } from "@/lib/access-store";
import { createMagicLinkToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";
import { parseKiwifyWebhook } from "@/lib/kiwify";
import { getBase } from "@/lib/public-url";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "kiwify-webhook",
    methods: ["POST"]
  });
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Webhook nao autorizado." }, { status: 401 });
    }

    const payload = await parseJson(request);

    if (!payload) {
      return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
    }

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

    if (parsed.status === "active") {
      const user = {
        email: parsed.email,
        name: parsed.name ?? parsed.email
      };

      try {
        const token = await createMagicLinkToken(user, "/personagens");
        const base = getBase(request);
        const magicLink = new URL("/api/auth/magic-link/verify", base);
        magicLink.searchParams.set("token", token);
        await sendMagicLinkEmail({
          to: user.email,
          name: user.name,
          magicLink: magicLink.toString()
        });
      } catch (emailError) {
        console.error("Erro ao enviar email de boas-vindas", emailError);
      }
    }

    return NextResponse.json({
      ok: true,
      email: parsed.email,
      status: parsed.status,
      plan: parsed.plan,
      event: parsed.eventType
    });
  } catch (error) {
    console.error("Kiwify webhook error", error);
    return NextResponse.json(
      {
        error: "Erro ao processar webhook.",
        detail: error instanceof Error ? error.message : "Erro desconhecido."
      },
      { status: 500 }
    );
  }
}

async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
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
    request.headers.get("x-kiwify-token") ||
    request.headers.get("kiwify-token") ||
    request.headers.get("token") ||
    request.headers.get("x-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    url.searchParams.get("secret");

  return receivedSecret === secret;
}
