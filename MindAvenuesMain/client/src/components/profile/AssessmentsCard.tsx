// src/components/profile/AssessmentsCard.tsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { registerChartJs } from "@/lib/chartSetup";
import { motion } from "framer-motion";
import Link from "next/link";

registerChartJs();

interface AssessmentsCardProps {
  assessments: { _id: string; title: string; completedAt: string }[];
}

const AssessmentsCard: React.FC<AssessmentsCardProps> = ({ assessments }) => {
  const chartData = {
    labels: ["Completed Assessments"],
    datasets: [{ label: "Number of Assessments", data: [assessments.length], backgroundColor: "#1a62a4", borderColor: "#045494", borderWidth: 1 }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    plugins: { legend: { display: false }, title: { display: false } },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <Card sx={{ borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)", border: "1px solid #1a62a4/20" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a62a4", mb: 3 }}>
            Your Assessments
          </Typography>
          <Box sx={{ height: 200, mb: 3 }}>
            <Bar data={chartData} options={chartOptions} />
          </Box>
          {assessments.length === 0 ? (
            <Typography sx={{ color: "#045494" }}>No assessments taken yet.</Typography>
          ) : (
            <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
              {assessments.map((assessment) => (
                <Box key={assessment._id} sx={{ mb: 2 }}>
                  <Typography
                    component={Link}
                    href={`/assessments/${assessment._id}`}
                    sx={{ color: "#1a62a4", textDecoration: "none", "&:hover": { color: "#f47528" } }}
                  >
                    {assessment.title}
                  </Typography>
                  <Typography sx={{ color: "#045494", fontSize: "0.9rem" }}>
                    Taken on: {new Date(assessment.completedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssessmentsCard;

