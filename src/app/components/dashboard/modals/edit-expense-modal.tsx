"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Expense, ExpenseShare, User } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ExtendedExpenseShare extends ExpenseShare {
  debtor: User;
}

interface extendedExpense extends Expense {
  payer: User;
  shares: ExtendedExpenseShare[];
}

interface AddExpenseModalProps {
  editExpenseOpen: boolean;
  onClose: () => void;
  onExpenseEdited: () => void;
  selectedExpense: extendedExpense | null;
  closeMenu: () => void;
}

const categories = [
  { value: "compras", label: "Compras" },
  { value: "alimentação", label: "Alimentação" },
  { value: "hospedagem", label: "Hospedagem" },
  { value: "transporte", label: "Transporte" },
  { value: "saúde", label: "Saúde" },
  { value: "diversão", label: "Diversão" },
  { value: "educação", label: "Educação" },
  { value: "outros", label: "Outros" },
];

export default function EditExpenseModal({
  editExpenseOpen,
  onClose,
  onExpenseEdited,
  selectedExpense,
  closeMenu,
}: AddExpenseModalProps) {
  const { groupId } = useParams();
  const [description, setDescription] = useState("");
  const [value, setValue] = useState<number | null>(null);
  const [paidBy, setPaidBy] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExpense]);

  const fetchUsers = async () => {
    const response = await fetch("/api/getUsersInGroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: Number(groupId) }),
    });
    const res = await response.json();
    setUsers(res.members);
    setSelectedParticipants(
      selectedExpense?.shares.map((share:ExtendedExpenseShare) => share.debtor) || []
    );
    setDescription(selectedExpense?.description || "");
    setPaidBy(selectedExpense?.payer.id || null);
    setValue(selectedExpense?.amount || null);
    setCategory(selectedExpense?.category || "");
  };
  //NOTE AJUSTAR VALOR DO BALANCE, EDIT EXPENSE E UPDATE SHARE EXPENSE PAID
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      expense: {
        id: selectedExpense?.id,
        userId: Number(paidBy),
        description: String(description),
        category: String(category),
        value: Number(value),
      },
      debtors: selectedParticipants,
    };
    const res = await fetch("/api/updateExpenseEdit", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await res.json();
    if (res.ok) {
      onExpenseEdited();
      onClose();
      closeMenu();
    }
  };
  const splitAmount =
    selectedParticipants.length > 0
      ? Number(value) / selectedParticipants?.length
      : 0;
  return (
    <Dialog
      open={editExpenseOpen}
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
        Editar despesa
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              autoFocus
              label="Descrição"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <TextField
              label="Valor"
              type="number"
              fullWidth
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={category}
                label="Categoria"
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Pago por</InputLabel>
              <Select
                value={paidBy}
                label="Pago por"
                onChange={(e) => setPaidBy(Number(e.target.value))}
                required
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => option.name || ""}
              value={selectedParticipants}
              onChange={(_, newValue: User[]) =>
                setSelectedParticipants(newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Dividir com"
                  placeholder="Selecione os caloteiros"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((user, index) => (
                  <Chip
                    label={user.name}
                    {...getTagProps({ index })}
                    sx={{
                      bgcolor: "primary.light",
                      color: "white",
                      "& .MuiChip-deleteIcon": {
                        color: "white",
                      },
                    }}
                    key={user.id}
                  />
                ))
              }
            />

            {selectedParticipants.length > 0 && value && (
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  bgcolor: "primary.light",
                  borderRadius: 2,
                  color: "white",
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Divisão
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  {selectedParticipants?.map((participant) => (
                    <Box
                      key={participant.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">
                        {participant.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        R${" "}{splitAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              onClose();
              setDescription("");
              setPaidBy(null);
              setValue(null);
              setCategory("");
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              !description ||
              !value ||
              !paidBy ||
              selectedParticipants?.length === 0
            }
          >
            Editar despesa
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
