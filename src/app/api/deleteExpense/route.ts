import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function DELETE(request: NextRequest) {
  try {
    const req = await request.json();
    const expenseId = req.expenseId;

    const expenseDeleted = await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });
    if (expenseDeleted) {
      return NextResponse.json({
        expenseDeleted: expenseDeleted,
        status: 200,
        message:"Despesa excluída com sucesso."
      });
    }
    return NextResponse.json({
      message: "Despesa não excluída.",
      status: 500,
    });
  } catch (error) {
    console.error("", error);
    return NextResponse.json({
      message: "Erro excluindo despesa.",
      status: 500,
    });
  }
}
