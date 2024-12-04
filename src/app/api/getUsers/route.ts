import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json({ users }, { status: 200 });
}
