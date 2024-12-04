import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;


export async function POST(request: NextRequest) {
  try{
  const req = await request.json();
  const groupUpdated = await prisma.group.update({
    where: {
      id: req.groupId,
    },
    data: {
      members: {
        create: { user: { connect: { email: req.email } } },
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
}catch (error) {
  console.error("", error);
  return NextResponse.json({
    message: "Unable to add member",
    status: 500,
  });
}finally{
  await prisma.$disconnect
}
}
