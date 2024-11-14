import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    const updatedExpense = await prisma.expense.update({
      where: { id: req.expenseId },
      data: { paid: req.paid },
    });
    const updatedSplitExpenses = await prisma.splitExpense.updateMany({
      where: { expenseId: req.id },
      data: { paid: req.paid },
    });
    if (!updatedExpense || !updatedSplitExpenses) {
      return NextResponse.json(
        {
          message:
            "There is no expense registered with this ID in the database",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { expenseUpdated: updatedExpense },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to find split expenses for this expense." },
      { status: 500 }
    );
  }
}
