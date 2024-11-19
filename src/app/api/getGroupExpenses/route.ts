import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const groupId = req.groupId;
    const expenseList = await prisma.expense.findMany({
      where: { groupId: groupId },
      orderBy:{
        createdAt:'asc',
      },
      include: {
        paidBy: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    const formattedExpenseList = expenseList.map((expense) => ({
      ...expense,
      createdAt: expense.createdAt.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      }),
    }));

    if (!expenseList) {
      return NextResponse.json({ expenseList: [] }, { status: 200 });
    }
    return NextResponse.json({ expenseList: formattedExpenseList }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ expenseList: [] }, { status: 200 });
  }
}
