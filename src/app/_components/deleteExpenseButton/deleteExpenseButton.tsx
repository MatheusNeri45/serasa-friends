"use client";
import { useState, Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface formProps {
  setUpdateList: Function;
  expenseId: number

}

export default function deleteExpenseButton({ setUpdateList, expenseId }: formProps) {
  const [close, setClosed] = useState(false);

  const handleClickOpen = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const res = await fetch("api/deleteExpense", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({expenseId:expenseId}),
    });
    if (res.ok) {
      setUpdateList((prev: boolean) => !prev);
    }
  };

  return (
    <Fragment key={expenseId}>
      <Button variant="outlined" onClick={(event)=>{
        event.stopPropagation()
        handleClickOpen(event)}}>
        Delete
      </Button>
    </Fragment>
  );
}
