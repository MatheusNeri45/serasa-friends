"use client";
import { useState, Fragment } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Expense {
  description: string;
  value: number;
  userId: number;
}

interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  paidExpenses: Expense[];
}

interface formProps {
  userId: number;
  debtors: User[];
  setUpdateList: Function;
}

export default function AddExpenseForms({ userId, debtors, setUpdateList }: formProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const data = {
      expense: {
        userId: Number(userId),
        description: String(formJson.description),
        value: Number(formJson.value),
      },
      debtors: debtors,
    };
    const res = await fetch("api/createExpense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setUpdateList((prev: boolean) => !prev);
    }
    handleClose();
  };

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add expense
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add expense</DialogTitle>
        <DialogContent>
          <DialogContentText>Adding expense</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="description"
            name="description"
            label="Description"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="value"
            name="value"
            label="Value"
            type="number"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add expense</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
