"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Container, Box, CssBaseline, Typography, CircularProgress } from "@mui/material";
import apiClient from "@/redux/api/apiClient";
import { registerChartJs } from "@/lib/chartSetup";
import Sidebar from "@/components/(Admin)/Sidebar";
import AssessmentManager from "@/components/(Admin)/AssessmentManager";
import AssessmentStats from "@/components/(Admin)/AssessmentStats";
import PaidUsersList, { IUser } from "@/components/(Admin)/PaidUsersList";
import PaymentStats from "@/components/(Admin)/PaymentStats";
import PaymentsList, { IPayment } from "@/components/(Admin)/PaymentsList";
import UsersList from "@/components/(Admin)/UsersList";
import PDFLogoManager from "@/components/(Admin)/PDFLogoManager";

interface IPaymentStats {
  totalUsers: number;
  paidUsers: number;
  unpaidUsers: number;
  totalPayments: number;
  totalRevenue: number;
  paymentStatsByDate: { [date: string]: { count: number; amount: number } };
}

interface IAssessmentStats {
  totalAssessments: number;
  activeAssessments: number;
  completedAssessments: number;
}

const AdminPage: React.FC = () => {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<"assessments" | "paymentStats" | "assessmentStats" | "payments" | "paidUsers" | "users" | "pdfLogo">("assessments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    paymentStats: IPaymentStats | null;
    payments: IPayment[];
    paidUsers: IUser[];
    assessmentStats: IAssessmentStats | null;
    users: IUser[];
  }>({
    paymentStats: null,
    payments: [],
    paidUsers: [],
    assessmentStats: null,
    users: [],
  });

  useEffect(() => {
    registerChartJs();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!isAdmin) {
      router.push("/profile");
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [insightsResponse, usersResponse] = await Promise.all([
          apiClient.get("/admin/insights"),
          apiClient.get("/admin/users"),
        ]);
        setData({
          paymentStats: insightsResponse.data.paymentStats,
          payments: insightsResponse.data.payments,
          paidUsers: insightsResponse.data.paidUsers,
          assessmentStats: insightsResponse.data.assessmentStats,
          users: usersResponse.data.users,
        });
        setError(null);
      } catch (err) {
        setError("Failed to load admin data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAuthenticated, isAdmin, router]);

  const handleToggleRole = async (userId: string) => {
    try {
      const response = await apiClient.post(`/admin/users/${userId}/toggle-role`);
      setData((prevData) => ({
        ...prevData,
        users: prevData.users.map((user) =>
          user._id === userId ? response.data.user : user
        ),
        paidUsers: prevData.paidUsers.map((user) =>
          user._id === userId ? { ...user, role: response.data.user.role } : user
        ),
      }));
    } catch (err) {
      setError("Failed to toggle user role");
      console.error(err);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "assessments":
        return <AssessmentManager />;
      case "paymentStats":
        return <PaymentStats paymentStats={data.paymentStats} />;
      case "assessmentStats":
        return <AssessmentStats assessmentStats={data.assessmentStats} />;
      case "payments":
        return <PaymentsList payments={data.payments} />;
      case "paidUsers":
        return <PaidUsersList paidUsers={data.paidUsers} />;
      case "users":
        return <UsersList users={data.users} onToggleRole={handleToggleRole} />;
      case "pdfLogo":
        return <PDFLogoManager />; // New section
      default:
        return <Typography>Section not found</Typography>;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#9333ea" }}>
            Admin Dashboard
          </Typography>
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminPage;