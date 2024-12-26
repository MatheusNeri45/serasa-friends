"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  IconButton,
  AvatarGroup,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { Grid2 } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddMemberModal from "./modals/add-member-modal";
import AddExpenseModal from "./modals/add-expense-modal";
import {
  Expense,
  Group,
  ExpenseShare,
  User,
  GroupMember,
} from "@prisma/client";
import ExpensesList from "../expenses-list";
import BalanceList from "./balance-list";
import UserMenu from "../user-menu";
import GroupPageSkeleton from "../skeletons/group-page-skeleton";
import ConfirmationModal from "../confirmation-alert";

interface ExtendedGroupMember extends GroupMember {
  user: { id: number; name: string; email: string };
}

interface ExtendedExpenseShare extends ExpenseShare {
  debtor: User;
}

interface extendedExpense extends Expense {
  payer: User;
  shares: ExtendedExpenseShare[];
}

interface ExtendedGroup extends Group {
  members: ExtendedGroupMember[];
  expenses: extendedExpense[];
}

export default function GroupPageClient() {
  const router = useRouter();
  const { groupId } = useParams();
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [group, setGroup] = useState<ExtendedGroup>();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ status: false, message: "" });

  useEffect(() => {
    fetchGroupInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGroupInfo = async () => {
    const response = await fetch("/api/getGroupInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupId: Number(groupId) }),
    });
    const res = await response.json();
    setGroup(res.group);
    setLoading(false);
  };

  const onDeleteExpense = async (expenseId: number) => {
    const response = await fetch("/api/deleteExpense", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expenseId: expenseId }),
    });
    const res = await response.json();
    setAlert({ status: false, message: res.message });
    fetchGroupInfo();
  };

  const onEditExpense = async (message: string, status: boolean) => {
    fetchGroupInfo();
    setAlert({ status: status, message: message });
  };

  return loading ? (
    <GroupPageSkeleton />
  ) : (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 4 }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ bgcolor: "white", color: "text.primary" }}
      >
        {!alert.status && alert.message !== "" && (
          <ConfirmationModal
            open={true}
            message={alert.message}
            onClose={() => setAlert({ status: false, message: "" })}
          />
        )}
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, color: "primary.main", fontWeight: "bold" }}
          >
            Serasa Friends
          </Typography>
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Toolbar />
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
                  alignSelf: "center",
                  mr: "4px",
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                    alignSelf: "flex-start",
                  }}
                >
                  {group?.members.map((groupMember: ExtendedGroupMember) => (
                    <Avatar
                      key={groupMember.user.id}
                      alt={groupMember.user.name}
                    >
                      {groupMember.user.name
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
                Adicionar membro
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
                Adicionar despesa
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
                    Despesas do Grupo
                  </Typography>

                  {group?.expenses && (
                    <ExpensesList
                      expenses={group?.expenses}
                      onDeleteExpense={onDeleteExpense}
                      onEditExpense={onEditExpense}
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
                    Saldos
                  </Typography>
                  <BalanceList group={group} />
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
        onExpenseCreated={onEditExpense}
      />
    </Box>
  );
}
