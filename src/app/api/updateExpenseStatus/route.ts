import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    const updatedExpense = await prisma.expense.update({
      where: { id: req.expense.id },
      data: {
        status: "PAID",
        paidAmount: {
          set: req.expense.amount,
        },
        shares: {
          updateMany: {
            where: {},
            data: {
              paid: {
                set: true,
              },
            },
          },
        },
      },
    });
    if (!updatedExpense) {
      return NextResponse.json(
        {
          expenseUpdated: [],
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { expenseUpdated: updatedExpense },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ expenseUpdated: [] }, { status: 200 });
  }
}
