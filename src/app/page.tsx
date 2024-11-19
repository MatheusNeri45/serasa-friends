"use client";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  // NOTE: warning de tipos aqui, o puglin do ts no vscode deveria estar funcionando
  const [name, setName] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [userId, setUserId] = useState<number | null>(null);

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
    const userFound = response.userFound;
    if (userFound && userFound.id) {
      // NOTE: vc deveria setar o userId no localStorage aqui
      // NOTE: o userId não precisa estar no estado sendo q vc já consegue acessar do localStorage
      // NOTE crie uma função utilitaria pra acessar o userId do localStorage "getUserId"
      setUserId(userFound.id);
      router.push("/groups");
    }
  }

  // NOTE: o papel desse effect deveria ser só verificar se o userId está no localStorage e redirecionar, não precisa do set
  useEffect(() => {
    // NOTE: vc criou uma variavel local userId e uma variavel de estado userId isso pode dar conflito
    const userId = Number(localStorage.getItem("id"));
    if (userId) {
      // NOTE: Pq setando o id no localStorage? se vc acabou de carregar ele de lá
      // NOTE: agora entendi q vc quer setar o userId carregado no onSubmit
      localStorage.setItem("id", String(userId));
      router.push("/groups");
    }
    // NOTE: o use effect vai rodar toda vez q o userId ou o router mudar de valor vc n quer isso, vc quer rodar isso só uma vez
  }, [userId, router]);

  // NOTE: cade o feedback de erro ao fazer login com senha incorreta?

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
