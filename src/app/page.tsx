"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [userId, setUserId] = useState<number|null>(null)

  // Validar quando tiver os 3 apenas
  async function onSubmit() {
    const data = {
      email: email,
      name: name,
      password: password,
    };
    const res = await fetch("api/createUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),

    });
    const response = await res.json();
    const userFound = response.userFound
    if (userFound && userFound.id) {
      setUserId(userFound.id)
      router.push("/groups");
    }
  }
  useEffect(() => {
    const userId = Number(localStorage.getItem("id"))
    if (userId) {
      localStorage.setItem("id",String(userId));
      router.push("/groups");
    }
  }, [userId, router]);

  return (
    <div>
      <h1>Login</h1>
      <Stack width={300} gap={1}>
        <TextField
          id="filled-basic"
          label="Full name"
          variant="filled"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
          placeholder="Full name"
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
