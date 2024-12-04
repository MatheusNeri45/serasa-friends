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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUser();
  };

  const fetchUser = async () => {
    const res = await fetch("api/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({ email, password, name }),
      credentials: "include",
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      console.error("Authentication failed");
    }
  };

  return (
    <Container maxWidth="sm">
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
