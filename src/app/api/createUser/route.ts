import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const req = await request.json();
  const userFound = await prisma.user.findFirst({
    where: {
      email: req.email,
    },
  });
  if (userFound) {
    bcrypt.compare(req.body.password, "superSecret", () => {
      if (req.body.password != userFound.password) {
        return NextResponse.json(
          { message: "Passwords do not match." },
          { status: 200 }
        );
      }
      return NextResponse.json({ userFound }, { status: 200 });
    });
  }
  try {
    const user = await prisma.user.create({
      data: {
        email: req.email,
        name: req.name,
        password: bcrypt.hashSync(req.password, 10),
      },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to register user" },
      { status: 500 }
    );
  }
}
