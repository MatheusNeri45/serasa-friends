import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Expense } from "@prisma/client";

interface ExpensePayButtonProps {
  paidExpense: boolean;
  expense: Expense;
  setUpdateList: Function;
  groupId: Number
}

export default function ExpensePayButton({
  paidExpense,
  expense,
  setUpdateList,
  groupId
}: ExpensePayButtonProps) {
  const [paid, setPaid] = useState<boolean>();
  //colocar status de loading pro botão
  const changePayStatus = async (
    expense: Expense,
    paid: boolean | undefined
  ) => {
    const expenseUpdate = await fetch("../api/updateExpenseStatus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expense: expense, paid: !paid , groupId:groupId}),
    });
    return expenseUpdate;
  };

  useEffect(() => {
    setPaid(paidExpense);
  }, [paidExpense]);

  const onPay = async () => {
    const res = await changePayStatus(expense, paid);

    if (res.ok) {
      setPaid(true);
      setUpdateList((prev:boolean)=>!prev)
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
