import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

interface expenseSplit {
  id: number;
  value: number;
  expenseId: number;
  participantId: number;
  updatedAt: string;
  paid: boolean;
}

export default function SplitPayButton({
  splitExpense,
  setUpdateList,
}) {
  const [paid, setPaid] = useState(splitExpense.paid);
  const [splitExpenseList, setSplitExpenseList] = useState([]);
  //colocar status de loading pro botão
  const changePayStatus = async () => {
    const splitExpenseUpdated = await fetch("/api/updateSplitExpenseStatus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ splitExpenseId: splitExpense.id, paid: !paid }),
    });
    return splitExpenseUpdated;
  };
  const getExpenseSplits = async () => {
    const res = await fetch("/api/getExpenseSplits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId: splitExpense.expenseId }),
    });
    const result = await res.json();
    return result.splitExpenseList;
  };

  const onPay = async () => {
    const response = await changePayStatus();
    const updatedSplitExpenseList = await getExpenseSplits();
    setSplitExpenseList(updatedSplitExpenseList);
    const numberSplits = updatedSplitExpenseList.length;
    let counterSplits = 0;
    updatedSplitExpenseList.forEach((element: expenseSplit) => {
      if (element.paid) {
        counterSplits++;
      }
    });
    if (response.ok) {
      setPaid(true);
      console.log(numberSplits - counterSplits);
      if (numberSplits - counterSplits === 0) {
        const res = await fetch("/api/updateExpenseStatus", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expenseId: splitExpense.expenseId,
            paid: true,
          }),
        });
        if (res.ok) {
          setUpdateList((prev: boolean) => !prev);
        }
      }
    }

    //se for o ultimo split mudar o valor de paid do expense pai
    //adicionar algo para usuario saber q deu erro
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
      onClick={onPay}
    >
      Pay
    </Button>
  );
}
