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
import CustomAlert from "../components/alert";

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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ status: false, message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchUser();
  };

  const fetchUser = async () => {
    const fullName = name + " " + surName;
    const res = await fetch("api/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, fullName }),
      credentials: "include",
    });
    const response = await res.json();
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setAlert({ status: true, message: response.message });
    }
  };

  return (
    <Container maxWidth="sm">
      {alert.status && (
        <CustomAlert
          message={alert.message}
          onClose={() => setAlert({ status: false, message: "" })}
        />
      )}
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Paper sx={{ width: "100%", p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Crie sua conta
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nome"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Sobrenome"
              margin="normal"
              value={surName}
              onChange={(e) => setSurName(e.target.value)}
            />
            <TextField
              fullWidth
              label="E-mail"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              fullWidth
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
              disabled={loading}
            >
              {loading ? "Criando conta" : "Criar conta"}
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link href="/" underline="hover">
              Já tem uma conta? Faça o login clicando aqui!
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
