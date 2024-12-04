import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
 

  try { const req = await request.json();
    const expenseId = req.expenseId

    const expenseDeleted = await prisma.expense.delete({
      where:{
        id:expenseId,
      }
    });
    return NextResponse.json({
      expenseDeleted: expenseDeleted,
      status: 200,
    });
  } catch (error) {
    console.error("", error);
    return NextResponse.json({
      message: "Unable to delete expense",
      status: 500,
    });
  }
}