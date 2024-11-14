import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

interface ExpensePayButtonProps {
paidExpense: boolean;
expenseId: number;
}

export default function ExpensePayButton({ paidExpense, expenseId}:ExpensePayButtonProps) {
  const [paid, setPaid] = useState<boolean>();
  //colocar status de loading pro botão
  const changePayStatus = async (expenseId:number, paid:boolean|undefined) => {

    const expenseUpdate = await fetch("/api/updateExpenseStatus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({expenseId:expenseId, paid:!paid}),
    });
    return expenseUpdate;
  };

  useEffect(()=>{
    setPaid(paidExpense)
  },[paidExpense])

  const onPay = async () => {
    const res = await changePayStatus(expenseId, paid);

    if(res.ok){
      const resp = await fetch("/api/updateManySplitExpenseStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({expenseId:expenseId, paid:!paid}),
      });
      if(resp.ok){
        setPaid(true)
      }

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
      onClick={(e)=>{e.stopPropagation()
        onPay()}}
    >
      Pay
    </Button>
  );
}
