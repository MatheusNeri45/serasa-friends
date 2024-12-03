"use client";

import { getUserId } from "@/utils/getJwtFromCookie";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Autocomplete,
  Chip,
} from "@mui/material";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

interface CreateGroupModalProps {
  open: boolean;
  setCreatedGroupOpen: (boolean: boolean) => void;
  onGroupCreated: () => void;
}

export default function CreateGroupModal({
  open,
  setCreatedGroupOpen,
  onGroupCreated,
}: CreateGroupModalProps) {
  const userId = getUserId();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const groupInfo = {
      name: groupName,
      description: description,
      members: selectedMembers,
      userId: userId,
    };
    const res = await fetch("/api/createGroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupInfo }),
    });
    if (res.ok) {
      onGroupCreated();
      const loggedUser = members.filter(
        (user: User) => user.id === Number(userId)
      );
      setSelectedMembers([...selectedMembers, loggedUser[0]]);
    }
    setCreatedGroupOpen(false);
  };
  const onCloseModal = () => {
    const loggedUser = members.filter(
      (user: User) => user.id === Number(userId)
    );
    const loggedUserInSelectedMembers = selectedMembers.filter(
      (user: User) => user.id === userId
    )[0];
    if (!loggedUserInSelectedMembers) {
      setSelectedMembers([...selectedMembers, loggedUser[0]]);
    }
    setCreatedGroupOpen(false);
  };
  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMembers = async () => {
    const res = await fetch("/api/getUsers");
    const response = await res.json();
    if (res.ok) {
      const loggedUser = response.users.filter(
        (user: User) => user.id === Number(userId)
      );
      setSelectedMembers([...selectedMembers, loggedUser[0]]);
      setMembers(response.users);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCloseModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          fontWeight: 800,
          background: "linear-gradient(45deg, #1B4332 30%, #2D6A4F 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Create New Group
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              autoFocus
              label="Group Name"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Autocomplete
              multiple
              sx={{}}
              options={members}
              getOptionLabel={(option) => option.name || ""}
              value={selectedMembers}
              onChange={(_, newValue: User[]) => setSelectedMembers(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Members"
                  placeholder="Select members"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((user, index) => (
                  <Chip
                    label={user.name}
                    {...getTagProps({ index })}
                    key={user.id}
                    sx={{
                      bgcolor: "primary.light",
                      color: "white",
                      "& .MuiChip-deleteIcon": {
                        color: "white",
                      },
                    }}
                  />
                ))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onCloseModal} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Criar Grupo
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
