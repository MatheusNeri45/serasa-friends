import { PrismaClient, User } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
  try {
    const req = await request.json();

    if (!req.shares || !req.expense) {
      return NextResponse.json(
        { message: "'debtors' and 'expense' are required." },
        { status: 400 }
      );
    }
    //NOTE ADICIONAR AQUI  LÓGICA PARA QUANDO ELE MUDAR O TIPO DE SPLIT
    const { expense, shares } = req;
    const numberShares = shares.length;
    const expenseAmount = expense.amount;
    const shareExpense = shares.map((share: User) => ({
      debtorId: share.id,
      amount: expenseAmount / numberShares,
    }));
    const paidAmount = shares.some(
      (share: User) => share.id === expense.payerId
    )
      ? expenseAmount / numberShares
      : 0;

    const updatedExpense = await prisma.expense.update({
      where: { id: expense.id },
      data: {
        description: expense.description,
        amount: expense.amount,
        paidAmount: paidAmount,
        payer: {
          connect: { id: expense.payerId },
        },
        shares: {
          deleteMany: {},
          //NOTE ADICIONAR TIPO AQUI
          createMany: {
            data: shareExpense.map(
              (share: { debtorId: number; amount: number }) => ({
                debtorId: share.debtorId,
                amount: share.amount,
                paid: share.debtorId === expense.payerId,
              })
            ),
          },
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
