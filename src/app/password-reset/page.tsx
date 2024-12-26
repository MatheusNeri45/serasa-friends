"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { AccountBalanceWallet, ArrowBack } from "@mui/icons-material";
import CustomAlert from "@/app/components/alert";
import ConfirmationModal from "../components/confirmation-alert";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState("not sent");
  const [alert, setAlert] = useState({ status: false, message: "" });

  const generatePasswordResetLink = async () => {
    const res = await fetch("/api/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const response = await res.json();
    if (res.ok) {
      setAlert({ status: false, message: response.message });
      setSubmitStatus("sent");
    } else {
      setAlert({ status: true, message: response.message });
      setSubmitStatus("not sent");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("sending");
    generatePasswordResetLink();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #1B4332 0%, #081C15 100%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", color: "white", mb: 4 }}>
          <AccountBalanceWallet
            sx={{ fontSize: 64, color: "#B7E4C7", mb: 2 }}
          />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              letterSpacing: "-1px",
              background: "linear-gradient(45deg, #B7E4C7 30%, #FFFFFF 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              mb: 2,
            }}
          >
            Resetar senha
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              fontWeight: 500,
              color: "#B7E4C7",
            }}
          >
            Informe o e-mail para receber as instruções
          </Typography>
        </Box>

        <Paper
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
            p: 4,
          }}
        >
          {!alert.status && submitStatus === "sent" && (
            <ConfirmationModal
              message={
                "O e-mail foi enviado, favor verificar suas caixas de spam e lixo. Você está sendo redirecionado..."
              }
              onClose={() => router.push("/")}
              open={true}
            />
          )}
          {alert.status && (
            <CustomAlert
              message={alert.message}
              onClose={() => setAlert({ status: false, message: "" })}
            />
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={submitStatus === "sending" || submitStatus === "sent"}
              sx={{
                py: 2,
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                boxShadow: "0 4px 14px 0 rgba(27, 67, 50, 0.4)",
              }}
            >
              {submitStatus === "sending"
                ? "Enviando..."
                : "Enviar solicitação de reset de senha"}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push("/")}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "rgba(45, 106, 79, 0.08)",
                },
              }}
            >
              Voltar
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
