import { PrismaClient } from "@prisma/client";
import bcrypt  from "bcrypt";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try{
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
    if (passwordMatch) {
      return NextResponse.json({ userFound }, { status: 200 });
    }
  }
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to register or find user" },
      { status: 200 }
    );
  }
}
