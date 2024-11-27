import Button from "@mui/material/Button";
import { SplitExpense } from "@prisma/client";

interface splitPayButtonProps {
  splitExpense: SplitExpense;
  onSplitPaid: ()=>void;
}

export default function SplitPayButton({splitExpense, onSplitPaid}: splitPayButtonProps){

  const changePayStatus = async () => {
    const response = await fetch("/api/updateSplitExpenseStatus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        splitExpense: splitExpense,
        paid: !splitExpense.paid,
      }),
    });
    if (response.ok) {
      onSplitPaid()
    }
  };

  const onPay = () => {
    changePayStatus();

  };
  //adicionar algo para usuario saber q deu erro

  return splitExpense.paid ? (
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
