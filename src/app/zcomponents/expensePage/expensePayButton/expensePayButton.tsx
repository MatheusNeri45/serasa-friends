import Button from "@mui/material/Button";
import { Expense } from "@prisma/client";
import { useParams } from "next/navigation";

interface ExpensePayButtonProps {
  expense: Expense;
  onExpensePaid: ()=>void;
}

export default function ExpensePayButton({
  expense,
  onExpensePaid,
}: ExpensePayButtonProps) {
  const {groupId} = useParams()
  //colocar status de loading pro botão
  const changePayStatus = async (
  ) => {
    const res = await fetch("/api/updateExpenseStatus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expense: expense, paid: !expense.paid , groupId:Number(groupId)}),
    });
    if (res.ok) {
      onExpensePaid()
    }
  };


  return expense.paid ? (
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
        changePayStatus();
      }}
    >
      Pay
    </Button>
  );
}
