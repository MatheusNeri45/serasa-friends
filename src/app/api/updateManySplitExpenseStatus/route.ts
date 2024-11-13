import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const req = await request.json();
    console.log(req)
    const updatedSplitExpense = await prisma.splitExpense.updateMany({
      where: { id: req.splitExpenseId },
      data: { paid: req.paid },
    });
    if (!updatedSplitExpense) {
      return NextResponse.json(
        {
          message:
            "There is no expense registered with this ID in the database",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { splitExpenseUpdated: updatedSplitExpense },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to find split expenses for this expense." },
      { status: 500 }
    );
  }
}
