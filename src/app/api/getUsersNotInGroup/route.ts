import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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
    if (members.length>0) {
      return NextResponse.json({ members:members }, { status: 200 });
    }else{
      return NextResponse.json({members:[]},{status: 200})
    }
  } catch {
    return NextResponse.json({members:[]}, { status: 200 });
  }
}
