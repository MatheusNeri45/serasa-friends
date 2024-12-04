import { getUserIdFromCookie } from "@/utils/getUserIdFromCookie";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const userId = getUserIdFromCookie(request);
  try {
    const user = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({ user: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
