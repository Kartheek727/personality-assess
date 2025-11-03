"use client";

import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";

interface PaymentStats {
  totalUsers: number;
  paidUsers: number;
  unpaidUsers: number;
  totalPayments: number;
  totalRevenue: number;
  paymentStatsByDate: { [date: string]: { count: number; amount: number } };
}

interface PaymentStatsProps {
  paymentStats: PaymentStats | null;
}

const PaymentStats: React.FC<PaymentStatsProps> = ({ paymentStats }) => {
  if (!paymentStats) return <Typography>Loading payment stats...</Typography>;

  // Pie Chart Data: User Distribution
  const pieData = {
    labels: ["Paid Users", "Unpaid Users"],
    datasets: [
      {
        data: [paymentStats.paidUsers, paymentStats.unpaidUsers],
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
      title: { display: true, text: "User Payment Distribution" },
    },
  };

  // Bar Chart Data: Revenue vs. Payment Count
  const barData = {
    labels: ["Total Revenue ($)", "Total Payments"],
    datasets: [
      {
        label: "Value",
        data: [paymentStats.totalRevenue, paymentStats.totalPayments],
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
      title: { display: true, text: "Revenue & Payment Overview" },
    },
  };

  // Line Chart Data: Payment Trends Over Time
  const lineData = {
    labels: Object.keys(paymentStats.paymentStatsByDate),
    datasets: [
      {
        label: "Payment Amount ($)",
        data: Object.values(paymentStats.paymentStatsByDate).map((stat) => stat.amount),
        fill: false,
        borderColor: "rgba(147, 51, 234, 1)",
        tension: 0.1,
      },
      {
        label: "Payment Count",
        data: Object.values(paymentStats.paymentStatsByDate).map((stat) => stat.count),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Payment Trends Over Time" },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="#9333ea" fontWeight="bold">
        Payment Statistics
      </Typography>
      <Grid container spacing={3}>
        {/* Summary Stats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h6" color="#9333ea">Summary</Typography>
            <Typography>Total Users: {paymentStats.totalUsers}</Typography>
            <Typography>Paid Users: {paymentStats.paidUsers}</Typography>
            <Typography>Unpaid Users: {paymentStats.unpaidUsers}</Typography>
            <Typography>Total Payments: {paymentStats.totalPayments}</Typography>
            <Typography>Total Revenue: ₹{paymentStats.totalRevenue.toFixed(2)}</Typography>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Pie data={pieData} options={pieOptions} />
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Bar data={barData} options={barOptions} />
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Line data={lineData} options={lineOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentStats;