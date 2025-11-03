// src/features/assessment/assessmentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAssessment, IAssessmentResponse } from '../../types/backendTypes';
import { deleteAssessment, updateAssessment, fetchAssessments, fetchAssessmentByIdAdmin } from './assessmentApi';

interface AssessmentState {
  assessments: IAssessment[];
  currentAssessment: IAssessment | null;
  currentResponse: IAssessmentResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssessmentState = {
  assessments: [],
  currentAssessment: null,
  currentResponse: null,
  loading: false,
  error: null,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setAssessments: (state, action: PayloadAction<IAssessment[]>) => {
      state.assessments = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentAssessment: (state, action: PayloadAction<IAssessment>) => {
      state.currentAssessment = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentResponse: (state, action: PayloadAction<IAssessmentResponse>) => {
      state.currentResponse = action.payload;
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
    builder
      .addCase(fetchAssessments.fulfilled, (state, action: PayloadAction<IAssessment[]>) => {
        state.assessments = action.payload;
        state.error = null;
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteAssessment.fulfilled, (state, action: PayloadAction<string>) => {
        state.assessments = state.assessments.filter(a => a._id !== action.payload);
        if (state.currentAssessment?._id === action.payload) {
          state.currentAssessment = null;
        }
        state.error = null;
      })
      .addCase(deleteAssessment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateAssessment.fulfilled, (state, action: PayloadAction<IAssessment>) => {
        const index = state.assessments.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.assessments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAssessment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchAssessmentByIdAdmin.fulfilled, (state, action: PayloadAction<IAssessment>) => {
        state.currentAssessment = action.payload;
        state.error = null;
      })
      .addCase(fetchAssessmentByIdAdmin.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setAssessments, setCurrentAssessment, setCurrentResponse, setLoading, setError } = assessmentSlice.actions;
export default assessmentSlice.reducer;