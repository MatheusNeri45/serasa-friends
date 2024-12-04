import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const members = await prisma.user.findMany({
      where: {
        memberships: {
          none: {
            groupId: req.groupId,
          },
        },
      },
    });
    if (members.length > 0) {
      return NextResponse.json({ members: members }, { status: 200 });
    } else {
      return NextResponse.json({ members: [] }, { status: 200 });
    }
  } catch {
    return NextResponse.json({ members: [] }, { status: 200 });
  } finally {
    await prisma.$disconnect;
  }
}
