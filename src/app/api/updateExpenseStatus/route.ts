import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    const updatedExpense = await prisma.expense.update({
      where: { id: req.expense.id },
      data: {
        paid: true,
        valuePaid: {
          set: req.expense.value,
        },
        debtors:{
          updateMany:{
            where:{},
            data:{paid:{
              set:true,
            }}
            }
          }
        },
        }
    );
    if (!updatedExpense) {
      return NextResponse.json(
        {
          expenseUpdated:[],
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { expenseUpdated: updatedExpense },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {  expenseUpdated:[], },
      { status: 200 }
    );
  }
}
