import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();

    const userAdded = await prisma.group.update({
      where: { id: req.groupId },
      data: {
        members: {
          connect: { id: req.userId },
        },
      },
    });
    if (userAdded) {
      const users = await prisma.group.findMany({
        where: { id: req.groupId },
        include: {
          members: true,
        },
      });
      return NextResponse.json({
        users: users,
        status: 200,
      });
    }
    return NextResponse.json({ users: [], status: 200 });
  } catch (error) {
    console.error("", error);
    return NextResponse.json({
      message: "Unable get users",
      status: 500,
    });
  }
}
