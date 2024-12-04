
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import { PrismaClient } from '@prisma/client';

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

interface splitAmountUser extends User {
  splitAmount: number;
}

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
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
            splitAmount: (debtor.splitAmount * expenseValue) / sumSplitParts,
          }));
    const data = {
      ...req.expense,
      debtors: debtorExpense,
    };
    const payerInDebtor = data.debtors.filter(
      (debtor: User) => debtor.id === req.expense.payerId
    );
    const valuePaid = payerInDebtor ? payerInDebtor[0].splitAmount : 0;

    const expense = await prisma.expense.create({
      data: {
        description: data.description,
        amount: data.value,
        paidAmount: valuePaid,
        category: data.category,
        payer: {
          connect: { id: data.payerId },
        },
        group: {
          connect: { id: data.groupId },
        },
        shares: {
          createMany: {
            data: data.debtors.map(
              (debtor: { id: number; splitAmount: number }) => ({
                debtorId: debtor.id,
                amount: debtor.splitAmount,
                paid: debtor.id === data.payerId ? true : false,
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
