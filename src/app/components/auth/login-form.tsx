"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginForm() {
  const [tab, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Try demo@example.com / password");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("email")}
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          {...register("password")}
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mt: 3 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : tab === 0 ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Box>
  );
}