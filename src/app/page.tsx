'use client';

import { Box, Container, Paper, Typography, TextField, Button, Link } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AccountBalanceWallet } from '@mui/icons-material';
import { getUserId } from '@/utils/getUserIdLocalStorage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchUser = async () =>{
    const res = await fetch('api/login',{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email, password}),
      
    })
    console.log(res)
    const response = await res.json()
    console.log(response)
    if(response.userFound){
      localStorage.setItem('id', String(response.id))
      router.push('/dashboard')
    }
  }

  useEffect(()=>{
    const userId = getUserId()
    if(userId){
      router.push("/dashboard")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchUser()
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #1B4332 0%, #081C15 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
          <AccountBalanceWallet sx={{ fontSize: 64, color: '#B7E4C7', mb: 2 }} />
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{
              fontWeight: 800,
              letterSpacing: '-1px',
              background: 'linear-gradient(45deg, #B7E4C7 30%, #FFFFFF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              mb: 2
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9,
              fontWeight: 500,
              color: '#B7E4C7'
            }}
          >
            Outro app para você dever seus amigos
          </Typography>
        </Box>

        <Paper 
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
            p: 4
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ 
                py: 2,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                boxShadow: '0 4px 14px 0 rgba(27, 67, 50, 0.4)',
              }}
            >
              Sign In
            </Button>
          </form>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link 
              href="/register" 
              sx={{ 
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {"Don't have an account? Sign up"}
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}