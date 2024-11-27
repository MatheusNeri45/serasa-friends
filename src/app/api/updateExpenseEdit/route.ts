import { PrismaClient, SplitExpense } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
  try {
    const req = await request.json();

    if (!req.debtors || !req.expense) {
      return NextResponse.json(
        { message: "'debtors' and 'expense' are required." },
        { status: 400 }
      );
    }

    const { expense, debtors } = req;
    const numberDebtors = debtors.length;
    const expenseValue = expense.value;

    const debtorExpense = debtors.map((debtor: { id: number }) => ({
      id: debtor.id,
      value: expenseValue / numberDebtors,
    }));

    const valuePaid = debtors.some(
      (debtor: { id: number }) => debtor.id === expense.userId
    )
      ? expenseValue / numberDebtors
      : 0;

    const updatedExpense = await prisma.expense.update({
      where: { id: expense.id },
      data: {
        description: expense.description,
        value: expense.value,
        valuePaid: valuePaid,
        paidBy: {
          connect: { id: expense.userId },
        },
        debtors: {
          deleteMany: { expenseId: expense.id },
          create: debtorExpense.map((debtor: SplitExpense) => ({
            participantId: debtor.id,
            value: debtor.value,
            paid: debtor.id === expense.userId,
          })),
        },
      },
      include: {
        paidBy: true,
        debtors: {
          include: {
            participant: true,
          },
        },
      },
    });

    return NextResponse.json({ updatedExpense }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        message: "An error occurred while updating the expense.",
      },
      { status: 500 }
    );
  }
}
