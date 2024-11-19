"use client";
import { useState, Fragment } from "react";
import Button from "@mui/material/Button";
import { Grid2 } from "@mui/material";
import EditSharpIcon from "@mui/icons-material/EditSharp";

interface formProps {
  // setUpdateList: Function;
  editing: boolean;
  expenseId: number;
  setEditing: Function;
}

export default function EditExpenseButton({
  // setUpdateList,
  expenseId,
  setEditing,
  editing
}: //setUpdateSplitExpensesList
formProps) {
  const handleEdit = async () => {
    setEditing((prev: boolean) => !prev);
  };

  return (
    <Grid2 container width={80} sx={{ color: "text-primary" }} key={expenseId}>
      <Button disabled={editing} variant="contained" onClick={handleEdit}>
        <EditSharpIcon />
      </Button>
    </Grid2>
  );
}
