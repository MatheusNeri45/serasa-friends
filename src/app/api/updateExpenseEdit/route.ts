import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SplitExpense, Expense, User } from "@prisma/client";

interface extendedExpenseSplits extends SplitExpense {
  participant: { name: string; id: number };
}

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    console.log(req.selectedExpense);
    const payerId = req.payerExpense.participantId;
    const updatedExpense = await prisma.expense.update({
      where: { id: req.selectedExpense.id },
      data: {
        paid: false,
        paidBy: {
          connect: { id: payerId },
        },
        valuePaid: req.payerExpense.value,
      },
    });
    const countUpdatedSplitExpense = await prisma.splitExpense.updateMany({
      where: { id: req.splitExpense.expenseId },
      data: {
        paid: req.splitExpense.participantId === payerId ? true : false,
      },
    });
    if (!countUpdatedSplitExpense || !updatedExpense) {
      return NextResponse.json(
        {
          message:
            "There is no expense nor split expense registered with this ID in the database",
        },
        { status: 200 }
      );
    }
    const updatedSplitExpenses = await prisma.splitExpense.findMany({
      where: { id: req.splitExpense.expenseId },
      include: {
        participant: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    return NextResponse.json(
      { splitExpense: updatedSplitExpenses, expense: updatedExpense },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to find split expenses for this expense." },
      { status: 200 }
    );
  }
}
