import { NextResponse } from "next/server";
import { findActiveAccessUserByEmail } from "@/lib/access-store";
import {
  createSessionToken,
  getSessionMaxAge,
  SESSION_COOKIE_NAME,
  verifyMagicLinkToken
} from "@/lib/auth";
import { getPublicUrl } from "@/lib/public-url";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const payload = await verifyMagicLinkToken(url.searchParams.get("token"));
  const user = payload ? await findActiveAccessUserByEmail(payload.email) : null;

  if (!payload || !user) {
    const loginUrl = getPublicUrl("/login", request);
    loginUrl.searchParams.set("error", "link");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const response = NextResponse.redirect(getPublicUrl(sanitizeNextPath(payload.next), request), { status: 303 });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: await createSessionToken(user),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionMaxAge()
  });

  return response;
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
