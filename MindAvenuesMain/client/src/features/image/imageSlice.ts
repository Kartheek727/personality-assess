//src/features/image/imageSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../redux/api/apiClient';
import { IPDFLogo } from '@/types/backendTypes';
import { AxiosError } from 'axios';

// Define the expected error response shape from your API
interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown; // Allow additional properties for flexibility
}

// Type the error as AxiosError with the custom response shape
type ImageError = AxiosError<ApiErrorResponse>;

// Define state interface
interface ImageState {
  profilePicture: string | null;
  pdfLogo: IPDFLogo | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Initial state
const initialState: ImageState = {
  profilePicture: null,
  pdfLogo: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Thunks
export const uploadProfilePicture = createAsyncThunk(
  'image/uploadProfilePicture',
  async (file: File, { rejectWithValue }) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const response = await apiClient.put('/images/profile-picture', arrayBuffer, {
        headers: {
          'Content-Type': file.type, // e.g., 'image/jpeg'
        },
      });
      return response.data.url;
    } catch (error: unknown) {
      const imageError = error as ImageError;
      return rejectWithValue(imageError.response?.data?.message || 'Failed to upload profile picture');
    }
  }
);

export const deleteProfilePicture = createAsyncThunk(
  'image/deleteProfilePicture',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete('/images/profile-picture');
      return response.data.message;
    } catch (error: unknown) {
      const imageError = error as ImageError;
      return rejectWithValue(imageError.response?.data?.message || 'Failed to delete profile picture');
    }
  }
);

export const upsertPDFLogo = createAsyncThunk(
  'image/upsertPDFLogo',
  async (
    { file, title, subtitle, tagline }: { file: File; title: string; subtitle: string; tagline: string },
    { rejectWithValue }
  ) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const response = await apiClient.put(
        `/images/pdf-logo?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}&tagline=${encodeURIComponent(tagline)}`,
        arrayBuffer,
        { headers: { 'Content-Type': file.type } }
      );
      return response.data.logo;
    } catch (error: unknown) {
      const imageError = error as ImageError;
      return rejectWithValue(imageError.response?.data?.message || 'Failed to update PDF logo');
    }
  }
);

export const deletePDFLogo = createAsyncThunk(
  'image/deletePDFLogo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete('/images/pdf-logo');
      return response.data.message;
    } catch (error: unknown) {
      const imageError = error as ImageError;
      return rejectWithValue(imageError.response?.data?.message || 'Failed to delete PDF logo');
    }
  }
);

export const fetchPDFLogo = createAsyncThunk(
  'image/fetchPDFLogo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/images/pdf-logo');
      return response.data;
    } catch (error: unknown) {
      const imageError = error as ImageError;
      return rejectWithValue(imageError.response?.data?.message || 'Failed to fetch PDF logo');
    }
  }
);

export const fetchProfilePicture = createAsyncThunk(
  'image/fetchProfilePicture',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/images/profile-picture');
      return response.data.url;
    } catch (error: unknown) {
      const imageError = error as ImageError;
      return rejectWithValue(imageError.response?.data?.message || 'Failed to fetch profile picture');
    }
  }
);

// Slice
const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    clearMessages(state) {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Upload Profile Picture
    builder.addCase(uploadProfilePicture.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(uploadProfilePicture.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.profilePicture = action.payload;
      state.successMessage = 'Profile picture updated successfully';
    });
    builder.addCase(uploadProfilePicture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Profile Picture
    builder.addCase(deleteProfilePicture.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(deleteProfilePicture.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.profilePicture = null;
      state.successMessage = action.payload;
    });
    builder.addCase(deleteProfilePicture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Upsert PDF Logo
    builder.addCase(upsertPDFLogo.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(upsertPDFLogo.fulfilled, (state, action: PayloadAction<IPDFLogo>) => {
      state.loading = false;
      state.pdfLogo = action.payload;
      state.successMessage = 'PDF logo updated successfully';
    });
    builder.addCase(upsertPDFLogo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete PDF Logo
    builder.addCase(deletePDFLogo.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(deletePDFLogo.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.pdfLogo = null;
      state.successMessage = action.payload;
    });
    builder.addCase(deletePDFLogo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch PDF Logo
    builder.addCase(fetchPDFLogo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPDFLogo.fulfilled, (state, action: PayloadAction<IPDFLogo>) => {
      state.loading = false;
      state.pdfLogo = action.payload;
    });
    builder.addCase(fetchPDFLogo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Profile Picture
    builder.addCase(fetchProfilePicture.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProfilePicture.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.profilePicture = action.payload;
    });
    builder.addCase(fetchProfilePicture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearMessages: clearImageMessages } = imageSlice.actions;
export default imageSlice.reducer;