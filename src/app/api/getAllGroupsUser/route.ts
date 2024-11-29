import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            id: req.userId,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        members: true,
        expenses: {
          select: {
            id: true,
            description: true,
            value: true,
            valuePaid: true,
            createdAt: true,
            debtors: {
              include: {
                participant: true,
              },
            },
            paidBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    const formattedGroups = groups.map((group) => ({
      ...group,
      createdAt: group.createdAt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
    }));

    if (!groups) {
      return NextResponse.json({ groups: [] }, { status: 200 });
    }
    return NextResponse.json({ groups: formattedGroups }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ groups: [] }, { status: 200 });
  }
}
