import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    console.log(req)
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
    const splitLeft = splitExpenseListLength - paidCounter
    if (splitLeft === 1) {
      //aqui pdem ser duas situações
      await prisma.expense.update({
        where: { id: expenseId },
        data: {
          paid: req.splitExpense.paid?false:true,
        },
      });
    }else if(splitLeft === 0){
      await prisma.expense.update({
        where: { id: expenseId },
        data: {
          paid: false,
        },
      });
    }
    const updatedSplitExpense = await prisma.splitExpense.update({
      where: { id: splitExpenseId },
      data: {
        paid: {
          set:!req.splitExpense.paid,
        },
        expense: {
          update: {
            valuePaid: {
              increment: req.splitExpense.paid?-splitExpenseValue:splitExpenseValue,
            },
          },
        },
      },
    });
    console.log(updatedSplitExpense)
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
