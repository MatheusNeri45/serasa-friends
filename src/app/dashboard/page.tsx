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
import { Grid2 } from "@mui/material";
import { Add as AddIcon, Group as GroupIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CreateGroupModal from "../components/dashboard/modals/create-group-modal";
import { getUserId } from "@/utils/getUserIdLocalStorage";
import { Expense, Group, User } from "@prisma/client";

interface ExtendedGroup extends Group {
  members: User[];
  expenses: Expense[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groups, setGroups] = useState<ExtendedGroup[]>([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchUsers();
    } else {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchGroupsList();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("/api/getUsers");
    const res = await response.json();
    setUsers(res.users);
  };

  const fetchGroupsList = async () => {
    const userId = getUserId();
    const response = await fetch("/api/getAllGroupsUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const res = await response.json();
    console.log(res.groups);
    setGroups(res.groups);
  };

  return (
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
            Serasa-Friends
          </Typography>
          <Avatar sx={{ bgcolor: "primary.main" }}>MN</Avatar>
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
              Your Groups
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage and track your shared expenses
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
            New Group
          </Button>
        </Box>

        <Grid2 container spacing={3}>
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
                      sx={{ color: "primary.main", mr: 1.5, fontSize: "2rem" }}
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
                      (total, expense) => total + expense.value,
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
                              (total, expense) => total + expense.valuePaid,
                              0
                            )) /
                            group.expenses.reduce(
                              (total, expense) => total + expense.value,
                              0
                            )
                        ) || 100
                      }
                      sx={{
                        height: 8,
                        borderRadius: 0.5,
                        bgcolor: "rgba(183, 228, 199, 0.3)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "primary.main",
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
                    Settlement:{" "}
                    {Math.ceil(
                      (100 *
                        group.expenses.reduce(
                          (total, expense) => total + expense.valuePaid,
                          0
                        )) /
                        group.expenses.reduce(
                          (total, expense) => total + expense.value,
                          0
                        )
                    ) || 100}
                    %
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
                      {group.members.map((member) => (
                        <Avatar key={member.id} alt={member.name}>
                          {member.name
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
                      {group.members.length} members
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      <CreateGroupModal
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
      />
    </Box>
  );
}
