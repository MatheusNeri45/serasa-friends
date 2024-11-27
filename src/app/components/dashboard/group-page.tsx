"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  List,
  IconButton,
  AvatarGroup,
  ListItemButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { Grid2 } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddMemberModal from "./modals/add-member-modal";
import AddExpenseModal from "./modals/add-expense-modal";
import { Expense, Group, SplitExpense, User } from "@prisma/client";
import ExpensesList from "../expenses-list";

interface splitExpenseExtended extends SplitExpense {
  participant: User;
}

interface extendedExpense extends Expense {
  paidBy: User;
  debtors: Array<splitExpenseExtended>;
}

interface ExtendedGroup extends Group {
  members: User[];
  expenses: extendedExpense[];
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

export default function GroupPageClient() {
  const router = useRouter();
  const { groupId } = useParams();
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [group, setGroup] = useState<ExtendedGroup>();

  useEffect(() => {
    fetchGroupInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGroupInfo = async () => {
    const response = await fetch("/api/getGroupInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: Number(groupId) }),
    });
    const res = await response.json();
    setGroup(res.group);
  };

  const onDeleteExpense = async (expenseId: number) => {
    const response = await fetch("/api/deleteExpense", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseId: expenseId }),
    });
    const res = await response.json();
    console.log(res);
    fetchGroupInfo();
  };

  const handleShowBalanceDetails = (memberId: number, balance: number) => {
    // Here you can implement the logic to show balance details
    console.log(
      `Showing balance details for member ${memberId} with balance ${balance}`
    );
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ pt: 3, pb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                // flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <IconButton
                onClick={() => router.push("/dashboard")}
                sx={{
                  mb: 2,
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "rgba(45, 106, 79, 0.08)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s",
                  alignSelf:"center",
                  mr:"4px"
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{display:"flex", flexDirection:"column"}}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background:
                      "linear-gradient(45deg, #1B4332 30%, #2D6A4F 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.5px",
                    mb: 1,
                  }}
                >
                  {group?.name}
                </Typography>
                <AvatarGroup
                  max={4}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      fontSize: "0.875rem",
                      bgcolor: "primary.main",
                      border: "2px solid white",
                      
                    },
                    alignSelf:"flex-start",
                  }}
                >
                  {group?.members.map((member) => (
                    <Avatar key={member.id} alt={member.name}>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={() => setAddMemberOpen(true)}
                sx={{
                  borderRadius: "10px",
                  px: 3,
                  py: 1.5,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    bgcolor: "rgba(45, 106, 79, 0.08)",
                  },
                }}
              >
                Add Member
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddExpenseOpen(true)}
                sx={{
                  borderRadius: "10px",
                  px: 3,
                  py: 1.5,
                  boxShadow: "0 4px 14px rgba(45, 106, 79, 0.25)",
                }}
              >
                Add Expense
              </Button>
            </Box>
          </Box>

          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 0.5,
                  background:
                    "linear-gradient(145deg, #FFFFFF 0%, #F8FAF9 100%)",
                  boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      background:
                        "linear-gradient(45deg, #1B4332 30%, #2D6A4F 90%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.5px",
                      mb: 3,
                      pb: 2,
                      borderBottom: "2px solid rgba(27, 67, 50, 0.08)",
                      textAlign: "center",
                    }}
                  >
                    Recent Expenses
                  </Typography>

                  {group?.expenses && (
                    <ExpensesList
                      expenses={group?.expenses}
                      onDeleteExpense={onDeleteExpense}
                      onEditExpense={() => fetchGroupInfo()}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 0.5,
                  background:
                    "linear-gradient(145deg, #FFFFFF 0%, #F8FAF9 100%)",
                  boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      background:
                        "linear-gradient(45deg, #1B4332 30%, #2D6A4F 90%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.5px",
                      mb: 3,
                      pb: 2,
                      borderBottom: "2px solid rgba(27, 67, 50, 0.08)",
                      textAlign: "center",
                    }}
                  >
                    Balances
                  </Typography>
                  <List sx={{ px: 1 }}>
                    {group?.members.map((member: User) => {
                      const totalPaid = group.expenses
                        .filter((expense) => expense.paidBy.id === member.id)
                        .reduce((total, expense) => total + expense.value, 0);

                      const totalDebt = group.expenses
                        .filter((expense) =>
                          expense.debtors.some(
                            (debtor) => debtor.participantId === member.id
                          )
                        )
                        .map((expense) =>
                          expense.debtors
                            .filter(
                              (debtor) => debtor.participantId === member.id
                            )
                            .map((debtor) => debtor.value)
                        )
                        .reduce(
                          (total, values) =>
                            total +
                            values.reduce((sum, value) => sum + value, 0),
                          0
                        );
                      const balance = Number(
                        (totalPaid - totalDebt).toFixed(2)
                      );

                      return (
                        <ListItemButton
                          key={member.id}
                          onClick={() =>
                            handleShowBalanceDetails(member.id, balance)
                          }
                          sx={{
                            px: 2,
                            py: 1.5,
                            mb: 2,
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
                              {member.name
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
                                {member.name}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                background: getBalanceGradient(balance),
                                color: "white",
                                py: 1.5,
                                px: 2.5,
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                ml: "auto",
                                minWidth: "120px",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              }}
                            >
                              {balance > 0 ? (
                                <ArrowUpwardIcon fontSize="small" />
                              ) : balance < 0 ? (
                                <ArrowDownwardIcon fontSize="small" />
                              ) : null}
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "1.1rem",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                ${Math.abs(balance)}
                              </Typography>
                            </Box>
                          </Box>
                        </ListItemButton>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Box>
      </Container>

      <AddMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onAddMember={() => fetchGroupInfo()}
      />

      <AddExpenseModal
        open={addExpenseOpen}
        onClose={() => setAddExpenseOpen((prev) => !prev)}
        onExpenseCreated={() => fetchGroupInfo()}
      />
    </Box>
  );
}
