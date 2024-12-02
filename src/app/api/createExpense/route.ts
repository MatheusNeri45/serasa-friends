import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "@prisma/client";
const prisma = new PrismaClient();

interface splitAmountUser extends User {
  splitAmount: number;
}

export async function POST(request: NextRequest) {
  const req = await request.json();

  try {
    let sumSplitParts = 0;
    req.debtors.forEach((user: splitAmountUser) => {
      sumSplitParts += user.splitAmount;
    });
    const numberDebtors = req.debtors.length;
    const expenseValue = req.expense.value;
    const debtorExpense =
      req.expense.splitType == "equally"
        ? req.debtors.map((debtor: User) => ({
            id: debtor.id,
            splitAmount: expenseValue / numberDebtors,
          }))
        : req.expense.splitType == "value"
        ? req.debtors
        : req.debtors.map((debtor: splitAmountUser) => ({
            id: debtor.id,
            splitAmount:
              (debtor.splitAmount * expenseValue) / sumSplitParts,
          }));
    const data = {
      ...req.expense,
      debtors: debtorExpense,
    };
    console.log(data)
    const payerInDebtor = data.debtors.filter(
      (debtor: User) => debtor.id === req.expense.userId
    )
    const valuePaid = payerInDebtor?payerInDebtor[0].splitAmount:0;

    const expense = await prisma.expense.create({
      data: {
        description: data.description,
        value: data.value,
        valuePaid: valuePaid,
        category: data.category,
        paidBy: {
          connect: { id: data.userId },
        },
        group: {
          connect: { id: data.groupId },
        },
        debtors: {
          createMany: {
            data: data.debtors.map(
              (debtor: { id: number; splitAmount: number }) => ({
                participantId: debtor.id,
                value: debtor.splitAmount,
                paid: debtor.id === data.userId ? true : false,
              })
            ),
          },
        },
      },
    });
    return NextResponse.json({
      message: "Expense created",
      expenseCreated: expense,
      status: 200,
    });
  } catch (error) {
    console.error("", error);
    return NextResponse.json({
      message: "Unable to create expense",
      status: 500,
    });
  }
}
