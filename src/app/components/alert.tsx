'use client';

import { Alert, AlertColor, Collapse, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';

interface AlertProps {
  message: string;
  severity?: AlertColor;
  onClose?: () => void;
  autoHideDuration?: number;
  show?: boolean;
}

export default function CustomAlert({
  message,
  severity = 'error',
  onClose,
  autoHideDuration = 6000,
  show = true,
}: AlertProps) {
  const [open, setOpen] = useState(show);

  useEffect(() => {
    setOpen(show);
  }, [show]);

  useEffect(() => {
    if (autoHideDuration && open) {
      const timer = setTimeout(() => {
        setOpen(false);
        onClose?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, open, onClose]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          mb: 2,
          alignItems: 'center',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '& .MuiAlert-icon': {
            fontSize: '24px',
            opacity: 0.9,
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          {message}
        </Typography>
      </Alert>
    </Collapse>
  );
}