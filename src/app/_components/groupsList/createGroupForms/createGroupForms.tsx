"use client";
import { useState, useEffect, Fragment } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MembersList from "../membersList/membersList";
import { User } from "@prisma/client";
import AddIcon from "@mui/icons-material/Add";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

interface formProps {
  setUpdateGroupList: Function;
  users: User[];
  userId: Number;
}

export default function CreateGroupForms({
  setUpdateGroupList,
  users,
  userId,
}: formProps) {
  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  const handleClickOpen = () => {
    setSelectedMembers(users);
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
      groupInfo: {
        name: String(formJson.name),
        userId: userId,
        description: String(formJson.description),
      },
      members: selectedMembers,
    };
    const res = await fetch("api/createGroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setUpdateGroupList((prev: boolean) => !prev);
    }
    handleClose();
  };
  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
      <GroupAddIcon sx={{ width: 30 }} />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Create group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            name="description"
            label="Description"
            fullWidth
            variant="standard"
          />
          <MembersList
            members={users}
            setSelectedMembers={setSelectedMembers}
            selectedMembers={selectedMembers}
            userId = {userId}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create group</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
