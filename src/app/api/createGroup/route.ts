import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import { getUserIdFromCookie } from "@/utils/getUserIdFromCookie";
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const userId = getUserIdFromCookie(request);
    const group = await prisma.group.create({
      data: {
        name: req.groupInfo.name,
        description: req.groupInfo.description || null,
        owner: {
          connect: { id: Number(userId) },
        },
        members: {
          createMany: {
            data: [
              ...(req.groupInfo.members || []).map((member: User) => ({
                userId: member.id,
              })),
            ],
          },
        },
      },
    });
    return NextResponse.json(
      { message: "Group created", groupCreated: group },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to create group" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect;
  }
}
