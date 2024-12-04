import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieOptions = {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    };
    const cookieHeader = serialize("token", "", cookieOptions);
    return NextResponse.json(
      { message: "Login Successfull" },
      { status: 200, headers: { "Set-Cookie": cookieHeader } }
    );

  } catch (error) {
    return NextResponse.json({ message: "Unable to logout" }, { status: 500 });
  }
}
