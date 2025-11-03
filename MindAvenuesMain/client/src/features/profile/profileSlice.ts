// src/features/profile/profileSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../redux/api/apiClient";

// Define interfaces based on the API response structure
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  role: string;
  paymentStatus: string;
  profilePicture?: string;
  completedAssessmentsCount: number;
}

interface Question {
  _id: string;
  text: string;
  type: "single" | "multiple"; // Adjust based on possible values
  options: string[]; // Array of option IDs
  isRequired: boolean;
  customInstructions: string;
  createdAt: string;
  updatedAt: string;
}

interface Assessment {
  _id: string;
  title: string;
  question: Question;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt: string;
}

interface Payment {
  _id: string;
  user: string;
  amount: number;
  status: "completed" | "pending" | "failed"; // Adjust based on possible values
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProfileData {
  user: User;
  assessments: Assessment[];
  payments: Payment[];
  totalAssessmentsAvailable: number;
}

interface ProfileState {
  user: User | null;
  assessments: Assessment[];
  payments: Payment[];
  totalAssessmentsAvailable: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  assessments: [],
  payments: [],
  totalAssessmentsAvailable: 0,
  loading: false,
  error: null,
};

export const fetchProfileData = createAsyncThunk<
  ProfileData,
  void,
  { rejectValue: string }
>("profile/fetchProfileData", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<{ success: boolean; data: ProfileData }>("/profile", {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error: unknown) {
    // Type the error as unknown and handle it safely
    if (error instanceof Error && "response" in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch profile data");
    }
    return rejectWithValue("Failed to fetch profile data");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.assessments = action.payload.assessments;
        state.payments = action.payload.payments;
        state.totalAssessmentsAvailable = action.payload.totalAssessmentsAvailable;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;