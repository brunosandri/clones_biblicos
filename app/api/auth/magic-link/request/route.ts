import { NextResponse } from "next/server";
import { findActiveAccessUserByEmail } from "@/lib/access-store";
import { createMagicLinkToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const nextPath = sanitizeNextPath(String(formData.get("next") ?? "/chat"));
  const user = await findActiveAccessUserByEmail(email);
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("sent", "1");
  loginUrl.searchParams.set("next", nextPath);

  if (user) {
    const token = await createMagicLinkToken(user, nextPath);
    const magicLink = new URL("/api/auth/magic-link/verify", request.url);
    magicLink.searchParams.set("token", token);
    await sendMagicLinkEmail({
      to: user.email,
      name: user.name,
      magicLink: magicLink.toString()
    });
  }

  return NextResponse.redirect(loginUrl, { status: 303 });
}

function sanitizeNextPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/chat";
  }

  if (value.startsWith("/api/") || value.startsWith("/login")) {
    return "/chat";
  }

  return value;
}
