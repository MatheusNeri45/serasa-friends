"use client";

import { useEffect } from "react";
import {
  Modal,
  Fade,
  Box,
  Typography,
  IconButton,
  SxProps,
  Theme,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

export interface ConfirmationModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
}

const styles: Record<string, SxProps<Theme>> = {
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "relative",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: "0 8px 32px rgba(27, 67, 50, 0.12)",
    p: 3,
    maxWidth: 400,
    width: "90%",
    mx: 2,
    border: "1px solid",
    borderColor: "primary.light",
  },
  content: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  icon: {
    color: "primary.main",
    fontSize: "2rem",
  },
  message: {
    color: "text.primary",
    fontWeight: 500,
    flexGrow: 1,
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    color: "text.secondary",
  },
};

// Component
export default function ConfirmationModal({
  open,
  message,
  onClose,
  autoHideDuration = 3000,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition sx={styles.modal}>
      <Fade in={open}>
        <Box sx={styles.paper}>
          <IconButton onClick={onClose} sx={styles.closeButton} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box sx={styles.content}>
            <CheckCircleIcon sx={styles.icon} />
            <Typography variant="body1" sx={styles.message}>
              {message}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
