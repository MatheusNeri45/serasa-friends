"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Fazer o post com todos os dados de login para criar usuario
// Pegar ID retornado pelo post e guardar no local storage
// Redirecionar o usuário à página principal
// *usar effect -> verificar se tem id no local storage e redirecionar o user para pagina de logged in

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validar quando tiver os 3 apenas
  async function onSubmit() {
    const request = {
      email: email,
      name: name,
      password: password,
    };
    const res = await fetch("api/createUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    const response = await res.json();
    if (response.user && response.user.id) {
      localStorage.setItem("id", response.user.id);
      router.push("/expenses");
    }
  }
  useEffect(() => {
    const storedUser = localStorage.getItem("id");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user) {
      router.push("/expenses");
    }
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <Stack width={300} gap={1}>
        <TextField
          id="filled-basic"
          label="Username"
          variant="filled"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
          placeholder="Username"
        />
        <TextField
          id="filled-basic"
          label="E-mail"
          variant="filled"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
          }}
          placeholder="Email"
        />
        <TextField
          id="filled-basic"
          label="Password"
          variant="filled"
          type="password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
          }}
          placeholder="Password"
        />
        <Button variant="outlined" onClick={onSubmit}>
          Criar conta
        </Button>
      </Stack>
    </div>
  );
}
