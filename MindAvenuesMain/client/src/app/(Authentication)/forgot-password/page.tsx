"use client";

import React, { useState } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TextField, Button, Card, CardContent, Typography, InputAdornment, Alert, CircularProgress, Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { forgotPassword } from "@/features/password/passwordSlice";
import { clearMessages } from "@/features/password/passwordSlice";
import Footer from "@/components/(Home)/Footer/Footer";
import Header from "@/components/(Home)/Header/header";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, successMessage } = useAppSelector((state) => state.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error || successMessage) dispatch(clearMessages());
  };

  const handleBlur = () => setTouched(true);

  const validateEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleForgotPassword = async () => {
    setTouched(true);
    if (!validateEmail()) {
      toast.error("Please enter a valid email.");
      return;
    }

    const resultAction = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(resultAction)) {
      toast.success("OTP sent to your email!");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } else {
      toast.error((resultAction.payload as string) || "Failed to send OTP");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" color="#9333ea" gutterBottom sx={{ fontWeight: "bold" }}>
              Forgot Password
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4, color: "text.secondary" }}>
              Enter your email to receive a password reset OTP.
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }}
              error={touched && !validateEmail()}
              helperText={touched && !validateEmail() ? "Enter a valid email" : ""}
            />
            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handleForgotPassword}
                disabled={loading}
                sx={{ bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" }, "&:disabled": { bgcolor: "grey.500" } }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send OTP"}
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