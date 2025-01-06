import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserIdFromCookie } from "@/utils/getUserIdFromCookie";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromCookie(request);

    if (!userId) {
      return NextResponse.json({ message: "User not authenticated" });
    }
    const expensesByUser = await prisma.user.findMany({
      where: {
        OR: [
          {
            expenses: {
              some: { shares: { some: { debtorId: userId } } },
            },
          },
          {
            expenses: { some: { payerId: userId } },
          },
        ],
      },
      include: {
        expenses: { include: { shares: { include: { debtor: true } } } },
      },
    });
    const userWithExpenses = expensesByUser.find(
      (user) =>
        user.id === userId ||
        user.expenses.find((expense) =>
          expense.shares.find((share) => share.debtorId === userId)
        )
    );
    if (!userWithExpenses) {
      return NextResponse.json({
        message: "Você não tem dívidas associadas ao seu nome.",
        status: 200,
      });
    }

    const loggedUserOwingToOthers = expensesByUser
      .filter((user) =>
        user.expenses.some((expense) =>
          expense.shares.some(
            (share) => share.debtorId === userId && !share.paid
          )
        )
      )
      .map((user) => ({
        userId: user.id,
        name: user.name,
        email: user.email,
        owingToOthers: user.expenses
          .filter((expense) =>
            expense.shares.some(
              (share) => share.debtorId === userId && !share.paid
            )
          )
          .map((expense) => ({
            expenseId: expense.id,
            description: expense.description,
            amount: expense.amount,
            shares: expense.shares
              .filter((share) => share.debtorId === userId && !share.paid)
              .map((share) => ({
                shareId: share.id,
                amount: share.amount,
                paid: share.paid,
              })),
          })),
      }));

    const owedToLoggedUser = userWithExpenses.expenses.reduce<{
      [key: number]: {
        userId: number;
        name: string;
        email: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        debts: any[];
      };
    }>((acc, expense) => {
      expense.shares.forEach((share) => {
        if (share.debtor.id !== userId && !share.paid) {
          if (!acc[share.debtor.id]) {
            acc[share.debtor.id] = {
              userId: share.debtor.id,
              name: share.debtor.name,
              email: share.debtor.email,
              debts: [],
            };
          }
          acc[share.debtor.id].debts.push({
            expenseId: expense.id,
            description: expense.description,
            amount: share.amount,
          });
        }
      });
      return acc;
    }, {});

    // Combina os resultados em um único output
    const combinedResults = loggedUserOwingToOthers.map((owing) => ({
      userId: owing.userId,
      name: owing.name,
      loggedUserOwing: owing.owingToOthers,
      owedToLoggedUser: owedToLoggedUser[owing.userId]?.debts || [],
    }));
    console.log(combinedResults);

    return NextResponse.json({ combinedResults, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
