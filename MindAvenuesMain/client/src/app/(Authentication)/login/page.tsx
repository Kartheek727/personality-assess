"use client";

import React, { useState } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { TextField, Button, Card, CardContent, Typography, InputAdornment, IconButton, Alert, CircularProgress, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { loginUser } from "@/features/auth/authApi";
import { clearError } from "@/features/auth/authSlice";
import Footer from "@/components/(Home)/Footer/Footer";
import Header from "@/components/(Home)/Header/header";

interface FormData {
  email: string;
  password: string;
}

interface TouchedFields {
  email: boolean;
  password: boolean;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [touched, setTouched] = useState<TouchedFields>({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearError());
  };

  const handleBlur = (field: keyof TouchedFields) => setTouched((prev) => ({ ...prev, [field]: true }));

  const validateField = (field: keyof FormData) => {
    return field === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) : formData.password.length >= 8;
  };

  const validateForm = () => validateField("email") && validateField("password");

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    if (!validateForm()) {
      toast.error("Please enter a valid email and password (minimum 8 characters).");
      return;
    }

    const resultAction = await dispatch(loginUser({ email: formData.email, password: formData.password }));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error((resultAction.payload as string) || "Login failed");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" color="#9333ea" gutterBottom sx={{ fontWeight: "bold" }}>
              Log In
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4, color: "text.secondary" }}>
              Welcome back! Please enter your credentials.
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                required
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }}
                error={touched.email && !validateField("email")}
                helperText={touched.email && !validateField("email") ? "Enter a valid email" : ""}
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                required
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={touched.password && !validateField("password")}
                helperText={touched.password && !validateField("password") ? "Minimum 8 characters" : ""}
              />
            </Box>
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Link href="/forgot-password" className="text-purple-600 hover:text-purple-800 text-sm">
                Forgot Password?
              </Link>
            </Box>
            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handleLogin}
                disabled={loading}
                sx={{ bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" }, "&:disabled": { bgcolor: "grey.500" } }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Log In"}
              </Button>
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 2, color: "text.secondary" }}>
              Don’t have an account? <Link href="/register" className="text-purple-600 hover:text-purple-800">Register</Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}