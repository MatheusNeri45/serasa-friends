"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "@prisma/client";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    pixKey: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchLoggedUser();
  }, []);

  const fetchLoggedUser = async () => {
    try {
      const response = await fetch("/api/getLoggedUser", {
        headers: {
        },
      });
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phoneNumber: data.user.phoneNumber || "",
          pixKey: data.user.pixKey || "",
        });
      }
    } catch (error) {
      setError("Failed to load profile");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully");
        setUser(data.user);
        setIsEditing(false);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      setError("Failed to update profile");
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{
              color: "primary.main",
              "&:hover": {
                bgcolor: "rgba(45, 106, 79, 0.08)",
              },
            }}
          >
            Voltar
          </Button>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(45deg, #1B4332 30%, #2D6A4F 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Informações da conta
          </Typography>
        </Box>

        {(error || success) && (
          <Alert
            severity={error ? "error" : "success"}
            sx={{ mb: 3 }}
            onClose={() => {
              setError("");
              setSuccess("");
            }}
          >
            {error || success}
          </Alert>
        )}

        <Card
          sx={{
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                }}
              >
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {user.name}
                </Typography>
                <Typography color="text.secondary">{user.email}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    disabled
                    fullWidth
                    label="Nome"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    // disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    disabled
                    label="E-mail"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    // disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Chave Pix"
                    value={formData.pixKey}
                    onChange={(e) =>
                      setFormData({ ...formData, pixKey: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                {isEditing ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || "",
                          email: user.email || "",
                          phoneNumber: user.phoneNumber || "",
                          pixKey: user.pixKey || "",
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        boxShadow: "0 4px 14px rgba(45, 106, 79, 0.25)",
                      }}
                    >
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    sx={{
                      boxShadow: "0 4px 14px rgba(45, 106, 79, 0.25)",
                    }}
                  >
                    Editar informações
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
