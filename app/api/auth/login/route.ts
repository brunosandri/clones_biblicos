import { NextResponse } from "next/server";
import { getPublicUrl } from "@/lib/public-url";

export async function POST(request: Request) {
  return NextResponse.redirect(getPublicUrl("/login", request), { status: 303 });
}
