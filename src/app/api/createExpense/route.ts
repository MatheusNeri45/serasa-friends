import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const req = await request.json();
  let sumSplits = 0
  const fullValue = req.value
  for (let i = 0; i < req.debtors.length; i++){
    sumSplits+= req.debtors[i].value
  }
  if(sumSplits!=fullValue){
    return NextResponse.json(
      { message: "You need to split the expense correctly."},
      { status: 400 }
    );
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        description: req.description,
        value: fullValue,
        paidBy: {
          connect: { id: req.userId }, 
        },
        debtors: {
          createMany: {
            data: req.debtors.map(
              (debtor: { id: number; value: number }) => ({
                participantId:debtor.id,
                value: debtor.value,
              })
            ),
          },
        },
      },
    });
    return NextResponse.json(
      { message: "Expense created", expenseCreated: expense },
      { status: 200 }
    );
  } catch (error) {
    console.error("", error);
    return NextResponse.json(
      { message: "Unable to create expense" },
      { status: 500 }
    );
  }
}
