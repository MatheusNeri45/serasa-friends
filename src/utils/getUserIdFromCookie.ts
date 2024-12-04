import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
interface DecodedToken {
  userId: string;
}

export function getUserIdFromCookie(request: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET_KEY;
  const cookie = request.cookies.get("token"); // 'token' é o nome do cookie
  if (cookie) {
    const decoded = jwt.verify(cookie.value, JWT_SECRET) as DecodedToken;
    const userId = Number(decoded.userId);
    return userId;
  }

  return null;
}
