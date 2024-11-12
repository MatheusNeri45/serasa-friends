import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  // Task de amanhã ajeitar essa função
  try {
    const req = await request.json();
    const splitExpenses = await prisma.splitExpense.findMany({
      where: { expenseId: req.expenseId },
    });

    if (!splitExpenses) {
      return NextResponse.json(
        { message: "There is no expense registered with this ID in the database" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { splitExpenseList: splitExpenses },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to find split expenses for this expense." },
      { status: 500 }
    );
  }
}
