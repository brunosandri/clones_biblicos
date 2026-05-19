import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getAdminEmails, verifySessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const adminEmails = getAdminEmails();

  if (!session || !adminEmails.includes(session.email)) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const magicLinkFrom = process.env.MAGIC_LINK_FROM;

  if (!resendKey) {
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY não está configurada no Railway." });
  }

  if (!magicLinkFrom) {
    return NextResponse.json({ ok: false, error: "MAGIC_LINK_FROM não está configurada no Railway." });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: magicLinkFrom,
      to: session.email,
      subject: "Teste de email — Clones da Bíblia",
      html: `
        <div style="font-family: Arial, sans-serif; color: #17201d; padding: 24px;">
          <h2>Email de teste</h2>
          <p>Se você recebeu este email, a integração com a Resend está funcionando corretamente.</p>
          <p style="color: #888; font-size: 12px;">Enviado em ${new Date().toLocaleString("pt-BR")}</p>
        </div>
      `
    })
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: data?.message ?? "Resend retornou erro.", detail: data });
  }

  return NextResponse.json({ ok: true, sentTo: session.email, resendId: data.id });
}
