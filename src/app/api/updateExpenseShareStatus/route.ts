import { ExpenseShare } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    let paidCounter = 0;
    const expenseShareId = req.expenseShare.id;
    const expenseId = req.expenseShare.expenseId;
    const expenseShareAmount = req.expenseShare.amount;
    const expensesShareList = await prisma.expenseShare.findMany({
      where: {
        expenseId: expenseId,
      },
    });
    const expensesShareListLength = expensesShareList.length;
    expensesShareList.forEach((expenseShare: ExpenseShare) => {
      if (expenseShare.paid) {
        paidCounter++;
      }
    });
    const splitLeft = expensesShareListLength - paidCounter;
    if (splitLeft === 1) {
      await prisma.expense.update({
        where: { id: expenseId },
        data: {
          status: req.expenseShare.paid ? "PARTIALLY_PAID" : "PAID",
        },
      });
    } else if (splitLeft === 0) {
      await prisma.expense.update({
        where: { id: expenseId },
        data: {
          status: "PARTIALLY_PAID",
        },
      });
    }
    const updatedExpenseShare = await prisma.expenseShare.update({
      where: { id: expenseShareId },
      data: {
        paid: {
          set: !req.expenseShare.paid,
        },
        expense: {
          update: {
            paidAmount: {
              increment: req.expenseShare.paid
                ? -expenseShareAmount
                : expenseShareAmount,
            },
          },
        },
      },
    });
    if (!updatedExpenseShare) {
      return NextResponse.json(
        {
          message:
            "There is no expense registered with this ID in the database",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { updatedExpenseShare: updatedExpenseShare },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to find split expenses for this expense." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect;
  }
}
