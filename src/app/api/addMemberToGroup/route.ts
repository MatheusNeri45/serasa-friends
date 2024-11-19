import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {

  try {
    const req = await request.json();
    const numberDebtors = req.debtors.length;
    const expenseValue = req.expense.value;
    const debtorExpense = req.debtors.map((debtor: User) => ({
      id: debtor.id,
      splitNumber: expenseValue / numberDebtors,
    }));
    const data = {
      ...req.expense,
      debtors: debtorExpense,
    };
    const valuePaid = req.debtors.some(
      (debtor: User) => debtor.id === req.expense.userId
    )
      ? expenseValue / numberDebtors
      : 0;

    const expense = await prisma.expense.create({
      data: {
        description: data.description,
        value: data.value,
        valuePaid: valuePaid,
        paidBy: {
          connect: { id: data.userId },
        },
        group: {
          connect: { id: req.expense.groupId },
        },
        debtors: {
          createMany: {
            data: data.debtors.map(
              (debtor: { id: number; splitNumber: number }) => ({
                participantId: debtor.id,
                value: debtor.splitNumber,
                paid: debtor.id===data.userId?true:false,
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
