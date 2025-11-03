// src/features/admin/adminApi.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/redux/api/apiClient";

export interface PaymentStats {
  totalUsers: number;
  paidUsers: number;
  unpaidUsers: number;
  totalPayments: number;
  totalRevenue: number;
  paymentStatsByDate: { [date: string]: { count: number; amount: number } };
}

export interface IPayment {
  _id: string;
  user: { _id: string; email: string; firstName: string; lastName: string };
  amount: number;
  status: "pending" | "completed" | "failed";
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

export interface AssessmentStats {
  totalAssessments: number;
  activeAssessments: number;
  completedAssessments: number;
}

interface AdminError {
  response?: { data?: { message?: string } };
}

// Batch fetch all admin data
export const fetchAdminData = createAsyncThunk(
  "admin/fetchAdminData",
  async (_, { rejectWithValue }) => {
    try {
      const [paymentStats, payments, paidUsers, assessmentStats] = await Promise.all([
        apiClient.get("/admin/payment-stats").then((res) => res.data.stats),
        apiClient.get("/admin/payments").then((res) => res.data.payments),
        apiClient.get("/admin/paid-users").then((res) => res.data.users),
        apiClient.get("/admin/assessment-stats").then((res) => res.data.stats),
      ]);

      return { paymentStats, payments, paidUsers, assessmentStats };
    } catch (error: unknown) {
      const adminError = error as AdminError;
      return rejectWithValue(adminError.response?.data?.message || "Failed to fetch admin data");
    }
  }
);