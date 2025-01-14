import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { serialize } from "cookie";
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

dotenv.config();

export async function POST(request: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET_KEY;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  try {
    const req = await request.json();
    const userFound = await prisma.user.findFirst({
      where: {
        email: req.email,
      },
    });
    if (userFound) {
      const passwordMatch = await bcrypt.compare(
        req.password,
        userFound.password
      );
      const userId = userFound.id;
      if (passwordMatch) {
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "365d" });
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600,
          path: "/",
        };
        const cookieHeader = serialize("token", token, cookieOptions);
        return NextResponse.json(
          { message: "Logado com sucesso." },
          { status: 200, headers: { "Set-Cookie": cookieHeader } }
        );
      }return NextResponse.json(
        { message: "Senha errada." },
        { status: 500}
      );
    }
    return NextResponse.json(
      { message: "Usuário não cadastrado." },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Não foi possível logar. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
