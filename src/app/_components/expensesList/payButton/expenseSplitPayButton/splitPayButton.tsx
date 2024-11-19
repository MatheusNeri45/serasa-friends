import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { SplitExpense } from "@prisma/client";

interface splitPayButtonProps {
  splitExpense: SplitExpense;
  setUpdateList: Function;
}

export default function SplitPayButton({splitExpense, setUpdateList}: splitPayButtonProps){
  const [paid, setPaid] = useState(splitExpense.paid);

  const changePayStatus = async () => {
    const splitExpenseUpdated = await fetch("../api/updateSplitExpenseStatus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        splitExpense: splitExpense,
        paid: !paid,
      }),
    });
    return splitExpenseUpdated;
  };

  const onPay = async () => {
    const response = await changePayStatus();
    if (response.ok) {
      setPaid(true);
      setUpdateList((prev: boolean) => !prev);
    }
  };
  //adicionar algo para usuario saber q deu erro

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
      onClick={onPay}
    >
      Pay
    </Button>
  );
}
