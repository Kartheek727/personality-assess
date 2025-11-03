// src/components/LoginButton.tsx
"use client";

import React from "react";
import Button from "@mui/material/Button";
import Link from "next/link";
import { User } from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAuth } from "@/contexts/AuthContext";

const LoginButton: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return isAuthenticated && user ? (
    <Box
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1, 
        padding: "6px 12px", 
        border: "1px solid", 
        borderColor: '#1a62a4', // Blue border
        borderRadius: 2, 
        cursor: "pointer",
        '&:hover': { 
          borderColor: '#f47528', // Orange highlight on hover
          color: '#fc9054', // Bright orange accent on hover
        }
      }}
      component={Link}
      href="/profile"
    >
      <Typography variant="body2" sx={{ color: '#1a62a4' }}>{user.firstName || "User"}</Typography>
      <User size={18} color="#1a62a4" />
    </Box>
  ) : (
    <Button 
      component={Link} 
      href="/login" 
      variant="outlined" 
      sx={{ 
        borderColor: '#1a62a4', // Blue border
        color: '#1a62a4', // Blue text
        borderRadius: 2, 
        textTransform: "none",
        '&:hover': {
          borderColor: '#f47528', // Orange highlight
          color: '#fc9054', // Bright orange accent
        }
      }}
    >
      Login / Signup
    </Button>
  );
};

export default LoginButton;