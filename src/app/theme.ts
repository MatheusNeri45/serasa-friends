'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1B4332', // Darker forest green
      light: '#2D6A4F',
      dark: '#081C15',
    },
    secondary: {
      main: '#B7E4C7', // Soft mint green
      light: '#D8F3DC',
      dark: '#95D5B2',
    },
    background: {
      default: '#F8FAF9',
      paper: '#FFFFFF',
    },
    success: {
      main: '#2D6A4F',
    },
    error: {
      main: '#D62828',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 30,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(27, 67, 50, 0.25)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2D6A4F',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 10,
          backgroundColor: '#D8F3DC',
        },
      },
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});