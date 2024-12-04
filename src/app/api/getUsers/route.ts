import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function GET() {
  try{
  const users = await prisma.user.findMany();
  return NextResponse.json({ users }, { status: 200 });
}catch (error) {
  return NextResponse.json(
    { message: "Unable to get users" },
    { status: 200 }
  );
}
}