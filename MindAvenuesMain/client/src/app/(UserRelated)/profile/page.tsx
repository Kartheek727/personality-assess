// src/app/(UserRelated)/profile/page.tsx
"use client";

import React, { useEffect } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProfileData } from "@/features/profile/profileSlice";
import { useAuth } from "@/contexts/AuthContext";
import { Container, Typography, Box, CircularProgress, Button } from "@mui/material";
import { motion } from "framer-motion";
import UserDetailsCard from "@/components/profile/UserDetailsCard";
import AssessmentsCard from "@/components/profile/AssessmentsCard";
import PaymentsCard from "@/components/profile/PaymentsCard";
import ChangePasswordCard from "@/components/profile/ChangePasswordCard";
import LogoutButton from "@/components/profile/LogoutButton";
import { useRouter } from "next/navigation";
import Header from "@/components/(Home)/Header/header";
import Footer from "@/components/(Home)/Footer/Footer";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, assessments, payments, loading, error } = useAppSelector((state) => state.profile);
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchProfileData());
    }
  }, [dispatch, isAuthenticated, user]);

  if (loading || authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress sx={{ color: "#1a62a4" }} />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography sx={{ color: "#f47528" }}>{error || "Failed to load profile"}</Typography>
      </Box>
    );
  }

  const handleAdminRedirect = () => router.push("/admin");

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3rem" },
                  background: "linear-gradient(to right, #1a62a4, #f47528)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Your Profile
              </Typography>
              <Typography sx={{ color: "#045494", mt: 2, fontSize: { xs: "1rem", md: "1.25rem" } }}>
                Manage your details, assessments, and payments with ease.
              </Typography>
            </motion.div>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
            <Box sx={{ flex: { xs: "1", md: "0 0 350px" }, display: "flex", flexDirection: "column", gap: 4 }}>
              <UserDetailsCard user={user} />
              <ChangePasswordCard />
              <Box sx={{ display: "flex", gap: 2 }}>
                <LogoutButton />
                {isAdmin && (
                  <Button
                    variant="contained"
                    onClick={handleAdminRedirect}
                    sx={{ flex: 1, bgcolor: "#1a62a4", borderRadius: "9999px", "&:hover": { bgcolor: "#f47528" } }}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </Box>
            </Box>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <AssessmentsCard assessments={assessments} />
              <PaymentsCard payments={payments} />
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ProfilePage;