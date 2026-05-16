import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { getPublicUrl } from "@/lib/public-url";

export async function POST(request: Request) {
  const response = NextResponse.redirect(getPublicUrl("/", request), { status: 303 });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
