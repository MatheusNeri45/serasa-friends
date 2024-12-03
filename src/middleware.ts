import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("token");
  if (!cookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const token = cookie.value
    const decoded = jwt.verify(token, JWT_SECRET);

    // Se o token for válido, você pode adicionar o userId ao request
    request.userId = decoded.userId;

    return NextResponse.next();
  } catch (error) {
    // Se o token for inválido, redireciona para a página de login
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
