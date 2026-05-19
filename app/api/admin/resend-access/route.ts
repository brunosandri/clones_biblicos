import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findActiveAccessUserByEmail } from "@/lib/access-store";
import { SESSION_COOKIE_NAME, getAdminEmails, verifySessionToken, createMagicLinkToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";
import { getBase } from "@/lib/public-url";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const adminEmails = getAdminEmails();

  if (!session || !adminEmails.includes(session.email)) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const { email } = await request.json() as { email: string };

  if (!email) {
    return NextResponse.json({ error: "Email obrigatorio." }, { status: 400 });
  }

  const user = await findActiveAccessUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: "Usuario nao encontrado ou sem acesso ativo." }, { status: 404 });
  }

  const token = await createMagicLinkToken(user, "/personagens");
  const base = getBase(request);
  const magicLink = new URL("/api/auth/magic-link/verify", base);
  magicLink.searchParams.set("token", token);

  await sendMagicLinkEmail({ to: user.email, name: user.name, magicLink: magicLink.toString() });

  return NextResponse.json({ ok: true, email: user.email });
}
