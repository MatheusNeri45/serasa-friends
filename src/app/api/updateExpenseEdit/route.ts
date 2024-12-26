import { User } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
interface splitAmountUser extends User {
  splitAmount: number;
}

export async function PATCH(request: NextRequest) {
  try {
    const req = await request.json();
    let sumSplitParts = 0;
    req.shares.forEach((user: splitAmountUser) => {
      sumSplitParts += user.splitAmount;
    });
    const numberShares = req.shares.length;
    const expenseValue = req.expense.amount;
    const shareExpense =
      req.expense.splitType == "equally"
        ? req.shares.map((share: User) => ({
            id: share.id,
            splitAmount: expenseValue / numberShares,
          }))
        : req.expense.splitType == "value"
        ? req.shares
        : req.shares.map((share: splitAmountUser) => ({
            id: share.id,
            splitAmount: (share.splitAmount * expenseValue) / sumSplitParts,
          }));
    const data = {
      ...req.expense,
      shares: shareExpense,
    };
    console.log(data);
    const payerInDebtor = data.shares.filter(
      (share: User) => share.id === req.expense.payerId
    );
    const amountPaid = payerInDebtor ? payerInDebtor[0].splitAmount : 0;

    const updatedExpense = await prisma.expense.update({
      where: { id: req.expense.id },
      data: {
        description: req.expense.description,
        amount: req.expense.amount,
        paidAmount: amountPaid,
        payer: {
          connect: { id: req.expense.payerId },
        },
        splitType: req.expense.splitType,
        shares: {
          deleteMany: {},
          createMany: {
            data: data.shares.map(
              (share: { id: number; splitAmount: number }) => ({
                debtorId: share.id,
                amount: share.splitAmount,
                paid: share.id === req.expense.payerId,
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
    if (updatedExpense) {
      return NextResponse.json({
        updatedExpense: updatedExpense,
        status: 200,
        message: "Despesa editada com sucesso.",
      });
    }
    return NextResponse.json(
      {
        message:
          "Não foi possível editar a despesa. Verifique se todas as informações estão corretas.",
      },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      {
        message:
          "Não foi possível editar a despesa. Verifique se todas as informações estão corretas.",
      },
      { status: 500 }
    );
  }
}
