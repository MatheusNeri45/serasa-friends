import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const req = await request.json();
  try {
    const group = await prisma.group.create({
      data: {
        name: req.groupInfo.name,
        description: req.groupInfo.description || null,
        createdBy: {
          connect: { id: req.groupInfo.userId },
        },
        members: {
          connect: [
            ...(req.groupInfo.members||[]).map((member: User) => ({
              id: member.id,
            })),
          ],
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
  }
}
