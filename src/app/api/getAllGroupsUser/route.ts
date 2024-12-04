import { getUserIdFromCookie } from "@/utils/getUserIdFromCookie";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  //NOTE ADICIONAR USERID AQUI
  const userId = getUserIdFromCookie(request);
  try {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: Number(userId),
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
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
          select: {
            id: true,
            description: true,
            amount: true,
            paidAmount: true,
            createdAt: true,
            shares: {
              include: {
                debtor: true,
              },
            },
            payer: {
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
