import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Expense } from "@prisma/client";

interface ExpensePayButtonProps {
  paidExpense: boolean;
  expense: Expense;
}

export default function ExpensePayButton({
  paidExpense,
  expense,
}: ExpensePayButtonProps) {
  const [paid, setPaid] = useState<boolean>();
  //colocar status de loading pro botão
  const changePayStatus = async (
    expenseId: number,
    paid: boolean | undefined
  ) => {
    const expenseUpdate = await fetch("/api/updateExpenseStatus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId: expenseId, paid: !paid }),
    });
    return expenseUpdate;
  };

  useEffect(() => {
    setPaid(paidExpense);
  }, [paidExpense]);

  const onPay = async () => {
    const res = await changePayStatus(expense.id, paid);

    if (res.ok) {
      setPaid(true);
    }
  };
  return paid ? (
    <Button
      variant="contained"
      disabled
      sx={{
        background: "green",
      }}
    >
      Paid
    </Button>
  ) : (
    <Button
      variant="contained"
      sx={{
        background: "grey",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPay();
      }}
    >
      Pay
    </Button>
  );
}
