"use client";
import { useState, useEffect, Fragment } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import UserSelect from "../selectUser/selectUser";
import {User} from '@prisma/client';
import DebtorsList from "../debtorsList/debtorsList";

interface formProps {
  debtors: User[];
  setUpdateList: Function;
  users: User[];
  userId: Number
}

export default function AddExpenseForms({debtors, setUpdateList, users, userId }: formProps) {
  const [open, setOpen] = useState(false);
  const [payer, setPayer] = useState<Number>();
  const [selectedDebtors, setSelectedDebtors] = useState<User[]>([]);

  const handleClickOpen = () => {
    setSelectedDebtors(users)
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
        userId: payer,
        description: String(formJson.description),
        value: Number(formJson.value),
      },
      debtors: selectedDebtors,
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
          <UserSelect users = {users} payer={payer} setPayer={setPayer} userId={userId}/>
          {payer&&(<DebtorsList debtors={debtors} setSelectedDebtors={setSelectedDebtors} selectedDebtors={selectedDebtors}/>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add expense</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
