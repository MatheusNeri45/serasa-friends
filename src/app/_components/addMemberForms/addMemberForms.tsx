"use client";
import { useState, useEffect, Fragment } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { User } from "@prisma/client";
import AddUserSelection from "./addUserSelection/addUserSelection";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
interface formProps {
  users: User[] | [];
  setUsers: Function;
  groupId: number;
}

export default function AddMemberForms({ users, setUsers, groupId }: formProps) {
  const [open, setOpen] = useState(false);
  const [usersSelection, setUsersSelection] = useState<User[]>([]);
  const [userToAdd, setUserToAdd] = useState<number | null>(null);

  const addMemberForms = async (userId: number | null) => {
    const response = await fetch("../api/updateGroupMembers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId, groupId: groupId }),
    });
    return response;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await addMemberForms(userToAdd);
    const res = await response.json();
    if (response.ok) {
      handleClose();
      setUsers(res.groupMembers)
    }
  };

  const fetchAllUsers = async () => {
    const res = await fetch("../api/getUsers");
    const response = await res.json();
    if (res.ok) {
      return response.users;
    }
  };

  useEffect(() => {
    const userIds: number[] = [];
    const notInGroupUsers: User[] = [];
    users.forEach((user) => userIds.push(user.id));
    console.log(users)
    console.log(userIds)
    fetchAllUsers().then((fetchedUsers: User[]) => {
      fetchedUsers.forEach((fetchedUser: User) => {
        if (!userIds.includes(fetchedUser.id)) {
          notInGroupUsers.push(fetchedUser);
        }
      });
    });
    console.log(userIds)
    console.log(notInGroupUsers)
    setUsersSelection(notInGroupUsers);
  },[]);

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen} sx={{}}>
        <PersonAddAlt1Icon sx={{ width: 30 }} />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add user</DialogTitle>
        <DialogContent>
          <AddUserSelection
            usersSelection={usersSelection}
            setUserToAdd={setUserToAdd}
            userToAdd={userToAdd}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add user</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
