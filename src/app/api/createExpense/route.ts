import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const req = await request.json();
  try {
    const expense = await prisma.expense.create({
      data: {
        description: req.description,
        value: req.value,
        userId: req.userId,
        groupId: req.groupId,
        debtors: req.debtors
      },
    });
    return NextResponse.json(
      { message: "Expense created", expenseCreated: expense },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to create expense" },
      { status: 500 }
    );
  }
}
