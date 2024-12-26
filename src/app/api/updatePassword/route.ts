import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function PATCH(request: NextRequest) {
  try {
    const req = await request.json();
    const token = req.token
    
    console.log(token)
    if (token) {
      console.log(token)
      const JWT_SECRET = process.env.JWT_SECRET_KEY;
      if (JWT_SECRET) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        const hashedPassword = await bcrypt.hash(req.password, 10);
        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: hashedPassword,
          },
        });
        if (updatedUser) {
          return NextResponse.json(
            { message: "Senha alterada com sucesso." },
            { status: 200 }
          );
        }
        return NextResponse.json(
          { message: "Não foi possível alterar sua senha, favor gerar o link novamente." },
          { status: 500 }
        );
      }
      return NextResponse.json({ message: "JWT not found." }, { status: 500 });
    }
    return NextResponse.json({ message: "Token not found." }, { status: 500 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating password" },
      { status: 500 }
    );
  }
}
