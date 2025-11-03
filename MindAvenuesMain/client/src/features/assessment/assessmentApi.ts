import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../redux/api/apiClient';
import { AppDispatch } from '../../redux/store';
import { setAssessments, setCurrentAssessment, setCurrentResponse, setLoading, setError } from './assessmentSlice';
import { AxiosError } from 'axios';
import { IAssessmentResponse } from '../../types/backendTypes';

// Define the expected error response shape from your API
interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown;
}

// Define the raw backend response type for individual response items
interface BackendResponseItem {
  _id: string;
  content: string;
  category: string;
  createdBy: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

type AssessmentError = AxiosError<ApiErrorResponse>;

export const createAssessment = (data: {
  title: string;
  question: {
    text: string;
    type: string;
    options: { text: string; response: string; weight?: number; order?: number }[];
    isRequired?: boolean;
    customInstructions?: string;
  };
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await apiClient.post('/assessments/create', data);
    dispatch(setAssessments([...(response.data.assessments || []), response.data.assessment]));
    return response.data.assessment;
  } catch (error: unknown) {
    const assessmentError = error as AssessmentError;
    dispatch(setError(assessmentError.response?.data?.message || 'Failed to create assessment'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateAssessment = createAsyncThunk(
  'assessment/updateAssessment',
  async (
    { assessmentId, data }: {
      assessmentId: string;
      data: Partial<{
        title: string;
        isActive: boolean;
        question: {
          text?: string;
          type?: string;
          options?: { _id?: string; text: string; response: string; weight?: number; order?: number }[];
          isRequired?: boolean;
          customInstructions?: string;
        };
      }>;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.put(`/assessments/${assessmentId}`, data);
      dispatch(setCurrentAssessment(response.data.assessment));
      await dispatch(fetchAssessments());
      return response.data.assessment;
    } catch (error: unknown) {
      const assessmentError = error as AssessmentError;
      return rejectWithValue(assessmentError.response?.data?.message || 'Failed to update assessment');
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deleteAssessment = createAsyncThunk(
  'assessment/deleteAssessment',
  async (assessmentId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      await apiClient.delete(`/assessments/${assessmentId}`);
      return assessmentId;
    } catch (error: unknown) {
      const assessmentError = error as AssessmentError;
      return rejectWithValue(assessmentError.response?.data?.message || 'Failed to delete assessment');
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchAssessments = createAsyncThunk(
  'assessment/fetchAssessments',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.get('/assessments');
      dispatch(setAssessments(response.data.assessments));
      return response.data.assessments;
    } catch (error: unknown) {
      const assessmentError = error as AssessmentError;
      return rejectWithValue(assessmentError.response?.data?.message || 'Failed to fetch assessments');
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchAssessmentByIdAdmin = createAsyncThunk(
  'assessment/fetchAssessmentByIdAdmin',
  async (assessmentId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.get(`/assessments/${assessmentId}`);
      dispatch(setCurrentAssessment(response.data.assessment));
      return response.data.assessment;
    } catch (error: unknown) {
      const assessmentError = error as AssessmentError;
      return rejectWithValue(assessmentError.response?.data?.message || 'Failed to fetch assessment');
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchAssessmentById = createAsyncThunk(
  'assessment/fetchAssessmentById',
  async (assessmentId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.get(`/assessments/user/${assessmentId}`);
      dispatch(setCurrentAssessment(response.data.assessment));
      return response.data.assessment;
    } catch (error: unknown) {
      const assessmentError = error as AssessmentError;
      return rejectWithValue(assessmentError.response?.data?.message || 'Failed to fetch assessment');
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const takeAssessment = createAsyncThunk(
  'assessment/takeAssessment',
  async (
    data: { assessmentId: string; selectedOptionIds: string[] },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));
      console.log("Sending takeAssessment request:", data);
      const response = await apiClient.post('/assessments/take', data);
      console.log("takeAssessment response:", response.data);

      if (!response.data.success || !response.data.response) {
        console.error("Invalid response structure:", response.data);
        return rejectWithValue({ message: "Invalid response from server", status: response.status });
      }

      const backendResponse = response.data.response;
      if (!backendResponse.assessmentId || !Array.isArray(backendResponse.responses)) {
        console.error("Malformed response data:", backendResponse);
        return rejectWithValue({ message: "Malformed response data", status: 200 });
      }

      const transformedResponse: IAssessmentResponse = {
        assessmentId: backendResponse.assessmentId,
        selectedOptionIds: backendResponse.selectedOptionIds,
        responses: backendResponse.responses.map((resp: BackendResponseItem) => ({
          _id: resp._id,
          content: resp.content,
          category: resp.category,
          createdBy: resp.createdBy,
          tags: resp.tags,
          createdAt: resp.createdAt,
          updatedAt: resp.updatedAt,
        })),
      };

      console.log("Transformed response:", transformedResponse);
      dispatch(setCurrentResponse(transformedResponse));
      return transformedResponse;
    } catch (error: unknown) {
      const assessmentError = error as AssessmentError;
      console.error("takeAssessment error:", {
        message: assessmentError.response?.data?.message,
        status: assessmentError.response?.status,
        data: assessmentError.response?.data,
        error: assessmentError,
      });
      return rejectWithValue({
        message: assessmentError.response?.data?.message || 'Failed to take assessment',
        status: assessmentError.response?.status,
      });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchAssessmentResponseById = createAsyncThunk(
  'assessment/fetchAssessmentResponseById',
  async (assessmentId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.get(`/assessments/${assessmentId}/response`);

      const backendResponse = response.data.response;
      const transformedResponse: IAssessmentResponse = {
        assessmentId,
        selectedOptionIds: [],
        responses: backendResponse.map((resp: BackendResponseItem) => ({
          _id: resp._id,
          content: resp.content,
          category: resp.category,
          createdBy: resp.createdBy,
          tags: resp.tags,
          createdAt: resp.createdAt,
          updatedAt: resp.updatedAt,
        })),
      };

      dispatch(setCurrentResponse(transformedResponse));
      return transformedResponse;
    } catch (error: unknown) {
      const assessmentError = error as AssessmentError;
      return rejectWithValue(assessmentError.response?.data?.message || 'Failed to fetch response');
    } finally {
      dispatch(setLoading(false));
    }
  }
);