import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const req = await request.json();
  const groupUpdated = await prisma.group.update({
    where: {
      id: req.groupId,
    },
    data: {
      members: {
        connect: {
          email: req.email,
        },
      },
    },
  });
  if (groupUpdated) {
    return NextResponse.json({ groupUpdated }, { status: 200 });
  }
  return NextResponse.json(
    { message: "Unable to register or find user" },
    { status: 200 }
  );
}
