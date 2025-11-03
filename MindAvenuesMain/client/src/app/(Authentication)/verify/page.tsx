//src/app/(Authentication)/register/page.tsx
"use client";

import React, { useState } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { TextField, Button, Card, CardContent, Typography, InputAdornment, Alert, CircularProgress, Box } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { verifyOtp } from "@/features/auth/authApi";
import { clearError } from "@/features/auth/authSlice";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);
  const userId = localStorage.getItem("userId");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    if (error) dispatch(clearError());
  };

  const handleVerify = async () => {
    if (!userId) {
      toast.error("No user ID found. Please register again.");
      router.push("/register");
      return;
    }
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    const resultAction = await dispatch(verifyOtp({ userId, otp }));
    if (verifyOtp.fulfilled.match(resultAction)) {
      toast.success("Verification successful! You are now logged in.");
      localStorage.removeItem("userId");
      router.push("/");
    } else {
      toast.error((resultAction.payload as string) || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" color="#9333ea" gutterBottom sx={{ fontWeight: "bold" }}>
            Verify Your Account
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, color: "text.secondary" }}>
            Enter the 6-digit OTP sent to your email or mobile.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="OTP"
              value={otp}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ maxLength: 6 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><VpnKeyIcon color="action" /></InputAdornment> }}
              error={otp.length > 0 && (otp.length !== 6 || !/^\d+$/.test(otp))}
              helperText={otp.length > 0 && (otp.length !== 6 || !/^\d+$/.test(otp)) ? "Enter a valid 6-digit OTP" : ""}
            />
          </Box>
          <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading}
              sx={{ bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" }, "&:disabled": { bgcolor: "grey.500" } }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Verify"}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2, color: "text.secondary" }}>
            Back to <Link href="/register" className="text-purple-600 hover:text-purple-800">Register</Link> or{" "}
            <Link href="/login" className="text-purple-600 hover:text-purple-800">Log in</Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}