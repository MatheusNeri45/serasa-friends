"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import ForgotPasswordSkeleton from "../components/skeletons/reset-password-skeleton";

const UpdatePasswordPage = () => {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPasswordPage />
    </Suspense>
  );
}
const ForgotPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState({
    password: "",
    confirmationPassword: "",
  });
  const [submitStatus, setSubmitStatus] = useState("not sent");
  const [alert, setAlert] = useState({ status: false, message: "" });

  const updatePassword = async () => {
    const token = searchParams.get("token");
    const res = await fetch("/api/updatePassword", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password.password, token: token }),
    });
    const response = await res.json();
    if (res.ok) {
      setAlert({ status: false, message: response.message });
      setSubmitStatus("sent");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      setAlert({ status: true, message: response.message });
      setSubmitStatus("not sent");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("sending");
    updatePassword();
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
            Preencha os campos para alterar a senha
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
                "Sua senha foi alterada. Você está sendo redirecionado..."
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
              label="Nova senha"
              type="password"
              value={password.password}
              onChange={(e) =>
                setPassword((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Confirmação da nova senha"
              type="password"
              value={password.confirmationPassword}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  confirmationPassword: e.target.value,
                }))
              }
              required
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={
                submitStatus === "sending" ||
                submitStatus === "sent" ||
                password.confirmationPassword !== password.password ||
                !password.password ||
                !password.confirmationPassword
              }
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
                ? "Alterando senha..."
                : "Alterar senha"}
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
};

export default UpdatePasswordPage;