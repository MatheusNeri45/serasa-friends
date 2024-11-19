"use client";
import { useState, Fragment } from "react";
import Button from "@mui/material/Button";
import { Grid2 } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface formProps {
  editing: boolean;
  setSelectedExpense: Function;
  setUpdateList: Function;
  expenseId: number;
}

export default function DeleteExpenseButton({
  editing,
  expenseId,
  setSelectedExpense,
  setUpdateList,
}: formProps) {
  const handleClickOpen = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const res = await fetch("../api/deleteExpense", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId: expenseId }),
    });
    if (res.ok) {
      setUpdateList((prev: boolean) => !prev);
      setSelectedExpense(null);
    }
  };

  return (
    <Grid2 container width={80} sx={{ color: "text-primary" }} key={expenseId}>
      <Button
        disabled={editing}
        variant="outlined"
        onClick={(event) => {
          event.stopPropagation();
          handleClickOpen(event);
        }}
      >
        <DeleteForeverIcon />
      </Button>
    </Grid2>
  );
}
