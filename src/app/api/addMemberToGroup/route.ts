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
    { message: "Caloteiro adicionado com sucesso." },
    { status: 200 }
  );
}catch (error) {
  console.error("", error);
  return NextResponse.json({
    message: "O calote é real, não foi possível adicionar o seu amigo ao grupo.",
    status: 500,
  });
}
}
