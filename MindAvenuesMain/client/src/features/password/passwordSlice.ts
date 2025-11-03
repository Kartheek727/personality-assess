import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../redux/api/apiClient';
import { AxiosError } from 'axios';

// Define the expected error response shape from your API
interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown; // Allow additional properties for flexibility
}

// Type the error as AxiosError with the custom response shape
type PasswordError = AxiosError<ApiErrorResponse>;

// Define state interface
interface PasswordState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Initial state
const initialState: PasswordState = {
  loading: false,
  error: null,
  successMessage: null,
};

// Thunks
export const resendOtp = createAsyncThunk(
  'password/resendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/password/resend-otp', { email });
      return response.data.message;
    } catch (error: unknown) {
      const passwordError = error as PasswordError;
      return rejectWithValue(passwordError.response?.data?.message || 'Failed to resend OTP');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'password/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/password/forgot-password', { email });
      return response.data.message;
    } catch (error: unknown) {
      const passwordError = error as PasswordError;
      return rejectWithValue(passwordError.response?.data?.message || 'Failed to send reset OTP');
    }
  }
);

export const changePasswordWithOtp = createAsyncThunk(
  'password/changePasswordWithOtp',
  async (
    { email, otp, newPassword }: { email: string; otp: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/password/change-password-otp', {
        email,
        otp,
        newPassword,
      });
      return response.data.message;
    } catch (error: unknown) {
      const passwordError = error as PasswordError;
      return rejectWithValue(passwordError.response?.data?.message || 'Failed to change password');
    }
  }
);

export const changePassword = createAsyncThunk(
  'password/changePassword',
  async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/password/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data.message;
    } catch (error: unknown) {
      const passwordError = error as PasswordError;
      return rejectWithValue(passwordError.response?.data?.message || 'Failed to update password');
    }
  }
);

// Slice
const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    clearMessages(state) {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Resend OTP
    builder.addCase(resendOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(resendOtp.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.successMessage = action.payload;
    });
    builder.addCase(resendOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Forgot Password
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.successMessage = action.payload;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Change Password with OTP
    builder.addCase(changePasswordWithOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(changePasswordWithOtp.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.successMessage = action.payload;
    });
    builder.addCase(changePasswordWithOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Change Password (Authenticated)
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(changePassword.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.successMessage = action.payload;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearMessages } = passwordSlice.actions;
export default passwordSlice.reducer;