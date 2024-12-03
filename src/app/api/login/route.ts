import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import cookie from "cookie";

const prisma = new PrismaClient();

dotenv.config();

const JWT_SECRET: string = ;

export async function POST(request: NextRequest) {
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
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600,
          path: "/",
        };
        const cookieHeader = cookie.serialize("token", token, cookieOptions);

        return NextResponse.json(
          { message: "Login Successfull" },
          { status: 200, headers: { "Set-Cookie": cookieHeader } }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to register or find user" },
      { status: 200 }
    );
  }
}
