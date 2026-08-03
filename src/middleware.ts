import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, getRegionFromCountryCode } from "./app/lib/market";

export function middleware(req: NextRequest) {
  if (req.cookies.get(COOKIE_NAME)) {
    return NextResponse.next();
  }

  const countryHeader = req.headers.get("x-vercel-ip-country");
  const region = countryHeader ? getRegionFromCountryCode(countryHeader) : "sweden";

  const res = NextResponse.next();
  res.cookies.set(COOKIE_NAME, region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: req.nextUrl.protocol === "https:",
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
