"use client";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
  AvatarGroup,
} from "@mui/material";
import { Category as OtherIcon } from "@mui/icons-material";
import { Grid2 } from "@mui/material";
import { Add as AddIcon, Group as GroupIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CreateGroupModal from "../components/dashboard/modals/create-group-modal";
import {
  Expense,
  Group,
  ExpenseShare,
  User,
  GroupMember,
} from "@prisma/client";
import Summary from "../components/dashboard/summary";
import UserMenu from "../components/user-menu";
import DashboardSkeleton from "../components/dashboard/dashboard-skeleton";

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

interface ExtendedGroupMember extends GroupMember {
  user: { id: number; name: string; email: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groups, setGroups] = useState<ExtendedGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupsList();
  }, []);

  const fetchGroupsList = async () => {
    const response = await fetch("/api/getAllGroupsUser", {
      headers: {},
    });
    const res = await response.json();
    setGroups(res.groups);
  };
  const onFinishedLoading = () => {
    setLoading(false);
  };
  return loading ? (
    <DashboardSkeleton />
  ) : (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ bgcolor: "white", color: "text.primary" }}
      >
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

      <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(45deg, #1B4332 30%, #2D6A4F 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
                mb: 1,
              }}
            >
              Seus grupos
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Fique de olho e cobre o seu amigo caloteiro!
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateGroupOpen(true)}
            sx={{
              borderRadius: "10px",
              px: 3,
              py: 1.5,
              boxShadow: "0 4px 12px rgba(45, 106, 79, 0.2)",
            }}
          >
            Novo grupo
          </Button>
        </Box>

        <Grid2 container spacing={3}>
          {groups?.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 3,
                bgcolor: "background.paper",
                borderRadius: 4,
                width: "100%",
                height: "100%",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
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
                Você não está em nenhum grupo.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                {
                  "Seus amigos gostam tanto de você que você ainda não tem grupos, ou amigos."
                }
              </Typography>
            </Box>
          )}
          {groups.map((group) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={group.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "transform 0.2s",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
                onClick={() => router.push(`/dashboard/${group.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <GroupIcon
                      sx={{
                        color: "primary.main",
                        mr: 1.5,
                        fontSize: "2rem",
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "primary.dark",
                        lineHeight: 1.2,
                      }}
                    >
                      {group.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "primary.main",
                      fontWeight: 800,
                      mb: 2,
                      display: "flex",
                      alignItems: "baseline",
                      gap: 0.5,
                    }}
                  >
                    R$
                    {group.expenses.reduce(
                      (total, expense) => total + expense.amount,
                      0
                    )}
                    <Typography
                      component="span"
                      variant="subtitle2"
                      sx={{
                        color: "text.secondary",
                        fontWeight: "normal",
                      }}
                    >
                      total
                    </Typography>
                  </Typography>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={
                        Math.ceil(
                          (100 *
                            group.expenses.reduce(
                              (total, expense) => total + expense.paidAmount,
                              0
                            )) /
                            group.expenses.reduce(
                              (total, expense) => total + expense.amount,
                              0
                            )
                        ) || 100
                      }
                      sx={{
                        height: 8,
                        borderRadius: 0.5,
                        bgcolor: "rgba(183, 228, 199, 0.3)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor:
                            group.expenses.length > 0
                              ? "primary.main"
                              : "grey.400",
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      fontWeight: 500,
                    }}
                  >
                    {group.expenses.length > 0
                      ? "Dívidas pagas:" +
                          Math.ceil(
                            (100 *
                              group.expenses.reduce(
                                (total, expense) => total + expense.paidAmount,
                                0
                              )) /
                              group.expenses.reduce(
                                (total, expense) => total + expense.amount,
                                0
                              )
                          ) +
                          "%" || 100 + "%"
                      : "Sem dívidas por enquanto."}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
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
                      }}
                    >
                      {group.members.map((groupMember: ExtendedGroupMember) => (
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
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    >
                      {group.members.length} membros
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
        {groups.length > 0 && (
          <Summary groups={groups} onFinishedLoading={onFinishedLoading} />
        )}
      </Container>

      <CreateGroupModal
        open={createGroupOpen}
        setCreatedGroupOpen={setCreateGroupOpen}
        onGroupCreated={() => fetchGroupsList()}
      />
    </Box>
  );
}
