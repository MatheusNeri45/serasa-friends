"use client";
import { useState, useEffect, Fragment } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { User } from "@prisma/client";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import AddUserSelection from "./addUserSelection/addUserSelection";
interface formProps {
  debtors: User[];
  setUpdateList: Function;
  users: User[];
  userId: Number;
  groupId: Number;
}

export default function AddMemberForms({ users }: formProps) {
  const [open, setOpen] = useState(false);
  const [usersSelection, setUsersSelection] = useState<User[]>([]);

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
    handleClose();
  };

  const fetchAllUsers = async () => {
    const res = await fetch("../api/getUsers");
    const response = await res.json();
    if (res.ok) {
      return response;
    }
  };

  useEffect(() => {
    const userIds: number[] = [];
    const notInGroupUsers: User[] = [];
    users.forEach((user) => userIds.push(user.id));
    fetchAllUsers().then((fetchedUsers: User[]) => {
      fetchedUsers.forEach((fetchedUser: User) => {
        if (!userIds.includes(fetchedUser.id)) {
          notInGroupUsers.push(fetchedUser);
        }
      });
    });
    setUsersSelection(notInGroupUsers);
  }, [users]);

  return (
    <Fragment>

        <DialogTitle>Add user</DialogTitle>
        <DialogContent>
         <AddUserSelection users={users}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add expense</Button>
        </DialogActions>
    </Fragment>
  );
}
