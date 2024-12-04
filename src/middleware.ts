import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("token");
  if (!cookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
export const config = {
  matcher: ["/dashboard/:path*"],
};
