// src/features/admin/adminSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAdminData, PaymentStats, IUser, AssessmentStats } from "./adminApi";
import { IPaymentAdmin } from "@/types/backendTypes";

interface AdminState {
  paymentStats: PaymentStats | null;
  payments: IPaymentAdmin[];
  paidUsers: IUser[];
  assessmentStats: AssessmentStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  paymentStats: null,
  payments: [],
  paidUsers: [],
  assessmentStats: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action: PayloadAction<{
        paymentStats: PaymentStats;
        payments: IPaymentAdmin[];
        paidUsers: IUser[];
        assessmentStats: AssessmentStats;
      }>) => {
        state.paymentStats = action.payload.paymentStats;
        state.payments = action.payload.payments;
        state.paidUsers = action.payload.paidUsers;
        state.assessmentStats = action.payload.assessmentStats;
        state.loading = false;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default adminSlice.reducer;