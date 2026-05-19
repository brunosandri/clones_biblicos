import { NextResponse } from "next/server";
import { findActiveAccessUserByEmail } from "@/lib/access-store";
import { createMagicLinkToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";
import { getBase } from "@/lib/public-url";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const nextPath = sanitizeNextPath(String(formData.get("next") ?? "/personagens"));
  const base = getBase(request);
  const loginUrl = new URL("/login", base);
  loginUrl.searchParams.set("sent", "1");
  loginUrl.searchParams.set("next", nextPath);

  const user = await findActiveAccessUserByEmail(email);

  if (user) {
    try {
      const token = await createMagicLinkToken(user, nextPath);
      const magicLink = new URL("/api/auth/magic-link/verify", base);
      magicLink.searchParams.set("token", token);
      await sendMagicLinkEmail({
        to: user.email,
        name: user.name,
        magicLink: magicLink.toString()
      });
    } catch (error) {
      console.error("Erro ao enviar link magico", error);
    }
  }

  return NextResponse.redirect(loginUrl, { status: 303 });
}

function sanitizeNextPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/personagens";
  }

  if (value.startsWith("/api/") || value.startsWith("/login")) {
    return "/personagens";
  }

  return value;
}
