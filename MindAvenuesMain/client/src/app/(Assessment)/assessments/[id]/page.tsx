// src/app/(Assessment)/assessments/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter, useParams } from "next/navigation";
import {
  fetchAssessmentById,
  takeAssessment,
  fetchAssessmentResponseById,
} from "@/features/assessment/assessmentApi";
import { fetchProfile } from "@/features/auth/authApi";
import { fetchPDFLogo } from "@/features/image/imageSlice";
import toast from "react-hot-toast";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { motion } from "framer-motion";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useAuth } from "@/contexts/AuthContext";
import { generatePDF } from "@/utils/pdfGenerator";
import Footer from "@/components/(Home)/Footer/Footer";
import Header from "@/components/(Home)/Header/header";
import { IAssessmentResponse } from "@/types/backendTypes";

const AssessmentDetailPage = () => {
  const dispatch = useDispatch(); // Use `any` temporarily if redux typing is incomplete
  const router = useRouter();
  const { id } = useParams();
  const { isAuthenticated, isPaid, loading: authLoading, user } = useAuth();
  const { currentAssessment, loading, error } = useAppSelector(
    (state) => state.assessment
  );
  const { pdfLogo } = useAppSelector((state) => state.image);

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!isPaid) {
      router.push("/inner-mind-map");
      return;
    }

    dispatch(fetchProfile())
      .unwrap()
      .catch((err: unknown) => console.error("Failed to fetch profile:", err));

    dispatch(fetchAssessmentById(id as string))
      .unwrap()
      .catch((err: unknown) =>
        toast.error((err as { message?: string })?.message || "Failed to load assessment")
      );

    if (!pdfLogo) {
      dispatch(fetchPDFLogo());
    }
  }, [dispatch, isAuthenticated, isPaid, router, id, pdfLogo]);

  const hasTakenAssessment =
    user?.completedAssessments?.some((ca) => ca.assessment === id) || false;

  const handleSingleChoiceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedOptionIds([event.target.value]);
  };

  const handleMultipleChoiceChange = (optionId: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = async () => {
    if (selectedOptionIds.length === 0) {
      toast.error("Please select at least one option.");
      return;
    }

    try {
      await dispatch(
        takeAssessment({ assessmentId: id as string, selectedOptionIds })
      ).unwrap();
      const response: IAssessmentResponse = await dispatch(
        fetchAssessmentResponseById(id as string)
      ).unwrap();
      await generatePDF(response, user, pdfLogo); // Types match: IAssessmentResponse, IUser | null, IPDFLogo | null
      await dispatch(fetchProfile()).unwrap();
      toast.success("Assessment submitted successfully!");
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string })?.message || "Failed to submit assessment";
      if (
        errorMessage.includes(
          "User cannot take the same assessment multiple times"
        ) ||
        (err as { status?: number })?.status === 409
      ) {
        const response: IAssessmentResponse = await dispatch(
          fetchAssessmentResponseById(id as string)
        ).unwrap();
        await generatePDF(response, user, pdfLogo); // Types match
        await dispatch(fetchProfile()).unwrap();
        toast.success("Assessment already completed!");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response: IAssessmentResponse = await dispatch(
        fetchAssessmentResponseById(id as string)
      ).unwrap();
      await generatePDF(response, user, pdfLogo); // Types match
    } catch (error: unknown) {
      console.error("Failed to download PDF", error);
      toast.error("Failed to download PDF");
    }
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
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

  if (!currentAssessment || currentAssessment._id !== id) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" sx={{ color: "#045494" }}>
          Assessment not found or loading...
        </Typography>
      </Box>
    );
  }

  const { question } = currentAssessment;
  const isMultipleChoice = question.type === "multiple";

  return (
    <>
      <Header />
      <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff", py: 8 }}>
        <Box sx={{ maxWidth: "800px", mx: "auto", px: { xs: 2, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                mb: 4,
                background: "linear-gradient(to right, #1a62a4, #f47528)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontSize: { xs: "1.5rem", md: "2.5rem" },
              }}
            >
              {currentAssessment.title}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              sx={{
                bgcolor: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                border: "1px solid #1a62a4/20",
                p: 4,
              }}
            >
              <CardContent>
                {hasTakenAssessment ? (
                  <Box
                  sx={{
                    py: 8,
                    bgcolor: "#ffffff",
                    borderRadius: "24px",
                    maxWidth: "900px",
                    mx: "auto",
                    mb: 12,
                    position: "relative",
                    overflow: "hidden",
                    border: "2px solid #1a62a4",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  >
                    <Box sx={{ textAlign: "center", px: { xs: 2, md: 4 }, position: "relative", zIndex: 1 }}>
                      <CelebrationIcon
                        sx={{ fontSize: 60, color: "#f47528", mb: 3 }}
                      />
                      <Typography
                        variant="h3"
                        sx={{
                          color: "#1a62a4",
                          fontWeight: 800,
                          mb: 3,
                          fontSize: { xs: "2rem", md: "2.5rem" },
                          textTransform: "uppercase",
                        }}
                      >
                        Congratulations!
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#045494",
                          mb: 4,
                          maxWidth: "700px",
                          mx: "auto",
                          lineHeight: 1.7,
                          fontSize: "1.1rem",
                        }}
                      >
                        You have completed this assessment successfully.
                      </Typography>
                      <Box sx={{ display: "inline-block" }}>
                        <Button
                          variant="contained"
                          onClick={handleDownloadPDF}
                          sx={{
                            bgcolor: "#1a62a4",
                            py: 1,
                            px: 3,
                            borderRadius: "9999px",
                            "&:hover": { bgcolor: "#045494" },
                            color: "#ffffff",
                          }}
                        >
                          Download PDF
                        </Button>
                      </Box>
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
                </Box>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "medium", mb: 2, color: "#1a62a4" }}
                    >
                      {question.text || "Question not available"}
                    </Typography>
                    {question.customInstructions && (
                      <Typography
                        variant="body2"
                        sx={{ color: "#045494", mb: 2 }}
                      >
                        {question.customInstructions}
                      </Typography>
                    )}
                    <FormControl component="fieldset">
                      {isMultipleChoice ? (
                        <FormGroup>
                          {question.options.map((option) => (
                            <FormControlLabel
                              key={option._id}
                              control={
                                <Checkbox
                                  checked={selectedOptionIds.includes(
                                    option._id
                                  )}
                                  onChange={() =>
                                    handleMultipleChoiceChange(option._id)
                                  }
                                  sx={{
                                    color: "#1a62a4",
                                    "&.Mui-checked": { color: "#f47528" },
                                  }}
                                />
                              }
                              label={option.text}
                              sx={{ mb: 1, color: "#045494" }}
                            />
                          ))}
                        </FormGroup>
                      ) : (
                        <RadioGroup
                          value={selectedOptionIds[0] || ""}
                          onChange={handleSingleChoiceChange}
                        >
                          {question.options.map((option) => (
                            <FormControlLabel
                              key={option._id}
                              value={option._id}
                              control={
                                <Radio
                                  sx={{
                                    color: "#1a62a4",
                                    "&.Mui-checked": { color: "#f47528" },
                                  }}
                                />
                              }
                              label={option.text}
                              sx={{ mb: 1, color: "#045494" }}
                            />
                          ))}
                        </RadioGroup>
                      )}
                    </FormControl>
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || selectedOptionIds.length === 0}
                        sx={{
                          bgcolor: "#1a62a4",
                          py: 1.5,
                          px: 4,
                          borderRadius: "9999px",
                          "&:hover": { bgcolor: "#045494" },
                          "&:disabled": { bgcolor: "grey.500" },
                          color: "#ffffff",
                        }}
                      >
                        {loading ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: "#ffffff" }}
                          />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default AssessmentDetailPage;
