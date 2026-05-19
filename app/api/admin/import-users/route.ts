import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { upsertKiwifyAccess } from "@/lib/access-store";
import { SESSION_COOKIE_NAME, getAdminEmails, verifySessionToken } from "@/lib/auth";
import { createMagicLinkToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";
import { getBase } from "@/lib/public-url";

type ImportRow = {
  email: string;
  name?: string;
  plan?: "monthly" | "annual";
  sendEmail?: boolean;
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const adminEmails = getAdminEmails();

  if (!session || !adminEmails.includes(session.email)) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const body = await request.json() as { users: ImportRow[] };
  const rows: ImportRow[] = Array.isArray(body?.users) ? body.users : [];

  if (rows.length === 0) {
    return NextResponse.json({ error: "Nenhum usuario enviado." }, { status: 400 });
  }

  const results: { email: string; status: "ok" | "error"; detail?: string }[] = [];

  for (const row of rows) {
    const email = row.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      results.push({ email: row.email ?? "", status: "error", detail: "Email invalido." });
      continue;
    }

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (row.plan === "annual" ? 370 : 40));

      await upsertKiwifyAccess({
        email,
        name: row.name ?? email,
        status: "active",
        plan: row.plan ?? "monthly",
        orderId: null,
        subscriptionId: null,
        eventType: "manual-import",
        payload: { source: "manual-import", importedBy: session.email },
        accessExpiresAt: expiresAt
      });

      if (row.sendEmail !== false) {
        try {
          const token = await createMagicLinkToken({ email, name: row.name ?? email }, "/personagens");
          const base = getBase(request);
          const magicLink = new URL("/api/auth/magic-link/verify", base);
          magicLink.searchParams.set("token", token);
          await sendMagicLinkEmail({ to: email, name: row.name ?? email, magicLink: magicLink.toString() });
        } catch (emailError) {
          console.error("Erro ao enviar email para", email, emailError);
        }
      }

      results.push({ email, status: "ok" });
    } catch (error) {
      results.push({ email, status: "error", detail: error instanceof Error ? error.message : "Erro desconhecido." });
    }
  }

  return NextResponse.json({ results });
}
