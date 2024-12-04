import { Expense, ExpenseShare, Group, GroupMember, PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import { getUserIdFromCookie } from "@/utils/getUserIdFromCookie";
const prisma = new PrismaClient();

interface ExtendedExpenseShare extends ExpenseShare {
  debtor: User;
}

interface ExtendedExpense extends Expense {
  payer: { id: number; email: string; name: string };
  shares: ExtendedExpenseShare[];
}

interface ExtendedGroup extends Group {
  members: GroupMember[];
  expenses: ExtendedExpense[];
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromCookie(request);
  if (!userId) {
    return NextResponse.json({ message: "User not authenticated" });
  }
  const groups: ExtendedGroup[] = await prisma.group.findMany({
    where: {
      members: {
        some: { id: userId },
      },
    },
    include: {
      members: true,
      expenses: {
        include: {
          payer: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          shares: {
            include: {
              debtor: true,
            },
          },
        },
      },
    },
  });
  const groupsBalance = groups.map((group: ExtendedGroup) => {
    return { id: group.id, balance: calculateGroupBalance(group, userId) };
  });

  return NextResponse.json({ balances: groupsBalance });
}
const calculateGroupBalance = (group: ExtendedGroup, userId: number) => {
    let totalOwed = 0;
    let totalOwing = 0;
  
    group.expenses.forEach((expense: ExtendedExpense) => {
      if (expense.payer.id === userId) {
        totalOwed = totalOwed + expense.amount - (expense.paidAmount || 0);
      }
  
      const userDebt = expense.shares.find(
        (ExpenseShare: ExtendedExpenseShare) =>
          ExpenseShare.debtorId === userId && !ExpenseShare.paid
      );
      if (userDebt) {
        totalOwing = totalOwing + userDebt.amount;
      }
    });
  
    const balance = {
      owed: totalOwed.toFixed(2),
      owing: totalOwing.toFixed(2),
      net: (totalOwed - totalOwing).toFixed(2),
    };
  
    const netBalance = parseFloat(balance.net);
  
    const unpaidExpenses = group.expenses.filter(
      (expense: ExtendedExpense) =>
        expense.payer.id === userId &&
        expense.shares.some((expenseShare: ExtendedExpenseShare) => !expenseShare.paid)
    );
  
    const owedExpenses = group.expenses
      .filter(
        (expense: ExtendedExpense) =>
          expense.payer.id !== userId &&
          expense.shares.some(
            (expenseShare: ExtendedExpenseShare) =>
              expenseShare.debtorId === userId && !expenseShare.paid
          )
      )
      .map((expense: ExtendedExpense) => {
        const debtAmount =
          expense.shares.find(
            (expenseShare:ExtendedExpenseShare) => expenseShare.debtorId === userId
          )?.amount || 0;
  
        return {
          id: expense.id,
          description: expense.description,
          paidBy: expense.payer.id,
          debtAmount: debtAmount,
        };
      });
  
    return {
      owed: balance.owed,
      owing: balance.owing,
      netBalance: netBalance,
      unpaidExpenses: unpaidExpenses,
      owedExpenses: owedExpenses,
    };
  };
  