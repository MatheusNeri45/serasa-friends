"use client";

import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  //Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

export default function UserMenu() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    fetchLoggedUser();
  }, []);

  const fetchLoggedUser = async () => {
    const response = await fetch("/api/getLoggedUser");
    const res = await response.json();
    setUser(res.user);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push("/profile");
    handleClose();
  };

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      // method: "POST",
      // headers: { "Content-Type": "application/json" },
      // credentials: "include",
    });
    if (res.ok) {
      router.push("/");
      handleClose();
    }
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          ml: 2,
          "&:hover": {
            transform: "scale(1.1)",
            transition: "transform 0.2s",
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
            border: "2px solid white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            fontSize: "1rem",
          }}
        >
          {user?.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ mb: 0.5 }}>
            <strong>{user?.name}</strong>
          </Box>
          <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            {user?.email}
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Conta</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: "error.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
