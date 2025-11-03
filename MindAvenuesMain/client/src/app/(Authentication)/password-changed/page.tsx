"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Footer from "@/components/(Home)/Footer/Footer";
import Header from "@/components/(Home)/Header/header";

export default function PasswordChangedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000); // Redirect after 3 seconds
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3 }}>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: "#9333ea", mb: 2 }} />
            <Typography variant="h4" align="center" color="#9333ea" gutterBottom sx={{ fontWeight: "bold" }}>
              Password Changed
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4, color: "text.secondary" }}>
              Your password has been successfully updated. You will be redirected to the login page shortly.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                component={Link}
                href="/login"
                sx={{ bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" } }}
              >
                Go to Login Now
              </Button>
            </Box>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}