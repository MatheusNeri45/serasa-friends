import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const JWT_SECRET = process.env.JWT_SECRET_KEY;
    if (req.email) {
      const userFound = await prisma.user.findFirst({
        where: {
          email: req.email,
        },
      });
      if (userFound) {
        const userId = userFound.id;

        const token = JWT_SECRET
          ? jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" })
          : () => {
              throw new Error("No JWT");
            };
        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/update-password-forms?token=${token}`;
        const transporter = nodemailer.createTransport({
          host: "smtp.sendgrid.net",
          port: 587,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        });
        await transporter.sendMail(
          {
            from: process.env.MAIL_MAIL,
            to: req.email,
            subject: "Serasa-Friends - Reset Password Link",
            text: `Clique no link para redefinir sua senha: ${resetLink}`,
          },
          function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          }
        );
        return NextResponse.json(
          { message: "Password reset link sent to your e-mail." },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "No user registered with this email" },
          { status: 500 }
        );
      }
    }
  } catch {
    return NextResponse.json({ message: "Email not valid." }, { status: 500 });
  }
}
