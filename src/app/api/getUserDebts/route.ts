import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  // Task de amanhã ajeitar essa função
  const req = await request.json();
  const userId = Number(req.id);
  const idExists = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!idExists) {
    return NextResponse.json(
      { message: "There is no user registered with this ID in the database" },
      { status: 404 }
    );
  }
  try {
    const debt = await prisma.expense.findMany({
      where: {
        NOT: { userId: userId },
      },
    });
    return NextResponse.json(
      { message: "User expenses", debtList: debt },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to find expenses for this user." },
      { status: 500 }
    );
  }
}
