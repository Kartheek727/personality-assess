"use client";

import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";

interface AssessmentStats {
  totalAssessments: number;
  activeAssessments: number;
  completedAssessments: number;
}

interface AssessmentStatsProps {
  assessmentStats: AssessmentStats | null;
}

const AssessmentStats: React.FC<AssessmentStatsProps> = ({ assessmentStats }) => {
  if (!assessmentStats) return <Typography>Loading assessment stats...</Typography>;

  // Bar Chart Data: Assessment Overview
  const barData = {
    labels: ["Total", "Active", "Completed"],
    datasets: [
      {
        label: "Assessments",
        data: [
          assessmentStats.totalAssessments,
          assessmentStats.activeAssessments,
          assessmentStats.completedAssessments,
        ],
        backgroundColor: "rgba(147, 51, 234, 0.6)",
        borderColor: "rgba(147, 51, 234, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Assessment Overview" },
    },
  };

  // Pie Chart Data: Completion Proportion
  const pieData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [
          assessmentStats.completedAssessments,
          assessmentStats.totalAssessments - assessmentStats.completedAssessments,
        ],
        backgroundColor: ["rgba(147, 51, 234, 0.6)", "rgba(100, 100, 100, 0.6)"],
        borderColor: ["rgba(147, 51, 234, 1)", "rgba(100, 100, 100, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Completion Proportion" },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="#9333ea" fontWeight="bold">
        Assessment Statistics
      </Typography>
      <Grid container spacing={3}>
        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Bar data={barData} options={barOptions} />
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Pie data={pieData} options={pieOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssessmentStats;