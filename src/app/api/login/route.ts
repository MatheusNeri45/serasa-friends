import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { serialize } from "cookie";

const prisma = new PrismaClient();

dotenv.config();

const JWT_SECRET =
  "053fb9e759de82f77ddaa8cf4c4bd051bd5775a32ea87bc62363623e571870416e3def3ae9e6bfef249096536abec6897b3a2fb79785a92901715a57f43cc2f5";

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
          // secure: process.env.NODE_ENV === "production",
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
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to register or find user" },
      { status: 500 }
    );
  }
}
