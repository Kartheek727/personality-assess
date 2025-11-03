// src/features/payment/paymentApi.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../redux/api/apiClient';
import { setRazorpayApiKey } from './paymentSlice';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown;
}

type PaymentError = AxiosError<ApiErrorResponse>;

export const createPaymentOrder = createAsyncThunk(
  'payment/createOrder',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/payments/create-order');
      return response.data.order;
    } catch (error: unknown) {
      const axiosError = error as PaymentError;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create order');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (
    data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/payments/verify', data);
      return response.data.payment;
    } catch (error: unknown) {
      const axiosError = error as PaymentError;
      return rejectWithValue(axiosError.response?.data?.message || 'Payment verification failed');
    }
  }
);

export const getRazorpayKey = createAsyncThunk(
  'payment/getRazorpayKey',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/payments/key');
      dispatch(setRazorpayApiKey(response.data.razorpayApiKey));
      return response.data.razorpayApiKey;
    } catch (error: unknown) {
      const axiosError = error as PaymentError;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch Razorpay key');
    }
  }
);

// New thunk to fetch user payments
export const fetchUserPayments = createAsyncThunk(
  'payment/fetchUserPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/payments/payments');
      return response.data.payments;
    } catch (error: unknown) {
      const axiosError = error as PaymentError;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch payments');
    }
  }
);