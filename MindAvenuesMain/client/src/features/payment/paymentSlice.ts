// src/features/payment/paymentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPayment } from '../../types/backendTypes';
import { fetchUserPayments, createPaymentOrder, verifyPayment, getRazorpayKey } from './paymentApi';

interface Order {
  id: string;
  amount: number;
  currency: string;
  [key: string]: unknown;
}

interface PaymentState {
  payments: IPayment[];
  currentOrder: Order | null;
  razorpayApiKey: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  currentOrder: null,
  razorpayApiKey: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<IPayment[]>) => {
      state.payments = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
      state.loading = false;
      state.error = null;
    },
    setRazorpayApiKey: (state, action: PayloadAction<string>) => {
      state.razorpayApiKey = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch User Payments
    builder
      .addCase(fetchUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPayments.fulfilled, (state, action: PayloadAction<IPayment[]>) => {
        state.payments = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Payment Order
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.currentOrder = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action: PayloadAction<IPayment>) => {
        state.payments.push(action.payload); // Add new payment to list
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Razorpay Key
      .addCase(getRazorpayKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRazorpayKey.fulfilled, (state, action: PayloadAction<string>) => {
        state.razorpayApiKey = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getRazorpayKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPayments, setCurrentOrder, setRazorpayApiKey, setLoading, setError } = paymentSlice.actions;
export default paymentSlice.reducer;