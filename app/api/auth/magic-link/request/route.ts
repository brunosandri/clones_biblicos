import { NextResponse } from "next/server";
import { findActiveAccessUserByEmail } from "@/lib/access-store";
import { createMagicLinkToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";
import { getPublicUrl } from "@/lib/public-url";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const nextPath = sanitizeNextPath(String(formData.get("next") ?? "/personagens"));
  const user = await findActiveAccessUserByEmail(email);
  const loginUrl = getPublicUrl("/login", request);
  loginUrl.searchParams.set("sent", "1");
  loginUrl.searchParams.set("next", nextPath);

  if (user) {
    const token = await createMagicLinkToken(user, nextPath);
    const magicLink = getPublicUrl("/api/auth/magic-link/verify", request);
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
    return "/personagens";
  }

  if (value.startsWith("/api/") || value.startsWith("/login")) {
    return "/personagens";
  }

  return value;
}
