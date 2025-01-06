"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItemButton,
  Avatar,
  Collapse,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Warning as AlertIcon,
  Group as UsersIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  ExpandMore as ChevronDownIcon,
} from "@mui/icons-material";

interface Share {
  shareId: number;
  amount: number;
  paid: boolean;
}

interface Expense {
  expenseId: number;
  description: string;
  amount: number;
  shares: Share[];
}

interface Debt {
  expenseId: number;
  description: string;
  amount: number;
}

interface FriendBalance {
  userId: number;
  name: string;
  email: string;
  loggedUserOwing: Expense[];
  owedToLoggedUser: Debt[];
}

export default function FriendsBalance() {
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [balances, setBalances] = useState<FriendBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await fetch("/api/getUserFriendBalances");
        if (!response.ok) throw new Error("Failed to fetch balances");
        const data = await response.json();
        setBalances(data.combinedResults);
      } catch (error) {
        console.error("Error fetching balances:", error);
        setError("Failed to load balances");
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  const calculateNetBalance = (friend: FriendBalance) => {
    const totalOwing = friend.loggedUserOwing.reduce(
      (sum, expense) => sum + expense.shares[0].amount,
      0
    );
    const totalOwed = friend.owedToLoggedUser.reduce(
      (sum, debt) => sum + debt.amount,
      0
    );
    return totalOwed - totalOwing;
  };

  if (loading) {
    return (
      <Card
        sx={{ borderRadius: 2, boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)" }}
      >
        <CardContent sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={40} thickness={4} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        sx={{ borderRadius: 2, boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)" }}
      >
        <CardContent>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!balances?.length) {
    return (
      <Card
        sx={{ borderRadius: 2, boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)" }}
      >
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <UsersIcon
            sx={{ fontSize: 48, mb: 2, color: "rgba(45, 106, 79, 0.5)" }}
          />
          <Typography variant="h6" sx={{ mb: 1, color: "text.primary" }}>
            Sem despesas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adicione despesas com seus amigos, se você tiver algum.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{ borderRadius: 2, boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)" }}
    >
      <CardContent>
        <List sx={{ px: 1 }}>
          {balances.map((friend, index) => {
            const netBalance = calculateNetBalance(friend);
            const isExpanded = expandedUser === friend.userId;
            const totalOwing = friend.loggedUserOwing.reduce(
              (sum, expense) => sum + expense.shares[0].amount,
              0
            );
            const totalOwed = friend.owedToLoggedUser.reduce(
              (sum, debt) => sum + debt.amount,
              0
            );

            return (
              <Box key={friend.userId}>
                <ListItemButton
                  onClick={() =>
                    setExpandedUser(isExpanded ? null : friend.userId)
                  }
                  sx={{
                    px: 2,
                    py: 1.5,
                    mb: 1,
                    borderRadius: "10px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(45, 106, 79, 0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor:
                          netBalance > 0
                            ? "success.main"
                            : netBalance < 0
                            ? "error.main"
                            : "grey.500",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                      }}
                    >
                      {friend.name.charAt(0)}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {friend.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {friend.email}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        bgcolor:
                          netBalance > 0
                            ? "success.main"
                            : netBalance < 0
                            ? "error.main"
                            : "grey.500",
                        color: "white",
                        py: 1,
                        px: 2,
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {netBalance !== 0 &&
                        (netBalance > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                      <Typography sx={{ fontWeight: 700 }}>
                        ${Math.abs(netBalance).toFixed(2)}
                      </Typography>
                    </Box>

                    <ChevronDownIcon
                      sx={{
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </Box>
                </ListItemButton>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      pl: 7,
                      pr: 2,
                      py: 2,
                      bgcolor: "background.default",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                        pb: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Saldo
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color:
                              totalOwed > totalOwing
                                ? "success.main"
                                : "error.main",
                            fontWeight: 600,
                          }}
                        >
                          ${Math.abs(totalOwed - totalOwing).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    {friend.loggedUserOwing.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "error.main",
                            fontWeight: 600,
                            mb: 1.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          Expandido:
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: "error.main" }}
                          ></Typography>
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {friend.loggedUserOwing.map((expense) => (
                            <Chip
                              key={expense.expenseId}
                              label={`${
                                expense.description
                              }: $${expense.shares[0].amount.toFixed(2)}`}
                              sx={{
                                bgcolor: "error.lighter",
                                color: "error.main",
                                fontWeight: 500,
                                "&:hover": {
                                  bgcolor: "error.light",
                                },
                                transition: "all 0.2s",
                              }}
                              onClick={() => {
                                /* Handle click to show expense details */
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {friend.loggedUserOwing.length > 0 &&
                      friend.owedToLoggedUser.length > 0 && (
                        <Divider sx={{ my: 2 }} />
                      )}

                    {friend.owedToLoggedUser.length > 0 && (
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "success.main",
                            fontWeight: 600,
                            mb: 1.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          Te devem:
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: "success.main" }}
                          >
                            (R$ {totalOwed.toFixed(2)})
                          </Typography>
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {friend.owedToLoggedUser.map((debt) => (
                            <Chip
                              key={debt.expenseId}
                              label={`${
                                debt.description
                              }: $${debt.amount.toFixed(2)}`}
                              sx={{
                                bgcolor: "success.lighter",
                                color: "success.main",
                                fontWeight: 500,
                                "&:hover": {
                                  bgcolor: "success.light",
                                },
                                transition: "all 0.2s",
                              }}
                              onClick={() => {
                                /* Handle click to show expense details */
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {friend.loggedUserOwing.length === 0 &&
                      friend.owedToLoggedUser.length === 0 && (
                        <Box
                          sx={{
                            textAlign: "center",
                            py: 3,
                            color: "text.secondary",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <AlertIcon />
                          <Typography variant="body2">
                            Sem despesas ativas com esse amigo.
                          </Typography>
                        </Box>
                      )}
                  </Box>
                </Collapse>

                {index < balances.length - 1 && (
                  <Divider
                    sx={{
                      my: isExpanded ? 2 : 1,
                      opacity: isExpanded ? 1 : 0.5,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
