import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const userId = req.userId;
    const foundGroups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (!foundGroups) {
      return NextResponse.json({ groupList: [] }, { status: 200 });
    }
    return NextResponse.json({ groupList: foundGroups }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ groupList: [] }, { status: 200 });
  }
}
