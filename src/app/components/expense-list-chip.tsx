"use client";

import { Chip } from "@mui/material";
import { Expense, ExpenseShare, User } from "@prisma/client";
import { useState } from "react";
import CustomAlert from "./alert";
import { alpha, useTheme } from "@mui/material/styles";

interface ExtendedExpenseShare extends ExpenseShare {
  debtor: User;
}

interface extendedExpense extends Expense {
  payer: User;
  shares: ExtendedExpenseShare[];
}

interface ExpenseChipProps {
  expenseShare: ExtendedExpenseShare;
  expense: extendedExpense;
  onEditExpense: (message: string, status: boolean) => Promise<void>;
}

export default function ExpenseChip({
  expenseShare,
  expense,
  onEditExpense,
}: ExpenseChipProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ status: false, message: "" });

  const onPayExpenseShare = async (expenseShare: ExtendedExpenseShare) => {
    setLoading(true);
    const res = await fetch("/api/updateExpenseShareStatus", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expenseShare: expenseShare }),
    });
    const response = await res.json();
    if (res.ok) {
      onEditExpense(response.message, false);
      setTimeout(() => setLoading(false), 2000);
    } else {
      setAlert({ status: true, message: response.message });
    }
  };
  return (
    <>
      {alert.status && (
        <CustomAlert
          message={alert.message}
          onClose={() => setAlert({ status: false, message: "" })}
        />
      )}
      <Chip
        clickable
        onClick={() => {
          if (expenseShare.debtor.id !== expense.payer.id) {
            onPayExpenseShare(expenseShare);
          }
        }}
        label={
          loading
            ? "Atualizando..."
            : `${expenseShare.debtor.name}: R$ ${expenseShare.amount.toFixed(
                2
              )}`
        }
        size="small"
        sx={{
          padding: "8px 16px",
          fontSize: "12px",
          bgcolor: loading
            ? "grey[200]"
            : expenseShare.paid
            ? expenseShare.amount == 0
              ? "grey[200]"
              : alpha(theme.palette.secondary.main, 0.5)
            : alpha(theme.palette.error.light, 0.5),
          fontWeight: 500,
          color:
            expenseShare.debtorId !== expense.payer.id
              ? "text.primary"
              : "white",
          "&:hover": {
            color:
              expenseShare.debtorId !== expense.payer.id
                ? "text.primary"
                : "white",
            bgcolor: expenseShare.paid
              ? expenseShare.amount == 0
                ? "grey[200]"
                : alpha(theme.palette.secondary.main, 0.5)
              : alpha(theme.palette.error.light, 0.5),
            transform: "scale(1.1)",
          },
          transition: "all 0.2s",
          alignSelf: "center",
          mr: "4px",
        }}
      />
    </>
  );
}
