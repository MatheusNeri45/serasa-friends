import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const expenses = await prisma.expense.findMany({
      include:{
        paidBy:{
          select:{
            name:true,
          }
        }
      }
    });
    return NextResponse.json(
      { expenseList: expenses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching expenses.", error);
    return NextResponse.json(
      { message: "Unable to find expenses" },
      { status: 200 }
    );
  }
}
