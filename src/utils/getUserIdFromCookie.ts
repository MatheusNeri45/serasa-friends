import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
interface DecodedToken {
  userId: string;
}

const JWT_SECRET =
  "053fb9e759de82f77ddaa8cf4c4bd051bd5775a32ea87bc62363623e571870416e3def3ae9e6bfef249096536abec6897b3a2fb79785a92901715a57f43cc2f5";

export function getUserIdFromCookie(request: NextRequest) {
  const cookie = request.cookies.get("token"); // 'token' é o nome do cookie
  if (cookie) {
    const decoded = jwt.verify(cookie.value, JWT_SECRET) as DecodedToken;
    const userId = Number(decoded.userId);
    return userId;
  }

  return null;
}
