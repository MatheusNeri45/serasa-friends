import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function POST(request: NextRequest) {
  try{
  const JWT_SECRET = process.env.JWT_SECRET_KEY;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
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
      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
      };
      const cookieHeader = serialize("token", token, cookieOptions);

      return NextResponse.json(
        { message: "Login Successfull" },
        { status: 200, headers: { "Set-Cookie": cookieHeader } }
      );
    }
  }
    const hashedPassword = await bcrypt.hash(req.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: req.email,
        name: req.name,
        password: hashedPassword,
      },
    });
    if (newUser) {
      const userId = newUser.id;
      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
      };
      const cookieHeader = serialize("token", token, cookieOptions);
      return NextResponse.json(
        { message: "Login Successfull" },
        { status: 200, headers: { "Set-Cookie": cookieHeader } }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to register or find user" },
      { status: 200 }
    );
  }
}
