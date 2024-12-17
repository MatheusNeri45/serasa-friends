"use client";

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  keyframes,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AccountBalanceWallet } from "@mui/icons-material";
import CustomAlert from "./components/alert";

const dotsAnimation = keyframes`
  0% {
    content: "";
  }
  33% {
    content: ".";
  }
  66% {
    content: "..";
  }
  100% {
    content: "...";
  }
`;
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ status: false, message: "" });

  const fetchUser = async () => {
    const res = await fetch("api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const response = await res.json();
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setAlert({ status: true, message: response.message });
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetchUser();
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
            Serasa Friends
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              fontWeight: 500,
              color: "#B7E4C7",
            }}
          >
            Outro app para você dever seus amigos
          </Typography>
        </Box>
        {alert.status && (
          <CustomAlert
            message={alert.message}
            onClose={() => setAlert({ status: false, message: "" })}
          />
        )}
        <Paper
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
            p: 4,
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-mail"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Palavra-chave"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              disabled={loading}
              variant="contained"
              size="large"
              type="submit"
              sx={{
                py: 2,
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                ...(loading && {
                  "&::after": {
                    content: '""',
                    display: "inline-block",
                    animation: `${dotsAnimation} 1.5s infinite steps(3)`,
                  },
                }),
                boxShadow: "0 4px 14px 0 rgba(27, 67, 50, 0.4)",
              }}
            >
              {loading ? "Entrando" : "Entrar"}
            </Button>
          </form>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Link
              href="/register"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {"Ainda não tem uma conta? Cadastre-se clicando aqui."}
            </Link>
            <br></br>
            <Link
              href="/password-reset"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {"Esqueceu sua senha? Clique aqui para modificá-la."}
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
