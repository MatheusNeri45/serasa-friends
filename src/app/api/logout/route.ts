import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    };
    const cookieHeader = serialize("token", "", cookieOptions);
    return NextResponse.json(
      { message: "Deslogado com sucesso." },
      { status: 200, headers: { "Set-Cookie": cookieHeader } }
    );
  } catch (error) {
    return NextResponse.json({ message: "Não foi possível deslogar." }, { status: 500 });
  }
}
