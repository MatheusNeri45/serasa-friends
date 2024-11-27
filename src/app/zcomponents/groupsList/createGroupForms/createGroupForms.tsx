"use client";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { User } from "@prisma/client";
import { Fragment, useState } from "react";
import MembersList from "../membersList/membersList";
import { getUserId } from "@/utils/getUserIdLocalStorage";

interface formProps {
  onGroupCreated: ()=>void;
  users: User[];
}

export default function CreateGroupForms({
  onGroupCreated,
  users,
}: formProps) {
  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  const handleClickOpen = () => {
    // NOTE: vc poderia ter setado na inicialização do state
    setSelectedMembers(users);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userId = getUserId()
    const formData = new FormData(event.currentTarget);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      onGroupCreated()
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
