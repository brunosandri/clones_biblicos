import { NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionMaxAge,
  SESSION_COOKIE_NAME,
  validateCredentials
} from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeNextPath(String(formData.get("next") ?? "/chat"));
  const user = validateCredentials(email, password);

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "1");
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), { status: 303 });
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
    return "/chat";
  }

  if (value.startsWith("/api/") || value.startsWith("/login")) {
    return "/chat";
  }

  return value;
}
