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
import CustomAlert from "../../alert";

interface splitAmountUser extends User {
  splitAmount: number;
}

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
  onExpenseEdited: (message: string, status: false) => Promise<void>;
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
interface Alert {
  status: boolean;
  message: string;
}

const splitTypes = [
  { value: "equally", label: "Igualmente" },
  { value: "parts", label: "Partes do todo" },
  { value: "value", label: "Valores" },
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
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [splitType, setSplitType] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<Alert>({ status: false, message: "" });
  const [shareSplitAmounts, setShareSplitAmounts] = useState<splitAmountUser[]>(
    []
  );
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExpense]);

  const fetchUsers = async () => {
    const response = await fetch("/api/getUsersInGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupId: Number(groupId) }),
    });
    const res = await response.json();
    setUsers(res.members);
    setSelectedParticipants(
      selectedExpense?.shares.map(
        (share: ExtendedExpenseShare) => share.debtor
      ) || []
    );
    setDescription(selectedExpense?.description || "Loading");
    setPaidBy(String(selectedExpense?.payer.id) || "Loading");
    setAmount(String(selectedExpense?.amount) || "Loading");
    setCategory(selectedExpense?.category || "");
    setSplitType(selectedExpense?.splitType || "");
    const shareSplitAmounts = res.members.map((user: User) => ({
      ...user,
      splitAmount: 0,
    }));
    setShareSplitAmounts(shareSplitAmounts);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    let sumSplits = 0;

    const filteredShares = shareSplitAmounts.filter((user: splitAmountUser) =>
      selectedParticipants.some((selected) => selected.id === user.id)
    );
    shareSplitAmounts.forEach((user: splitAmountUser) => {
      sumSplits += user.splitAmount;
    });
    if (
      (splitType === "value" && sumSplits === Number(amount)) ||
      splitType === "parts" ||
      splitType === "equally"
    ) {
      const data = {
        expense: {
          id: selectedExpense?.id,
          payerId: Number(paidBy),
          description: String(description),
          category: String(category),
          amount: Number(amount),
          splitType: String(splitType),
        },
        shares: filteredShares,
      };
      const res = await fetch("/api/updateExpenseEdit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await res.json();
      if (res.ok) {
        onExpenseEdited(response.message, false);
        onClose();
        closeMenu();
        setLoading(false);
      } else {
        setAlert({ status: true, message: response.message });
        setLoading(false);
      }
    }
  };
  const splitAmount =
    selectedParticipants.length > 0
      ? Number(amount) / selectedParticipants?.length
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
                onChange={(e) => setPaidBy(e.target.value)}
                required
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Modo de divisão</InputLabel>
              <Select
                value={splitType}
                label="Modo de divisão"
                onChange={(e) => setSplitType(e.target.value)}
                required
              >
                {splitTypes.map((splitType) => (
                  <MenuItem key={splitType.label} value={splitType.value}>
                    {splitType.label}
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

            {splitType !== "equally" &&
              splitType &&
              amount &&
              selectedParticipants.length > 0 && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "primary.light",
                    boxShadow: "0 4px 12px rgba(45, 106, 79, 0.08)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: "primary.main",
                      borderBottom: "2px solid",
                      borderColor: "primary.light",
                      pb: 1,
                    }}
                  >
                    Divisão Personalizada
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {selectedParticipants.map((participant) => (
                      <Box
                        key={participant.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 1,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "grey.100",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                            flex: 1,
                          }}
                        >
                          {participant.name}
                        </Typography>
                        <TextField
                          size="small"
                          label={splitType === "parts" ? "Partes" : "Valor"}
                          type="number"
                          value={
                            shareSplitAmounts.find(
                              (item: splitAmountUser) =>
                                item.id === participant.id
                            )?.splitAmount || ""
                          }
                          onChange={(e) =>
                            setShareSplitAmounts((prevshareSplitAmounts) =>
                              prevshareSplitAmounts.map((user) =>
                                user.id === participant.id
                                  ? {
                                      ...user,
                                      splitAmount: parseFloat(e.target.value),
                                    }
                                  : user
                              )
                            )
                          }
                          required
                          sx={{
                            width: "150px",
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "background.paper",
                              "&:hover": {
                                "& > fieldset": {
                                  borderColor: "primary.main",
                                },
                              },
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 500,
                                  }}
                                >
                                  {splitType === "parts" ? "#" : "R$"}
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

            {selectedParticipants.length > 0 &&
              amount &&
              splitType === "equally" && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "primary.light",
                    boxShadow: "0 4px 12px rgba(45, 106, 79, 0.08)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: "primary.main",
                      borderBottom: "2px solid",
                      borderColor: "primary.light",
                      pb: 1,
                    }}
                  >
                    Divisão Igual
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {selectedParticipants.map((participant) => (
                      <Box
                        key={participant.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 1,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "grey.100",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                          }}
                        >
                          {participant.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "secondary.light",
                            bgcolor: "primary.light",
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            minWidth: "120px",
                            textAlign: "center",
                          }}
                        >
                          R$ {splitAmount.toFixed(2)}
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
              setAmount("");
              setDescription("");
              setPaidBy("");
              setCategory("");
              setSplitType("");
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
              !amount ||
              !paidBy ||
              !splitType ||
              selectedParticipants.length === 0 ||
              loading
            }
          >
            {loading ? "Editando despesa..." : "Editar despesa"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
