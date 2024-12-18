'use client';

import {
  Box,
  Container,
  Paper,
  Skeleton,
} from '@mui/material';

export default function ForgotPasswordSkeleton() {
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
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
          <Skeleton 
            variant="circular" 
            width={64} 
            height={64} 
            sx={{ 
              mb: 2,
              mx: 'auto',
              bgcolor: 'rgba(183, 228, 199, 0.2)'
            }} 
          />
          <Skeleton 
            variant="text" 
            width={300} 
            height={60} 
            sx={{ 
              mb: 2,
              mx: 'auto',
              bgcolor: 'rgba(183, 228, 199, 0.2)'
            }} 
          />
          <Skeleton 
            variant="text" 
            width={240} 
            height={32} 
            sx={{ 
              mx: 'auto',
              bgcolor: 'rgba(183, 228, 199, 0.2)'
            }} 
          />
        </Box>

        {/* Form Section */}
        <Paper 
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
            p: 4,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Skeleton 
              variant="rectangular" 
              height={56} 
              sx={{ 
                borderRadius: 1,
                bgcolor: 'rgba(0, 0, 0, 0.1)'
              }} 
            />
          </Box>

          <Skeleton 
            variant="rectangular" 
            height={48} 
            sx={{ 
              borderRadius: 6,
              bgcolor: 'rgba(27, 67, 50, 0.1)'
            }} 
          />

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Skeleton 
              variant="rectangular" 
              width={120} 
              height={36} 
              sx={{ 
                mx: 'auto',
                borderRadius: 1,
                bgcolor: 'rgba(27, 67, 50, 0.1)'
              }} 
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}