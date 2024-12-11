"use client";

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomAlert from "../components/alert";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ status: false, message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUser();
  };

  const fetchUser = async () => {
    const res = await fetch("api/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
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
              label="Nome e Sobrenome"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              label="Palavra-chave"
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
              sx={{ mt: 3 }}
            >
              Criar Conta
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
