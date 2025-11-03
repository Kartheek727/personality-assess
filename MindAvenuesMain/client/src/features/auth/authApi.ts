// src/features/auth/authApi.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../redux/api/apiClient';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
}

type AuthError = AxiosError<ApiErrorResponse>;

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: { email: string; password: string; firstName: string; lastName: string; mobileNumber: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      return response.data.user;
    } catch (error: unknown) {
      const typedError = error as AuthError;
      return rejectWithValue(typedError.response?.data?.message || 'Registration failed');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ userId, otp }: { userId: string; otp: string }, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.post('/auth/verify', { userId, otp });
      const profileResponse = await dispatch(fetchProfile()).unwrap();
      return profileResponse;
    } catch (error: unknown) {
      const typedError = error as AuthError;
      return rejectWithValue(typedError.response?.data?.message || 'Verification failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.post('/auth/login', { email, password });
      const profileResponse = await dispatch(fetchProfile()).unwrap();
      return profileResponse;
    } catch (error: unknown) {
      const typedError = error as AuthError;
      return rejectWithValue(typedError.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error: unknown) {
      const typedError = error as AuthError;
      return rejectWithValue(typedError.response?.data?.message || 'Logout failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data.user;
    } catch (error: unknown) {
      const typedError = error as AuthError;
      return rejectWithValue(typedError.response?.data?.message || 'Failed to fetch profile');
    }
  }
);