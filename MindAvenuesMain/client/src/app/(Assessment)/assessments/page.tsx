// src/app/(Assessment)/assessments/page.tsx
"use client";

import React, { useEffect } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { fetchAssessments, fetchAssessmentResponseById } from "@/features/assessment/assessmentApi";
import { fetchPDFLogo } from "@/features/image/imageSlice";
import toast from "react-hot-toast";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { generatePDF } from "@/utils/pdfGenerator";
import Header from "@/components/(Home)/Header/header";
import Footer from "@/components/(Home)/Footer/Footer";
import { IAssessmentResponse } from "@/types/backendTypes";

const AssessmentsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, isPaid, loading: authLoading, user } = useAuth();
  const { assessments, loading, error } = useAppSelector((state) => state.assessment);
  const { pdfLogo } = useAppSelector((state) => state.image);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!isPaid) {
      router.push("/inner-mind-map");
      return;
    }
    dispatch(fetchAssessments())
      .catch((err: unknown) => {
        const errorMessage = (err as { message?: string })?.message || "Failed to load assessments.";
        toast.error(errorMessage);
      });
    if (!pdfLogo) {
      dispatch(fetchPDFLogo());
    }
  }, [dispatch, isAuthenticated, isPaid, router, pdfLogo]);

  const hasTakenAssessment = (assessmentId: string): boolean =>
    user?.completedAssessments?.some((ca) => ca.assessment === assessmentId) || false;

  const handleDownloadReport = async (assessmentId: string) => {
    try {
      const response: IAssessmentResponse = await dispatch(fetchAssessmentResponseById(assessmentId)).unwrap();
      await generatePDF(response, user, pdfLogo);
    } catch (error: unknown) {
      console.error("Failed to download report", error);
      toast.error("Failed to download report");
    }
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress size={40} sx={{ color: "#1a62a4" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" sx={{ color: "#f47528" }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff", py: 8 }}>
        <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 } }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography variant="h2" sx={{ fontWeight: "bold", textAlign: "center", mb: 6, background: "linear-gradient(to right, #1a62a4, #f47528)", WebkitBackgroundClip: "text", color: "transparent", fontSize: { xs: "2rem", md: "3rem" } }}>
              Your Assessments
            </Typography>
          </motion.div>

          {assessments.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", color: "#045494" }}>
              No assessments available yet.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {assessments.map((assessment) => {
                const isTaken = hasTakenAssessment(assessment._id);
                return (
                  <Grid item xs={12} sm={6} md={4} key={assessment._id}>
                    <Card
                      sx={{
                        bgcolor: "#ffffff",
                        borderRadius: "24px",
                        border: "2px solid #1a62a4",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        position: "relative",
                        overflow: "hidden",
                        minHeight: "250px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "translateY(-5px)" },
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                      >
                        <Box sx={{ px: { xs: 2, md: 4 }, py: 2, position: "relative", zIndex: 1 }}>
                          <CardContent sx={{ flexGrow: 1, p: 0 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, minHeight: "48px", color: "#1a62a4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {assessment.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#045494", minHeight: "60px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {isTaken ? "You’ve completed this assessment. Download your report!" : "Explore your mind with this assessment."}
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ p: 0, justifyContent: "center" }}>
                            {isTaken ? (
                              <Button
                                variant="outlined"
                                onClick={() => handleDownloadReport(assessment._id)}
                                sx={{
                                  borderColor: "#f47528",
                                  color: "#f47528",
                                  "&:hover": { borderColor: "#fc9054", color: "#fc9054" },
                                  py: 1,
                                  px: 3,
                                  borderRadius: "9999px",
                                  width: "180px",
                                  textAlign: "center",
                                }}
                              >
                                Download Report
                              </Button>
                            ) : (
                              <Button
                                component={Link}
                                href={`/assessments/${assessment._id}`}
                                variant="contained"
                                sx={{
                                  bgcolor: "#1a62a4",
                                  "&:hover": { bgcolor: "#045494" },
                                  py: 1,
                                  px: 3,
                                  borderRadius: "9999px",
                                  width: "180px",
                                  textAlign: "center",
                                  color: "#ffffff",
                                }}
                              >
                                Take Assessment
                              </Button>
                            )}
                          </CardActions>
                        </Box>
                        {/* Decorative Elements */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: "10%",
                            left: "-40px",
                            width: "80px",
                            height: "80px",
                            bgcolor: "#f47528",
                            borderRadius: "50%",
                            opacity: 0.15,
                            zIndex: 0,
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: "10%",
                            right: "-40px",
                            width: "100px",
                            height: "100px",
                            bgcolor: "#fc9054",
                            borderRadius: "50%",
                            opacity: 0.15,
                            zIndex: 0,
                          }}
                        />
                      </motion.div>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default AssessmentsPage;