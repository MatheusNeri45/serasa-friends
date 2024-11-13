"use client";
import { useState, useEffect } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ExpensesList from "../_components/expensesList/expensesList";

interface Expense {
  description:string;
  value: number;
  userId: number;
}

interface Debtor{
  id:number;
  email:string;
  name: string;
  password:string;
  paidExpenses:  Expense[]
}

interface formProps{
  userId:number;
  debtors:Debtor[];
  setUpdateList:Function;
}

export default function Home() {
  const [debtors, setDebtors] = useState<[]>([]);
  const [userId, setUserId] = useState(0);
  const [updateList, setUpdateList] = useState<boolean>(false);

  const getUsers = async () => {
    const fetchRes = await fetch("api/getUsers");
    const res = await fetchRes.json();
    setDebtors(res.users);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("id");
    const userId = storedUser ? JSON.parse(storedUser) : null;
    if (userId) {
      setUserId(userId);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
        <ExpensesList userId={userId} updateList={updateList} setUpdateList={setUpdateList}/>
      <FormDialog
        userId={userId}
        debtors={debtors}
        setUpdateList={setUpdateList}
      />
    </div>
  );
}

function FormDialog({ userId, debtors, setUpdateList }:formProps) {
  const [open, setOpen] = React.useState(false);

  const handleAddExpense = async (expense:Expense, debtors:Debtor[]) => {
    const numberDebtors = debtors.length;
    const expenseValue = expense.value;
    const debtorExpense = debtors.map((debtor) => ({
      id: debtor.id,
      splitNumber: expenseValue / numberDebtors,
    }));
    const data = {
      ...expense,
      debtors: debtorExpense,
    };
    const res = await fetch("api/createExpense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    const responseCode = response.status;
    if (responseCode == 200) {
      return true;
    }
    return false;
    // adicionar parte de setar a lista de novo
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const expense = {
      userId: Number(userId),
      description: String(formJson.description),
      value: Number(formJson.value),
    };
    const expenseAdded = await handleAddExpense(expense, debtors);
    if (expenseAdded) {
      setUpdateList((prev:boolean) => !prev);
    }
    handleClose();
  };

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
