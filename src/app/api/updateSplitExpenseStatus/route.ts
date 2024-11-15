import { Update } from "@mui/icons-material";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    let paidCounter = 0;
    const splitExpenseId = req.splitExpense.id;
    const expenseId = req.splitExpense.expenseId;
    const splitExpenseValue = req.splitExpense.value;
    const splitExpenseList = await prisma.splitExpense.findMany({
      where: {
        expenseId: expenseId,
      },
    });
    const splitExpenseListLength = splitExpenseList.length;
    splitExpenseList.forEach((element) => {
      if (element.paid) {
        paidCounter++;
      }
    });
    if (splitExpenseListLength - paidCounter === 1) {
      await prisma.expense.update({
        where: { id: expenseId },
        data: {
          paid: true,
        },
      });
    }
    const updatedSplitExpense = await prisma.splitExpense.update({
      where: { id: splitExpenseId },
      data: {
        paid: req.paid,
        expense: {
          update: {
            valuePaid: {
              increment: splitExpenseValue,
            },
          },
        },
      },
    });
    if (!updatedSplitExpense) {
      return NextResponse.json(
        {
          message:
            "There is no expense registered with this ID in the database",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { updatedSplitExpense: updatedSplitExpense },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to find split expenses for this expense." },
      { status: 500 }
    );
  }
}
