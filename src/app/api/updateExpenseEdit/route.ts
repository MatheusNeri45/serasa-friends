import { ExpenseShare, PrismaClient } from "@prisma/client";
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

    const { expense, shares } = req;
    const numberDebtors = shares.length;
    const expenseValue = expense.value;

    const debtorExpense = shares.map((share: ExpenseShare) => ({
      id: share.id,
      value: expenseValue / numberDebtors,
    }));

    const valuePaid = shares.some(
      (share: ExpenseShare) => share.debtorId === expense.userId
    )
      ? expenseValue / numberDebtors
      : 0;

    const updatedExpense = await prisma.expense.update({
      where: { id: expense.id },
      data: {
        description: expense.description,
        amount: expense.value,
        paidAmount: valuePaid,
        payer: {
          connect: { id: expense.userId },
        },
        shares: {
          deleteMany: { expenseId: expense.id },
          create: debtorExpense.map((share: ExpenseShare) => ({
            debtorId: share.debtorId,
            amount: share.amount,
            paid: share.debtorId === expense.userId,
          })),
        },
      },
      include: {
        payer: true,
        shares: {
          include: {
            debtor: true,
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
