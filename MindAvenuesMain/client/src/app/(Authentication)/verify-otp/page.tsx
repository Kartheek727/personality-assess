"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { TextField, Button, Card, CardContent, Typography, Alert, CircularProgress, Box } from "@mui/material";
import { changePasswordWithOtp, clearMessages } from "@/features/password/passwordSlice";
import Footer from "@/components/(Home)/Footer/Footer";
import Header from "@/components/(Home)/Header/header";
import Link from "next/link";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [touched, setTouched] = useState({ otp: false, newPassword: false });

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { loading, error, successMessage } = useAppSelector((state) => state.password);

  useEffect(() => {
    if (!email) router.push("/forgot-password");
  }, [email, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "otp") setOtp(value);
    if (name === "newPassword") setNewPassword(value);
    if (error || successMessage) dispatch(clearMessages());
  };

  const handleBlur = (field: keyof typeof touched) => setTouched((prev) => ({ ...prev, [field]: true }));

  const validateField = (field: keyof typeof touched) => {
    return field === "otp" ? otp.length === 6 : newPassword.length >= 8;
  };

  const validateForm = () => validateField("otp") && validateField("newPassword");

  const handleVerifyOtp = async () => {
    setTouched({ otp: true, newPassword: true });
    if (!validateForm()) {
      toast.error("Please enter a valid 6-digit OTP and password (minimum 8 characters).");
      return;
    }

    const resultAction = await dispatch(changePasswordWithOtp({ email, otp, newPassword }));
    if (changePasswordWithOtp.fulfilled.match(resultAction)) {
      toast.success("Password changed successfully!");
      router.push("/password-changed");
    } else {
      toast.error((resultAction.payload as string) || "Failed to verify OTP");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" color="#9333ea" gutterBottom sx={{ fontWeight: "bold" }}>
              Verify OTP
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4, color: "text.secondary" }}>
              Enter the OTP sent to {email} and your new password.
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="OTP"
                name="otp"
                value={otp}
                onChange={handleChange}
                onBlur={() => handleBlur("otp")}
                required
                fullWidth
                error={touched.otp && !validateField("otp")}
                helperText={touched.otp && !validateField("otp") ? "Enter a 6-digit OTP" : ""}
              />
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={handleChange}
                onBlur={() => handleBlur("newPassword")}
                required
                fullWidth
                error={touched.newPassword && !validateField("newPassword")}
                helperText={touched.newPassword && !validateField("newPassword") ? "Minimum 8 characters" : ""}
              />
            </Box>
            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handleVerifyOtp}
                disabled={loading}
                sx={{ bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" }, "&:disabled": { bgcolor: "grey.500" } }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Verify & Change"}
              </Button>
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 2, color: "text.secondary" }}>
              Back to <Link href="/login" className="text-purple-600 hover:text-purple-800">Login</Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}