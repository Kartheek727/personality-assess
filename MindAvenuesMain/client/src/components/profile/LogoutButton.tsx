// src/components/profile/LogoutButton.tsx
"use client";

import React from "react";
import { Button } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
      <Button
        variant="contained"
        onClick={logout}
        sx={{
          flex: 1,
          bgcolor: "#f47528",
          borderRadius: "9999px",
          py: 1.5,
          "&:hover": { bgcolor: "#fc9054" },
        }}
      >
        Logout
      </Button>
    </motion.div>
  );
};

export default LogoutButton;