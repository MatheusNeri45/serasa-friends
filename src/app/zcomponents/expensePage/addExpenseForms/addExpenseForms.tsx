"use client";
import { useState, Fragment, useEffect } from "react";
import { useParams } from "next/navigation";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SelectUser from "../selectUser/selectUser";
import { User } from "@prisma/client";
import DebtorsList from "../debtorsList/debtorsList";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import { getUserId } from "@/utils/getUserIdLocalStorage";

interface formProps {
  onExpenseCreated: ()=>void;
}

export default function AddExpenseForms({
  onExpenseCreated,
}: formProps) {
  const { groupId } = useParams()
  const [open, setOpen] = useState(false);
  const [payer, setPayer] = useState<number>();
  const [users, setUsers] = useState([])
  const [debtors, setDebtors] = useState<[]>([]);
  const [selectedDebtors, setSelectedDebtors] = useState<User[]>([]);

  useEffect(()=>{
    const userId = getUserId()
    setPayer(userId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    fetchUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const fetchUsers = async () => {
    const response = await fetch("/api/getUsersGroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: Number(groupId) }),
    });
    const res = await response.json();
    setUsers(res.groupInfo);
    setDebtors(res.groupInfo)
  };

  const handleClickOpen = () => {
    setSelectedDebtors(users);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData).entries());
    const data = {
      expense: {
        userId: payer,
        description: String(formJson.description),
        value: Number(formJson.value),
        groupId: Number(groupId),
      },
      debtors: selectedDebtors,
    };
    const res = await fetch("/api/createExpense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      onExpenseCreated()
    }
    handleClose();
  };

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen} sx={{}}>
        <PlaylistAddOutlinedIcon sx={{ width: 30 }} />
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
          <SelectUser
            users={users}
            payer={payer}
            setPayer={setPayer}
          />
          {payer && (
            <DebtorsList
              debtors={debtors}
              setSelectedDebtors={setSelectedDebtors}
              selectedDebtors={selectedDebtors}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add expense</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
