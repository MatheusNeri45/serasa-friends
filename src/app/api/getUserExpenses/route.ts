import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const userId = parseInt(request.headers.get("userId") || "0");
  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required to get its expenses" },
      { status: 400 }
    );
  }
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
    const expense = await prisma.splitExpense.findMany({
      where: { participantId: userId },
    });
    return NextResponse.json(
      { message: 'User expenses', expenseFound: expense },
      { status: 200 }
    );
  } catch (error) {
    console.error("", error);
    return NextResponse.json(
      { message: "Unable to find expenses for this user." },
      { status: 500 }
    );
  }
}
