// src/components/(Assessments)/InnerMindMapAssessment.tsx
"use client";

import React, { useState, useEffect, useCallback, JSX, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from "@mui/material";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import {
  createPaymentOrder,
  verifyPayment,
  getRazorpayKey,
} from "@/features/payment/paymentApi";
import { fetchProfile } from "@/features/auth/authApi";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: string;
  amount: number;
  currency: string;
}

interface PaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PaymentFailureResponse {
  error: {
    description: string;
    [key: string]: unknown;
  };
}

type PersonalityFeature = {
  id: string;
  title: string;
  items: string[];
  icon: string;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler?: (response: PaymentResponse) => void;
  theme?: { color: string };
}

interface RazorpayInstance {
  on(event: "payment.failed", callback: (response: PaymentFailureResponse) => void): void;
  open(): void;
}

// Testimonials Section with Modern Horizontal Sliding
const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "This assessment gave me clarity on my strengths and how I learn best!",
      author: "Priya S., Designer",
    },
    {
      quote: "A game-changer for my career planning and personal growth.",
      author: "Arjun R., Engineer",
    },
    {
      quote: "The insights helped me improve my leadership skills dramatically.",
      author: "Neha K., Corporate Manager",
    },
    {
      quote: "An eye-opening experience that transformed my teaching methods.",
      author: "Dr. Sanjay P., Educator",
    },
    {
      quote: "Understanding my mind map boosted my productivity like never before.",
      author: "Ravi M., Entrepreneur",
    },
    {
      quote: "A must-have tool for anyone seeking personal and professional clarity.",
      author: "Aisha T., Consultant",
    },
  ];

  // Duplicate testimonials for infinite loop
  const extendedTestimonials = [...testimonials, ...testimonials];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cardWidth = 400 + 32; // Card width + gap (for reference)
    const totalWidth = cardWidth * testimonials.length;
    let animationFrame: number;

    const animate = () => {
      let scrollLeft = container.scrollLeft;
      scrollLeft += 1; // Speed of sliding (adjustable)

      if (scrollLeft >= totalWidth) {
        scrollLeft = 0; // Reset to start for seamless loop
      }

      container.scrollLeft = scrollLeft;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame); // Cleanup
  }, [testimonials.length]);

  return (
    <Box sx={{ mb: 12, bgcolor: "#f47528/5", py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: "#1a62a4",
            fontWeight: 700,
            mb: 6,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          What Users Say
        </Typography>
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            ref={containerRef}
            sx={{
              display: "flex",
              gap: "32px", // Matches your design
              overflowX: "auto",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              whiteSpace: "nowrap",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {extendedTestimonials.map((testimonial, idx) => (
              <Card
                key={idx}
                sx={{
                  width: { xs: "85%", sm: 400 }, // 85% on mobile, 400px on larger screens
                  maxWidth: 400, // Cap width for consistency
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                  p: { xs: 2, sm: 4 }, // Reduced padding on mobile
                  bgcolor: "#ffffff",
                  flexShrink: 0,
                  display: "inline-block",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    border: "1px solid #f47528",
                  },
                  height: "auto", // Allow height to adjust to content
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#045494",
                      fontStyle: "italic",
                      mb: 2,
                      lineHeight: 1.6,
                      fontSize: { xs: "0.95rem", sm: "1rem" }, // Smaller font on mobile
                      whiteSpace: "normal", // Allow text to wrap
                      wordBreak: "break-word", // Break long words
                    }}
                  >
                    &ldquo;{testimonial.quote}&ldquo;
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#1a62a4",
                      fontWeight: 600,
                      fontSize: { xs: "0.85rem", sm: "0.875rem" }, // Adjusted for mobile
                      whiteSpace: "normal", // Allow wrapping if needed
                      wordBreak: "break-word", // Break long words
                    }}
                  >
                    – {testimonial.author}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

// CTA Section with Visible Text and Modern Design
const CTASection: React.FC<{ getCTAButton: () => JSX.Element }> = ({ getCTAButton }) => {
  return (
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
            Unlock Your Potential
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
            Step into a world of self-discovery with the Inner Mind Map Assessment. Understand your unique
            thinking patterns, harness your strengths, and pave the way for personal growth and fulfillment.
            Your journey starts here—take the leap today!
          </Typography>
          <Box sx={{ display: "inline-block" }}>{getCTAButton()}</Box>
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
  );
};

const InnerMindMapAssessment: React.FC = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { razorpayApiKey, loading: paymentLoading } = useAppSelector(
    (state) => state.payment
  );
  const { isAuthenticated, isPaid, loading: authContextLoading } = useAuth();

  const assessmentPrice = 1;

  useEffect(() => {
    if (!razorpayApiKey && !paymentLoading) {
      dispatch(getRazorpayKey())
        .unwrap()
        .catch(() => toast.error("Failed to fetch payment key."));
    }
    if (isAuthenticated && !user) {
      dispatch(fetchProfile())
        .unwrap()
        .catch(() => toast.error("Failed to refresh profile."));
    }
  }, [dispatch, razorpayApiKey, paymentLoading, isAuthenticated, user]);

  const handleCreateOrder = useCallback(async () => {
    setIsPaymentLoading(true);
    try {
      const order = await dispatch(createPaymentOrder()).unwrap() as Order;
      return order;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to create payment order.");
      } else {
        toast.error("Failed to create payment order.");
      }
      if (!isAuthenticated) router.push("/login");
      return null;
    } finally {
      setIsPaymentLoading(false);
    }
  }, [dispatch, isAuthenticated, router]);

  const loadRazorpay = useCallback(
    (order: Order | null) => {
      if (!razorpayApiKey || !order) {
        toast.error("Payment setup failed. Please try again.");
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options: RazorpayOptions = {
          key: razorpayApiKey,
          amount: order.amount,
          currency: order.currency,
          name: "Mind Avenues",
          description: "Inner Mind Map Assessment",
          order_id: order.id,
          handler: async (response: PaymentResponse) => {
            const paymentData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            try {
              await dispatch(verifyPayment(paymentData)).unwrap();
              await dispatch(fetchProfile()).unwrap();
              toast.success("Payment successful! Starting assessment...");
              router.push("/assessments");
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error("Payment verification failed. Contact support.");
            }            
          },
          theme: { color: "#1a62a4" }, // Blue theme
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response: PaymentFailureResponse) => {
          toast.error(response.error.description || "Payment failed.");
        });
        rzp.open();
      };
      script.onerror = () => toast.error("Failed to load payment gateway.");
      document.body.appendChild(script);
    },
    [razorpayApiKey, dispatch, router]
  );

  const handlePayment = useCallback(async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!user?.isVerified) {
      router.push("/verify");
      return;
    }
    if (isPaid) {
      router.push("/assessments");
      return;
    }

    const order = await handleCreateOrder();
    if (order) loadRazorpay(order);
  }, [isAuthenticated, isPaid, user, router, handleCreateOrder, loadRazorpay]);

  const getCTAButton = () => {
    if (authLoading || authContextLoading || paymentLoading) {
      return (
        <Button
          variant="contained"
          disabled
          sx={{ bgcolor: "#1a62a4", py: 1.5, px: 4, borderRadius: "9999px" }}
        >
          <CircularProgress size={24} sx={{ color: "white" }} />
        </Button>
      );
    }

    if (!isAuthenticated) {
      return (
        <Button
          component={Link}
          href="/login"
          variant="contained"
          sx={{
            bgcolor: "#1a62a4",
            py: 1.5,
            px: 4,
            borderRadius: "9999px",
            "&:hover": { bgcolor: "#f47528" },
          }}
        >
          Login to Start
        </Button>
      );
    }

    if (!user?.isVerified) {
      return (
        <Button
          component={Link}
          href="/verify"
          variant="contained"
          sx={{
            bgcolor: "#1a62a4",
            py: 1.5,
            px: 4,
            borderRadius: "9999px",
            "&:hover": { bgcolor: "#f47528" },
          }}
        >
          Verify Email
        </Button>
      );
    }

    if (isPaid) {
      return (
        <Button
          component={Link}
          href="/assessments"
          variant="contained"
          sx={{
            bgcolor: "#1a62a4",
            py: 1.5,
            px: 4,
            borderRadius: "9999px",
            "&:hover": { bgcolor: "#f47528" },
          }}
        >
          Take Assessment Now
        </Button>
      );
    }

    return (
      <Button
        onClick={handlePayment}
        variant="contained"
        disabled={isPaymentLoading || !razorpayApiKey}
        sx={{
          bgcolor: "#1a62a4",
          py: 1.5,
          px: 4,
          borderRadius: "9999px",
          "&:hover": { bgcolor: "#f47528" },
          "&:disabled": { bgcolor: "grey.500" },
        }}
      >
        {isPaymentLoading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          `Pay ₹${assessmentPrice} to Start`
        )}
      </Button>
    );
  };

  const personalityFeatures: PersonalityFeature[] = [
    {
      id: "personality-types",
      title: "Personality Types",
      icon: "/img/personality.png",
      items: [
        "Secretive Personality Type",
        "Imaginative Personality Type",
        "Holistic Personality Type",
        "Critical Personality Type",
        "Intuitive Personality Type",
        "Analytical Personality Type",
        "Connecting Personality Type",
        "Focused Personality Type",
      ],
    },
    // ... (other features remain unchanged)
    {
      id: "personality-traits",
      title: "Personality Traits",
      icon: "/img/personality.png",
      items: [
        "Secretive Personality Type",
        "Imaginative Personality Type",
        "Holistic Personality Type",
        "Critical Personality Type",
        "Intuitive Personality Type",
        "Analytical Personality Type",
        "Connecting Personality Type",
        "Focused Personality Type",
      ],
    },
    {
      id: "thinking-learning-speed",
      title: "Thinking-Learning Speed",
      icon: "/img/thinkspeed.png",
      items: [
        "Repetition based learner",
        "Sequence based learner",
        "Guidance based learner",
        "Focus based learner",
        "Super speed based learner",
      ],
    },
    {
      id: "thinking-learning-pattern",
      title: "Thinking-Learning Pattern",
      icon: "/img/learning.png",
      items: ["Convergent Thinker", "Divergent Thinker"],
    },
    {
      id: "thinking-performing-style",
      title: "Thinking Performing Style",
      icon: "/img/perform.png",
      items: ["Thinker", "Performer"],
    },
    {
      id: "sensory-motor-learning",
      title: "Six Sensory Motor Learning",
      icon: "/img/sensor.jpg",
      items: [
        "Visual Auditory Kinaesthetic",
        "Visual Kinaesthetic Auditory",
        "Kinaesthetic Auditory Visual",
        "Kinaesthetic Visual Auditory",
        "Auditory Kinaesthetic Visual",
        "Auditory Visual Kinaesthetic",
      ],
    },
    {
      id: "thinking-analysing",
      title: "Thinking, Analysing & Processing",
      icon: "/img/analyse.png",
      items: ["Difficulty", "Good", "Very good"],
    },
    {
      id: "execution-performance",
      title: "Execution and Performance",
      icon: "/img/execution.jpeg",
      items: ["Difficulty", "Good", "Very good"],
    },
    {
      id: "skills-potentials",
      title: "Ten Skills & Potentials",
      icon: "/img/tenskill.jpg",
      items: [
        "Social & Interpersonal Skills",
        "Imaginative Skills",
        "Kinaesthetic Skills",
        "Auditory Sensitivity Skills",
        "Visual Sensitivity Skills",
        "Management & Planning Skills",
        "Analytical Skills",
        "Action Sequencing Skills",
        "Auditory Memory Skills",
        "Visual Memory Skills",
      ],
    },
  ];

  return (
    <Box sx={{ bgcolor: "#ffffff", py: 12, overflow: "hidden" }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "4rem" },
                background: "linear-gradient(to right, #1a62a4, #f47528)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 3,
              }}
            >
              Inner Mind Map Assessment
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#045494", maxWidth: "700px", mx: "auto", mb: 6 }}
            >
              Unlock the secrets of your mind and discover your unique potential with a personalized journey.
            </Typography>
            <Box>{getCTAButton()}</Box>
          </motion.div>
        </Box>

        {/* Video Intro */}
        <Box sx={{ mb: 12 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card
              sx={{
                maxWidth: 800,
                mx: "auto",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                overflow: "hidden",
                border: "2px solid #1a62a4",
              }}
            >
              <Box sx={{ position: "relative", paddingBottom: "56.25%" }}>
                <iframe
                  src="https://www.youtube.com/embed/2v_k_ML0M8A"
                  title="Inner Mind Map Intro"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                />
              </Box>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "#1a62a4", fontWeight: 600 }}>
                  How It Works
                </Typography>
                <Typography variant="body2" sx={{ color: "#045494" }}>
                  Watch this quick intro to understand the Inner Mind Map Assessment.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Welcome Section */}
        <Box sx={{ mb: 12, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant="h4"
              sx={{ color: "#1a62a4", fontWeight: 700, mb: 4 }}
            >
              Your Journey Begins Here
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#045494", maxWidth: "800px", mx: "auto", lineHeight: 1.8 }}
            >
              The Inner Mind Map Assessment reveals how you process information, influencing your thoughts,
              feelings, and actions. Answer honestly and embark on a structured path to clarity, purpose, and happiness.
            </Typography>
          </motion.div>
        </Box>

        {/* Discover Section */}
        <Box sx={{ mb: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                color: "#1a62a4",
                fontWeight: 700,
                mb: 6,
              }}
            >
              What You&apos;ll Discover
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 4,
                maxWidth: "1000px",
                mx: "auto",
              }}
            >
              {personalityFeatures.map((feature) => (
                <Card
                  key={feature.id}
                  sx={{
                    width: { xs: "100%", sm: 300 },
                    borderRadius: "16px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "translateY(-5px)", border: "1px solid #f47528" },
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "#1a62a4",
                        mx: "auto",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image src={feature.icon} alt={feature.title} width={32} height={32} />
                    </Box>
                    <Typography variant="h6" sx={{ color: "#045494", fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <List dense sx={{ mt: 2 }}>
                      {feature.items.slice(0, 3).map((item, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemIcon>
                            <CheckCircle size={16} color="#f47528" />
                          </ListItemIcon>
                          <ListItemText primary={item} sx={{ color: "#045494" }} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </motion.div>
        </Box>

        {/* Testimonials Section */}
        <TestimonialsSection/>

        {/* CTA Section */}
        <CTASection getCTAButton={getCTAButton} />

        {/* Sticky CTA */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          {getCTAButton()}
        </Box>
      </Container>
    </Box>
  );
};

export default InnerMindMapAssessment;