"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { User } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onAddMember: () => void;
}

export default function AddMemberModal({
  open,
  onClose,
  onAddMember,
}: AddMemberModalProps) {
  const { groupId } = useParams();
  const [email, setEmail] = useState("");
  const [members, SetMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAddMember]);

  const fetchMembers = async () => {
    const res = await fetch("/api/getUsersNotInGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupId: Number(groupId) }),
    });
    const response = await res.json();
    if (res.ok) {
      SetMembers(response.members);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/addMemberToGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, groupId: Number(groupId) }),
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await res.json();

    if (res.ok) {
      onAddMember();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
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
        Adicionar membro
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Membro</InputLabel>
              <Select
                value={email}
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              >
                {members.map((member: User) => (
                  <MenuItem key={member.id} value={member.email}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Adicionar membro
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
