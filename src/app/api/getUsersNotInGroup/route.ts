import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    console.log(req.groupId)
    const members = await prisma.user.findMany({
      where: {
        groups: {
          none: {
            id: req.groupId,
          },
        },
      },
    });
    if (members) {
      return NextResponse.json({ members }, { status: 200 });
    }
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}
