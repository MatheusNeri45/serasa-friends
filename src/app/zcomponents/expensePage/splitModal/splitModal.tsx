"use client";
import { useState } from "react";
import BasicModal from "../modal/modal";
import { Typography } from "@mui/material";
import DeleteExpenseButton from "../deleteExpenseButton/deleteExpenseButton";
import EditExpenseButton from "../editExpenseButton/editExpenseButton";
import { Expense } from "@prisma/client";
import SplitExpensesList from "../splitExpensesList/splitExpensesList";

interface extendedExpense extends Expense {
  paidBy: { name: string; id: number };
}

interface expenseListProps {
  selectedExpense: extendedExpense;
  onExpenseUpdated: () => void;
  setSelectedExpense: (expense: extendedExpense | null) => void;
}

export default function SplitModal({
  selectedExpense,
  setSelectedExpense,
  onExpenseUpdated,
}: expenseListProps) {
  const [editing, setEditing] = useState<boolean>(false);

  const onClose = async () => {
    setSelectedExpense(null);
  };

  const onChangeEditing = () => {
    setEditing((prev: boolean) => !prev);
  };

  return (
    <BasicModal onClose={onClose} open={!!selectedExpense}>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Expense splits
        </Typography>
        <div
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
        >
          <EditExpenseButton
            editing={editing}
            onChangeEditing={() => onChangeEditing()}
            expenseId={selectedExpense.id}
          />
          <DeleteExpenseButton
            editing={editing}
            expenseId={selectedExpense.id}
            onExpenseDeleted={() => onExpenseUpdated()}
            setSelectedExpense={setSelectedExpense}
          ></DeleteExpenseButton>
        </div>
      </span>
      <SplitExpensesList
        editing={editing}
        onChangeEditing={onChangeEditing}
        selectedExpense={selectedExpense}
        onExpenseUpdated={onExpenseUpdated}
        payer={selectedExpense.paidBy.id}
      />
    </BasicModal>
  );
}
