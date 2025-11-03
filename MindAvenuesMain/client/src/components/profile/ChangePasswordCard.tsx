// src/components/profile/ChangePasswordCard.tsx
"use client";

import React, { useState } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { changePassword } from "@/features/password/passwordSlice";
import { Card, CardContent, Typography, TextField, Button, Box, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ChangePasswordCard: React.FC = () => {
  const dispatch = useDispatch();
  const { loading } = useAppSelector((state) => state.password);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [touched, setTouched] = useState({ oldPassword: false, newPassword: false });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "oldPassword") setOldPassword(value);
    if (name === "newPassword") setNewPassword(value);
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateField = (field: "oldPassword" | "newPassword") =>
    field === "oldPassword" ? oldPassword.length >= 8 : newPassword.length >= 8;

  const validateForm = () => validateField("oldPassword") && validateField("newPassword");

  const handleSubmit = async () => {
    setTouched({ oldPassword: true, newPassword: true });
    if (!validateForm()) {
      toast.error("Both passwords must be at least 8 characters long.");
      return;
    }

    const resultAction = await dispatch(changePassword({ oldPassword, newPassword }));
    if (changePassword.fulfilled.match(resultAction)) {
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setTouched({ oldPassword: false, newPassword: false });
    } else {
      toast.error((resultAction.payload as string) || "Failed to update password");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <Card sx={{ borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)", border: "1px solid #1a62a4/20" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a62a4", mb: 3 }}>
            Change Password
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Old Password"
              name="oldPassword"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, oldPassword: true }))}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#045494" }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                      {showOldPassword ? <VisibilityOffIcon sx={{ color: "#045494" }} /> : <VisibilityIcon sx={{ color: "#045494" }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#f47528" } } }}
              error={touched.oldPassword && !validateField("oldPassword")}
              helperText={touched.oldPassword && !validateField("oldPassword") ? "Minimum 8 characters" : ""}
            />
            <TextField
              label="New Password"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#045494" }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      {showNewPassword ? <VisibilityOffIcon sx={{ color: "#045494" }} /> : <VisibilityIcon sx={{ color: "#045494" }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "#f47528" } } }}
              error={touched.newPassword && !validateField("newPassword")}
              helperText={touched.newPassword && !validateField("newPassword") ? "Minimum 8 characters" : ""}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                bgcolor: "#1a62a4",
                borderRadius: "9999px",
                py: 1.5,
                "&:hover": { bgcolor: "#f47528" },
                "&:disabled": { bgcolor: "grey.500" },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#ffffff" }} /> : "Update Password"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChangePasswordCard;