import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const groupInfo = await prisma.group.findFirst({
      where: {
        id: req.groupId,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    const members = groupInfo?.members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
    }));
    if (groupInfo) {
      return NextResponse.json(
        { members: members },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json({ members: [] }, { status: 200 });
  }
}
