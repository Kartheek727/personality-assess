//src/app/(Authentication)/register/page.tsx
"use client";

import React, { useState } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { TextField, Button, Card, CardContent, Typography, InputAdornment, IconButton, Stepper, Step, StepLabel, Alert, CircularProgress, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { registerUser } from "@/features/auth/authApi";
import { clearError, setRegistering } from "@/features/auth/authSlice";
import Header from "@/components/(Home)/Header/header";
import Footer from "@/components/(Home)/Footer/Footer";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
}

interface TouchedFields {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  mobileNumber: boolean;
  password: boolean;
}

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({ firstName: "", lastName: "", email: "", password: "", mobileNumber: "" });
  const [touched, setTouched] = useState<TouchedFields>({ firstName: false, lastName: false, email: false, mobileNumber: false, password: false });
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
    switch (field) {
      case "firstName":
      case "lastName":
        return formData[field].trim().length >= 2;
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case "mobileNumber":
        return /^\+?[1-9]\d{1,14}$/.test(formData.mobileNumber);
      case "password":
        return formData.password.length >= 8;
      default:
        return true;
    }
  };

  const validateStep = () => activeStep === 0
    ? validateField("firstName") && validateField("lastName") && validateField("email") && validateField("mobileNumber")
    : validateField("password");

  const handleNext = async () => {
    setTouched({ firstName: true, lastName: true, email: true, mobileNumber: true, password: true });
    if (!validateStep()) {
      toast.error(activeStep === 0 ? "Please enter valid personal info" : "Password must be at least 8 characters");
      return;
    }

    if (activeStep === 1) {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        const user = resultAction.payload as { id: string; email: string };
        dispatch(setRegistering(true));
        localStorage.setItem("userId", user.id);
        toast.success("Registration successful! Please verify your OTP.");
        router.push("/verify");
      } else {
        toast.error((resultAction.payload as string) || "Registration failed");
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" color="#9333ea" gutterBottom sx={{ fontWeight: "bold" }}>
              Create an Account
            </Typography>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              <Step><StepLabel>Personal Info</StepLabel></Step>
              <Step><StepLabel>Security</StepLabel></Step>
            </Stepper>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {activeStep === 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("firstName")}
                  required
                  fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment> }}
                  error={touched.firstName && !validateField("firstName")}
                  helperText={touched.firstName && !validateField("firstName") ? "Minimum 2 characters" : ""}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("lastName")}
                  required
                  fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment> }}
                  error={touched.lastName && !validateField("lastName")}
                  helperText={touched.lastName && !validateField("lastName") ? "Minimum 2 characters" : ""}
                />
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
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur("mobileNumber")}
                  required
                  fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment> }}
                  error={touched.mobileNumber && !validateField("mobileNumber")}
                  helperText={touched.mobileNumber && !validateField("mobileNumber") ? "Enter a valid mobile number" : ""}
                />
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
            )}
            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "space-between" }}>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  sx={{ borderColor: "#9333ea", color: "#9333ea", "&:hover": { borderColor: "#7e22ce" } }}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                sx={{ bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" }, "&:disabled": { bgcolor: "grey.500" }, flexGrow: activeStep === 0 ? 1 : 0 }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : activeStep === 0 ? "Next" : "Sign Up"}
              </Button>
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 2, color: "text.secondary" }}>
              Already have an account? <Link href="/login" className="text-purple-600 hover:text-purple-800">Log in</Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}