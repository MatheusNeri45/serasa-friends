"use client";

import {
  List,
  ListItemButton,
  Box,
  Avatar,
  Typography,
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

interface ExtendedGroupMember extends GroupMember {
  user: { id: number; name: string; email: string };
}

interface ExtendedExpenseShare extends ExpenseShare {
  debtor: User;
}

interface ExtendedExpense extends Expense {
  payer: User;
  shares: Array<ExtendedExpenseShare>;
}

interface ExtendedGroup extends Group {
  members: ExtendedGroupMember[];
  expenses: ExtendedExpense[];
}
interface BalanceListProps {
  group: ExtendedGroup | undefined;
}

const getBalanceColor = (balance: number) => {
  if (balance > 0) return "#2D6A4F";
  if (balance < 0) return "#D62828";
  return "#666666";
};

const getBalanceGradient = (balance: number) => {
  if (balance > 0) return "linear-gradient(45deg, #2D6A4F 30%, #40916C 90%)";
  if (balance < 0) return "linear-gradient(45deg, #D62828 30%, #F94144 90%)";
  return "linear-gradient(45deg, #666666 30%, #888888 90%)";
};

export default function BalanceList({ group }: BalanceListProps) {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const handleShowBalanceDetails = (memberId: string) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  return (
    //NOTE LOGICA DE NEGOCIO NO FRONT AQUI REVISAR
    <List sx={{ px: 1 }}>
      {group?.members.map((groupMember: ExtendedGroupMember) => {
        const totalPaid =
          group.expenses
            .filter((expense) => expense.payer.id === groupMember.user.id)
            .reduce((total, expense) => total + expense.amount, 0) -
          group.expenses
            .filter((expense) => expense.payer.id === groupMember.user.id)
            .reduce((total, expense) => total + (expense.paidAmount || 0), 0);

        const totalDebt = group.expenses
          .filter((expense) =>
            expense.shares.some(
              (share: ExtendedExpenseShare) =>
                share.debtor.id === groupMember.user.id && share.paid === false
            )
          )
          .map((expense: ExtendedExpense) =>
            expense.shares
              .filter(
                (share: ExtendedExpenseShare) =>
                  share.debtor.id === groupMember.user.id &&
                  share.paid === false
              )
              .map((share: ExtendedExpenseShare) => share.amount)
          )
          .reduce(
            (total, amounts) =>
              total + amounts.reduce((sum, amount) => sum + amount, 0),
            0
          );

        const balance = Number((totalPaid - totalDebt).toFixed(2));
        const isExpanded = expandedMember === String(groupMember.user.id);

        const unpaidExpenses = group.expenses.filter(
          (expense: ExtendedExpense) =>
            expense.payer.id === groupMember.user.id &&
            expense.shares.some((share: ExtendedExpenseShare) => !share.paid)
        );

        const owedExpenses = group.expenses.filter(
          (expense: ExtendedExpense) =>
            expense.payer.id !== groupMember.user.id &&
            expense.shares.some(
              (share) => share.debtor.id === groupMember.user.id && !share.paid
            )
        );

        return (
          <Box key={groupMember.user.id}>
            <ListItemButton
              onClick={() =>
                handleShowBalanceDetails(String(groupMember.user.id))
              }
              sx={{
                px: 2,
                py: 1.5,
                mb: isExpanded ? 0 : 2,
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
                    bgcolor: getBalanceColor(balance),
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    flexShrink: 0,
                  }}
                >
                  {groupMember.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
                <Box
                  sx={{
                    width: "140px",
                    overflow: "visible",
                    textOverflow: "ellipsis",
                    whiteSpace: "noWrap",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      color: "primary.dark",
                      maxWidth: "60px",
                    }}
                  >
                    {groupMember.user.name.split(" ")[0] +
                      " " +
                      groupMember.user.name.split(" ")[1][0] +
                      "."}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: getBalanceGradient(balance),
                    color: "white",
                    py: 1.5,
                    px: 2.5,
                    borderRadius: "10px",
                    display: "inline",
                    alignItems: "center",
                    gap: 1,
                    ml: "auto",
                    minWidth: "120px",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    textAlign: "center",
                  }}
                >
                  {balance > 0 ? (
                    <ArrowUpwardIcon
                      sx={{ verticalAlign: "middle", mr: 0.5 }}
                      fontSize="small"
                    />
                  ) : balance < 0 ? (
                    <ArrowDownwardIcon
                      sx={{ verticalAlign: "middle", mr: 0.5 }}
                      fontSize="small"
                    />
                  ) : null}
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      letterSpacing: "0.5px",
                      display: "inline",
                      verticalAlign: "middle",
                      textAlign: "right",
                    }}
                  >
                    R$ {Math.abs(balance)}
                  </Typography>
                </Box>
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
                {unpaidExpenses.length === 0 && owedExpenses.length === 0 ? (
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
                          sx={{ color: "success.main", mb: 1, fontWeight: 600 }}
                        >
                          Pessoas te devendo:
                        </Typography>
                        {unpaidExpenses.map((expense: ExtendedExpense) => (
                          <Box key={expense.id} sx={{ mb: 2, pl: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              {expense.description}
                            </Typography>
                            {expense.shares
                              .filter(
                                (share: ExtendedExpenseShare) => !share.paid
                              )
                              .map((share: ExtendedExpenseShare) => (
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
                        {owedExpenses.length > 0 && <Divider sx={{ my: 2 }} />}
                      </>
                    )}

                    {owedExpenses.length > 0 && (
                      <>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "error.main", mb: 1, fontWeight: 600 }}
                        >
                          Você deve:
                        </Typography>
                        {owedExpenses.map((expense) => {
                          const debtAmount =
                            expense.shares.find(
                              (share: ExtendedExpenseShare) =>
                                share.debtor.id === groupMember.user.id
                            )?.amount || 0;
                          return (
                            <Box key={expense.id} sx={{ mb: 1, pl: 2 }}>
                              <Typography variant="body2">
                                {expense.description} (para {expense.payer.name}
                                ): R$ {debtAmount.toFixed(2)}
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
  );
}
