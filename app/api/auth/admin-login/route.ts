import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, createSessionToken, getAdminEmails, getSessionMaxAge } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const secret = String(formData.get("secret") ?? "");
  const adminSecret = process.env.ADMIN_SECRET;
  const base = getBase(request);

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.redirect(`${base}/admin/login?error=1`, { status: 303 });
  }

  const adminEmail = getAdminEmails()[0];

  if (!adminEmail) {
    return NextResponse.redirect(`${base}/admin/login?error=1`, { status: 303 });
  }

  const response = NextResponse.redirect(`${base}/admin`, { status: 303 });
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

function getBase(request: Request): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }

  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "https";
  const fwdHost = request.headers.get("x-forwarded-host")?.split(",")[0];

  if (fwdHost) {
    return `${proto}://${fwdHost}`;
  }

  const host = request.headers.get("host");

  if (host && !host.startsWith("0.0.0.0") && host !== "::") {
    return `${proto}://${host}`;
  }

  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN ?? process.env.RAILWAY_STATIC_URL;

  if (railwayDomain) {
    return `https://${railwayDomain.replace(/^https?:\/\//, "")}`;
  }

  return new URL(request.url).origin;
}
