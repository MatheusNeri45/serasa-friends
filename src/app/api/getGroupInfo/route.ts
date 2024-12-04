import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const group = await prisma.group.findFirst({
      where: { id: req.groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        expenses: {
          include: {
            payer: true,
            shares: {
              include: {
                debtor: true,
              },
            },
          },
        },
      },
    });

    const formattedGroup = {
      ...group,
      createdAt: group?.createdAt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
    };

    if (!group) {
      return NextResponse.json({ group: [] }, { status: 200 });
    }
    return NextResponse.json({ group: formattedGroup }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ group: [] }, { status: 200 });
  }
}
