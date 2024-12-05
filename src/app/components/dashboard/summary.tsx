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
import {
  Expense,
  Group,
  ExpenseShare,
  User,
  GroupMember,
} from "@prisma/client";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { useState } from "react";
interface owedExpenses extends ExtendedExpense {
  debtAmount: number;
}
interface groupBalances {
  id: number;
  balance: {
    netBalance: number;
    unpaidExpenses: ExtendedExpense[];
    owedExpenses: owedExpenses[];
    owed: string;
    owing: string;
  };
}

interface ExtendedGroupMember extends GroupMember {
  user: { id: number; name: string; email: string };
}

interface ExtendedExpenseShare extends ExpenseShare {
  debtor: User;
}

interface ExtendedExpense extends Expense {
  payer: { id: number; email: string; name: string };
  shares: ExtendedExpenseShare[];
}

interface ExtendedGroup extends Group {
  members: ExtendedGroupMember[];
  expenses: ExtendedExpense[];
}

interface SummaryGroupsProps {
  groups: ExtendedGroup[];
  groupBalances: groupBalances[];
}

export default function Summary({ groups, groupBalances }: SummaryGroupsProps) {
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);

  const handleShowBalanceDetails = (groupId: number) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };


  return (
    <Card sx={{ mt: 4, mb: 4, borderRadius: 1 }}>
      <CardContent>
        <List>
          {groups.map((group: ExtendedGroup) => {
            const groupBalance = groupBalances.find(
              (groupBalance: groupBalances) => groupBalance.id === group.id
            ) as groupBalances | undefined;

            const netBalance = groupBalance?.balance.netBalance || 0;
            const owedExpenses = groupBalance?.balance.owedExpenses || [];
            const owed: number = Number(groupBalance?.balance.owed) || 0;
            const owing: number = Number(groupBalance?.balance.owing) || 0;
            const unpaidExpenses = groupBalance?.balance.unpaidExpenses || [];
            const isExpanded = expandedGroup === group.id;

            return (
              <Box key={group.id}>
                <ListItemButton
                  onClick={() => handleShowBalanceDetails(group.id)}
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
                      {owed > 0 && (
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
                            Te devem: R$ {owed}
                          </Typography>
                        </Box>
                      )}
                      {owing > 0 && (
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
                            Devendo: R$ {owing}
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
                                {expense.shares
                                  .filter((share) => !share.paid)
                                  .map((share) => (
                                    <Typography
                                      key={share.id}
                                      variant="body2"
                                      sx={{ color: "text.secondary", pl: 1 }}
                                    >
                                      {share.debtor.name}: R${" "}
                                      {share.amount.toFixed(2)}
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
                            {owedExpenses.map((expense) => (
                              <Box key={expense.id} sx={{ mb: 2, pl: 2 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                  {expense.description}
                                </Typography>
                                {owedExpenses
                                  .map((expense) => (
                                    <Typography
                                      key={expense.id}
                                      variant="body2"
                                      sx={{ color: "text.secondary", pl: 1 }}
                                    >
                                      {expense.payer.name}: R${" "}
                                      {expense.debtAmount.toFixed(2)}
                                    </Typography>
                                  ))}
                              </Box>
                            ))}
                            {owedExpenses.length > 0 && (
                              <Divider sx={{ my: 2 }} />
                            )}
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
