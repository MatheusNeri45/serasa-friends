"use client";

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
import CustomAlert from "../../alert";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ status: false, message: "" });
  const [loggedUser, setLoggedUser] = useState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const groupInfo = {
      name: groupName,
      description: description,
      members: selectedMembers,
    };
    const res = await fetch("/api/createGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupInfo }),
    });
    const resUser = await fetch("/api/getLoggedUser", {});
    const response = await res.json();
    const responseUser = await resUser.json();
    const loggedUser = responseUser.user;
    if (res.ok) {
      onGroupCreated();
      setSelectedMembers([...selectedMembers]);
      setCreatedGroupOpen(false);
      router.refresh();
    } else {
      setAlert({ status: true, message: response.message });
      setSelectedMembers([...selectedMembers, loggedUser]);
      setCreatedGroupOpen(false);
    }
  };
  const onCloseModal = async () => {
    const resUser = await fetch("/api/getLoggedUser", {});
    const responseUser = await resUser.json();
    const loggedUser = responseUser.user;

    const loggedUserInSelectedMembers = selectedMembers.filter(
      (user: User) => user.id === loggedUser.id
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
      const resUser = await fetch("/api/getLoggedUser", {});
      const responseUser = await resUser.json();
      const loggedUser = responseUser.user;
      setLoggedUser(loggedUser.id);
      setSelectedMembers([loggedUser]);
      setMembers(
        response.users.filter((user: User) => user.id !== loggedUser.id)
      );
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
      {alert.status && (
        <CustomAlert
          message={alert.message}
          onClose={() => setAlert({ status: false, message: "" })}
        />
      )}
      <DialogTitle
        sx={{
          pb: 1,
          fontWeight: 800,
          background: "linear-gradient(45deg, #1B4332 30%, #2D6A4F 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Criar novo grupo
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              autoFocus
              label="Nome do grupo"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
            <TextField
              label="Descrição"
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
                  label="Membros"
                  placeholder="Selecione os membros"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((user, index) => {
                  const isLoggedUser = user.id === loggedUser;
                  return (
                    <Chip
                      label={user.name}
                      {...getTagProps({ index })}
                      key={user.id}
                      sx={{
                        bgcolor: isLoggedUser ? "primary.light" : "default",
                        color: isLoggedUser ? "white" : "inherit",
                        "& .MuiChip-deleteIcon": {
                          color: isLoggedUser ? "transparent" : "inherit", // Remove o ícone de delete
                        },
                      }}
                      onDelete={
                        isLoggedUser
                          ? undefined
                          : getTagProps({ index }).onDelete
                      }
                    />
                  );
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onCloseModal} variant="outlined">
            Cancelar
          </Button>
          <Button disabled={loading} type="submit" variant="contained">
            {loading ? "Criando grupo..." : "Criar Grupo"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
