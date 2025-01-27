"use client";

import {
  Box,
  List,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Menu,
  MenuItem,
  LinearProgress,
  ListItem,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalDining as DiningIcon,
  HomeWork as HomeIcon,
  DirectionsCar as TransportIcon,
  LocalHospital as HealthIcon,
  SportsEsports as EntertainmentIcon,
  School as EducationIcon,
  Category as OtherIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { Expense, ExpenseShare, User } from "@prisma/client";
import EditExpenseModal from "./dashboard/modals/edit-expense-modal";
import ExpenseChip from "./expense-list-chip";

interface ExtendedExpenseShare extends ExpenseShare {
  debtor: User;
}

interface extendedExpense extends Expense {
  payer: User;
  shares: ExtendedExpenseShare[];
}

const categoryIcons: { [key: string]: React.ReactElement } = {
  compras: <ShoppingBagIcon />,
  alimentação: <DiningIcon />,
  hospedagem: <HomeIcon />,
  transporte: <TransportIcon />,
  saúde: <HealthIcon />,
  diversão: <EntertainmentIcon />,
  educação: <EducationIcon />,
  outros: <OtherIcon />,
};

const categoryColors: { [key: string]: string } = {
  shopping: "#2D6A4F",
  dining: "#40916C",
  housing: "#52B788",
  transport: "#74C69D",
  health: "#95D5B2",
  entertainment: "#B7E4C7",
  education: "#D8F3DC",
  other: "#95D5B2",
};

interface ExpensesListProps {
  expenses: extendedExpense[];
  onEditExpense: (message: string, status: boolean) => Promise<void>;
  onDeleteExpense: (expenseId: number) => void;
}

export default function ExpensesList({
  expenses,
  onEditExpense,
  onDeleteExpense,
}: ExpensesListProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedExpense, setSelectedExpense] =
    useState<extendedExpense | null>(null);
  const [editExpenseOpen, setEditExpenseOpen] = useState<boolean>(false);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    expense: extendedExpense
  ) => {
    event.stopPropagation();
    setSelectedExpense(expense);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    setEditExpenseOpen(true);
  };

  const handleDelete = () => {
    if (selectedExpense) {
      onDeleteExpense(selectedExpense.id);
    }
    handleMenuClose();
  };

  const onPayExpense = async (expense: extendedExpense) => {
    const res = await fetch("/api/updateExpenseStatus", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expense: expense }),
    });
    const response = await res.json();
    if (res.ok) {
      onEditExpense(response.message, false);
    }
  };

  if (expenses?.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 3,
          bgcolor: "background.paper",
          borderRadius: 4,
        }}
      >
        <OtherIcon
          sx={{
            fontSize: 48,
            color: "primary.main",
            opacity: 0.5,
            mb: 2,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "text.primary",
            fontWeight: 600,
            mb: 1,
          }}
        >
          Sem despesas adicionadas.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            maxWidth: 400,
            mx: "auto",
          }}
        >
          Adicione despesas e evite que seus amigos caloteiros passem a perna em
          você, ou não.
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 1 }}>
      {expenses
        ?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((expense, index) => (
          <Box key={expense.id}>
            <ListItem
              sx={{
                py: 2,
                px: 3,
                display: "flex",
                alignItems: "flex-start",
                borderRadius: "10px",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(45, 106, 79, 0.05)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: categoryColors[expense.category],
                  mr: 2,
                  mt: 1,
                }}
              >
                {categoryIcons[expense.category]}
              </Avatar>

              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        mb: 0.5,
                      }}
                    >
                      {expense.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-flex",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mr: 1,
                        }}
                      >
                        Pago por {expense.payer.name}
                      </Typography>
                      <Chip
                        label={expense.category}
                        size="small"
                        sx={{
                          bgcolor: `${categoryColors[expense.category]}20`,
                          color: categoryColors[expense.category],
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      R${" "}
                      {expense.shares
                        .reduce((total, ExpenseShare) => {
                          return (
                            total +
                            (ExpenseShare.paid
                              ? expense.payerId !== ExpenseShare.debtorId
                                ? ExpenseShare.amount
                                : 0
                              : 0)
                          );
                        }, 0)
                        .toFixed(0)}
                      /
                      {expense.shares
                        .reduce((total, ExpenseShare) => {
                          if (expense.payerId !== ExpenseShare.debtorId) {
                            return total + ExpenseShare.amount;
                          }
                          return total;
                        }, 0)
                        .toFixed(0)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.ceil(
                        (100 *
                          expense.shares.reduce((total, ExpenseShare) => {
                            return (
                              total +
                              (ExpenseShare.paid
                                ? expense.payerId !== ExpenseShare.debtorId
                                  ? ExpenseShare.amount
                                  : 0
                                : 0)
                            );
                          }, 0)) /
                          expense.shares.reduce((total, ExpenseShare) => {
                            if (expense.payerId !== ExpenseShare.debtorId) {
                              return total + ExpenseShare.amount;
                            }
                            return total;
                          }, 0)
                      )}
                      sx={{
                        height: 8,
                        borderRadius: 0.5,
                        bgcolor: "rgba(183, 228, 199, 0.3)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "primary.main",
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                      }}
                    >
                      {new Date(expense.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {expense.shares
                      .sort((a, b) =>
                        a.debtor.name.localeCompare(b.debtor.name)
                      )
                      .map(
                        (ExpenseShare: ExtendedExpenseShare) =>
                          ExpenseShare.debtorId !== expense.payerId && (
                            <ExpenseChip
                              key={ExpenseShare.id}
                              expenseShare={ExpenseShare}
                              expense={expense}
                              onEditExpense={onEditExpense}
                            />
                          )
                      )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, expense);
                    }}
                    sx={{ ml: 1 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
            {index < expenses.length - 1 && (
              <Divider sx={{ mt: 1, mb: 1, ml: 9, mr: 3 }} />
            )}
            <EditExpenseModal
              editExpenseOpen={editExpenseOpen}
              onClose={() => setEditExpenseOpen(false)}
              selectedExpense={selectedExpense}
              onExpenseEdited={onEditExpense}
              closeMenu={() => handleMenuClose()}
            />

            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => handleEdit()}>Editar despesa</MenuItem>

              <MenuItem
                onClick={() => handleDelete()}
                sx={{ color: "error.main" }}
              >
                Deletar despesa
              </MenuItem>
              <MenuItem
                onClick={() => onPayExpense(expense)}
                sx={{ color: "primary.main" }}
              >
                Marcar pago
              </MenuItem>
            </Menu>
          </Box>
        ))}
    </List>
  );
}
