"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  Avatar,
  ListItemButton,
  Collapse,
  Divider,
} from "@mui/material";
import { Expense, Group, SplitExpense, User } from "@prisma/client";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { useState } from "react";

interface splitExpenseExtended extends SplitExpense {
  participant: User;
}

interface ExtendedExpense extends Expense {
  paidBy: { id: number; email: string; name: string };
  debtors: Array<splitExpenseExtended>;
}

interface ExtendedGroup extends Group {
  members: User[];
  expenses: ExtendedExpense[];
}

interface SummaryGroupsProps {
  groups: ExtendedGroup[];
  userId: number;
}

export default function Summary({ groups, userId }: SummaryGroupsProps) {
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);

  const handleShowBalanceDetails = (groupId: number) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };
  const calculateGroupBalance = (group: ExtendedGroup) => {
    let totalOwed = 0;
    let totalOwing = 0;
    group.expenses.forEach((expense: ExtendedExpense) => {
      if (expense.paidBy.id === userId) {
        totalOwed = totalOwed + expense.value - (expense.valuePaid || 0);
      }

      const userDebt = expense.debtors.find(
        (debtor: splitExpenseExtended) =>
          debtor.participantId === userId && !debtor.paid
      );
      if (userDebt) {
        totalOwing = totalOwing + userDebt.value;
      }
    });
    return {
      owed: totalOwed.toFixed(2),
      owing: totalOwing.toFixed(2),
      net: (totalOwed - totalOwing).toFixed(2),
    };
  };

  return (
    <Card sx={{ mt: 4, mb: 4, borderRadius: 1 }}>
      <CardContent>
        <List>
          {groups.map((group) => {
            const balance = calculateGroupBalance(group);
            const netBalance = parseFloat(balance.net);
            const isExpanded = expandedGroup === group.id;

            const unpaidExpenses = group.expenses.filter(
              (expense) =>
                expense.paidBy.id === userId &&
                expense.debtors.some((debtor) => !debtor.paid)
            );

            const owedExpenses = group.expenses.filter(
              (expense) =>
                expense.paidBy.id !== userId &&
                expense.debtors.some(
                  (debtor) => debtor.participantId === userId && !debtor.paid
                )
            );

            return (
              <Box key={group.id}>
                <ListItemButton
                  onClick={()=>handleShowBalanceDetails(group.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        netBalance > 0
                          ? "success.main"
                          : netBalance < 0
                          ? "error.main"
                          : "grey.500",
                      width: 48,
                      height: 48,
                    }}
                  >
                    {group.name
                      .split(" ")
                      .slice(0, 2) 
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {group.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                      {parseFloat(balance.owed) > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <ArrowUpwardIcon
                            sx={{ color: "success.main", fontSize: "1rem" }}
                          />
                          <Typography variant="body2" color="success.main">
                            Owed: R$ {balance.owed}
                          </Typography>
                        </Box>
                      )}
                      {parseFloat(balance.owing) > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <ArrowDownwardIcon
                            sx={{ color: "error.main", fontSize: "1rem" }}
                          />
                          <Typography variant="body2" color="error.main">
                            Devendo: R$ {balance.owing}
                          </Typography>
                        </Box>
                      )}
                    </Box>
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
                      borderRadius: 2,
                    }}
                  >
                    {netBalance !== 0 &&
                      (netBalance > 0 ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      ))}
                    <Typography sx={{ fontWeight: 600 }}>
                      R$ {Math.abs(netBalance)}
                    </Typography>
                  </Box>
                </ListItemButton>

                <Collapse in={isExpanded} timeout="auto">
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "background.paper",
                      mb: 2,
                      borderRadius: "0 0 10px 10px",
                    }}
                  >
                    {unpaidExpenses.length === 0 &&
                    owedExpenses.length === 0 ? (
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "success.main",
                          fontWeight: 600,
                          textAlign: "center",
                          py: 2,
                        }}
                      >
                        Você é um péssimo caloteiro! Parabéns!
                      </Typography>
                    ) : (
                      <>
                        {unpaidExpenses.length > 0 && (
                          <>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "success.main",
                                mb: 1,
                                fontWeight: 600,
                              }}
                            >
                              Pessoas te devendo:
                            </Typography>
                            {unpaidExpenses.map((expense) => (
                              <Box key={expense.id} sx={{ mb: 2, pl: 2 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                  {expense.description}
                                </Typography>
                                {expense.debtors
                                  .filter((debtor) => !debtor.paid)
                                  .map((debtor) => (
                                    <Typography
                                      key={debtor.id}
                                      variant="body2"
                                      sx={{ color: "text.secondary", pl: 1 }}
                                    >
                                      {debtor.participant.name}: R$ {" "}
                                      {debtor.value.toFixed(2)}
                                    </Typography>
                                  ))}
                              </Box>
                            ))}
                            {owedExpenses.length > 0 && (
                              <Divider sx={{ my: 2 }} />
                            )}
                          </>
                        )}

                        {owedExpenses.length > 0 && (
                          <>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "error.main",
                                mb: 1,
                                fontWeight: 600,
                              }}
                            >
                              Você deve:
                            </Typography>
                            {owedExpenses.map((expense) => {
                              const debtAmount =
                                expense.debtors.find(
                                  (debtor) => debtor.participantId === userId
                                )?.value || 0;
                              return (
                                <Box key={expense.id} sx={{ mb: 1, pl: 2 }}>
                                  <Typography variant="body2">
                                    {expense.description} (para{" "}
                                    {expense.paidBy.name}): R${" "}
                                    {debtAmount.toFixed(2)}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </>
                        )}
                      </>
                    )}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
