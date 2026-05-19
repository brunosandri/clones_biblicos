import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, createSessionToken, getAdminEmails, getSessionMaxAge } from "@/lib/auth";
import { getPublicUrl } from "@/lib/public-url";

export async function POST(request: Request) {
  const formData = await request.formData();
  const secret = String(formData.get("secret") ?? "");
  const adminSecret = process.env.ADMIN_SECRET;
  const adminUrl = getPublicUrl("/admin", request);
  const loginUrl = getPublicUrl("/admin/login", request);

  if (!adminSecret || secret !== adminSecret) {
    loginUrl.searchParams.set("error", "1");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const adminEmail = getAdminEmails()[0];

  if (!adminEmail) {
    loginUrl.searchParams.set("error", "1");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const response = NextResponse.redirect(adminUrl, { status: 303 });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: await createSessionToken({ email: adminEmail, name: "Admin" }),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionMaxAge()
  });

  return response;
}
