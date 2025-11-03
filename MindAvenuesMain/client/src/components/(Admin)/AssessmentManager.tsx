"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { createAssessment, updateAssessment, deleteAssessment, fetchAssessments, fetchAssessmentByIdAdmin } from "@/features/assessment/assessmentApi";
import { setError } from "@/features/assessment/assessmentSlice";

interface Option {
  _id?: string; // Added for editing existing options
  text: string;
  response: string;
}

interface AssessmentOption {
  _id?: string;
  text: string;
  response: { content: string; _id?: string } | string;
}

interface AssessmentQuestion {
  text: string;
  type: "single" | "multiple";
  options: AssessmentOption[];
  isRequired?: boolean;
  customInstructions?: string;
}

interface Assessment {
  _id: string;
  title: string;
  question: AssessmentQuestion;
  isActive: boolean;
  createdBy?: string; // Optional, typically set by backend
}

const AssessmentManager: React.FC = () => {
  const dispatch = useDispatch();
  const { assessments, loading, error } = useAppSelector((state) => state.assessment);
  const [title, setTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [type, setType] = useState<"single" | "multiple">("single");
  const [options, setOptions] = useState<Option[]>([{ text: "", response: "" }]);
  const [isRequired, setIsRequired] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [customInstructions, setCustomInstructions] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fetchingAssessment, setFetchingAssessment] = useState(false);

  useEffect(() => {
    dispatch(fetchAssessments());
  }, [dispatch]);

  const handleAddOption = () => {
    setOptions([...options, { text: "", response: "" }]);
  };

  const handleOptionChange = (index: number, field: keyof Option, value: string) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => setOptions(options.filter((_, i) => i !== index));

  const validateForm = () => {
    if (!title.trim()) return "Title is required";
    if (!questionText.trim()) return "Question text is required";
    if (options.length < 2) return "At least two options are required";
    if (options.some((opt) => !opt.text.trim() || !opt.response.trim())) {
      return "All options must have text and a response";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setSuccessMessage(null);
      dispatch(setError(validationError));
      return;
    }

    const questionData = {
      text: questionText,
      type,
      options: options.map((opt) => ({
        ...(opt._id ? { _id: opt._id } : {}), // Include _id if editing
        text: opt.text,
        response: opt.response,
      })),
      isRequired,
      customInstructions,
    };

    const data = {
      title,
      question: questionData,
      ...(editingId ? { isActive } : {}),
    };

    try {
      if (editingId) {
        await dispatch(updateAssessment({ assessmentId: editingId, data })).unwrap();
        setSuccessMessage("Assessment updated successfully");
      } else {
        await dispatch(createAssessment(data));
        setSuccessMessage("Assessment created successfully");
      }
      resetForm();
      dispatch(fetchAssessments());
    } catch (err) {
      console.error("Submission error:", err);
      setSuccessMessage(null);
      dispatch(setError("Failed to save assessment"));
    }
  };

  const handleEdit = async (assessmentId: string) => {
    setFetchingAssessment(true);
    setSuccessMessage(null);
    dispatch(setError(""));

    try {
      const result = await dispatch(fetchAssessmentByIdAdmin(assessmentId)).unwrap() as Assessment;
      console.log("Fetched assessment for edit:", result);
      if (result) {
        setTitle(result.title);
        setQuestionText(result.question.text);
        setType(result.question.type);
        setOptions(
          result.question.options.map((opt: AssessmentOption) => ({
            _id: opt._id, // Preserve _id for updates
            text: opt.text || "",
            response: typeof opt.response === "string" ? opt.response : opt.response?.content || "",
          }))
        );
        setIsRequired(result.question.isRequired ?? true);
        setIsActive(result.isActive ?? true);
        setCustomInstructions(result.question.customInstructions || "");
        setEditingId(result._id);
      }
    } catch (err) {
      console.error("Error fetching assessment for edit:", err);
      dispatch(setError("Failed to load assessment for editing"));
    } finally {
      setFetchingAssessment(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteAssessment(id)).unwrap();
      setSuccessMessage("Assessment deleted successfully");
      dispatch(fetchAssessments());
    } catch (err) {
      console.error("Delete error:", err);
      dispatch(setError("Failed to delete assessment"));
    }
  };

  const resetForm = () => {
    setTitle("");
    setQuestionText("");
    setType("single");
    setOptions([{ text: "", response: "" }]);
    setIsRequired(true);
    setIsActive(true);
    setCustomInstructions("");
    setEditingId(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom color="#9333ea" fontWeight="bold">
        Manage Assessments
      </Typography>

      {loading && !fetchingAssessment && <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Box component="form" sx={{ mb: 4, bgcolor: "#fff", p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h5" gutterBottom>
          {editingId ? "Edit Assessment" : "Create Assessment"}
        </Typography>
        {fetchingAssessment && <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />}
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!title.trim() && !!error}
          disabled={fetchingAssessment}
        />
        <TextField
          label="Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!questionText.trim() && !!error}
          disabled={fetchingAssessment}
        />
        <FormControl fullWidth margin="normal" disabled={fetchingAssessment}>
          <InputLabel>Type</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value as "single" | "multiple")}>
            <MenuItem value="single">Single Choice</MenuItem>
            <MenuItem value="multiple">Multiple Choice</MenuItem>
          </Select>
        </FormControl>
        {options.map((opt, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
            <TextField
              label="Option Text"
              value={opt.text}
              onChange={(e) => handleOptionChange(index, "text", e.target.value)}
              fullWidth
              required
              error={!opt.text.trim() && !!error}
              disabled={fetchingAssessment}
            />
            <TextField
              label="Response"
              value={opt.response}
              onChange={(e) => handleOptionChange(index, "response", e.target.value)}
              fullWidth
              multiline
              required
              error={!opt.response.trim() && !!error}
              disabled={fetchingAssessment}
            />
            <IconButton onClick={() => handleRemoveOption(index)} disabled={options.length === 1 || fetchingAssessment}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button onClick={handleAddOption} startIcon={<Add />} sx={{ mb: 2 }} disabled={fetchingAssessment}>
          Add Option
        </Button>
        <TextField
          label="Custom Instructions"
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          disabled={fetchingAssessment}
        />
        <FormControlLabel
          control={<Switch checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} disabled={fetchingAssessment} />}
          label="Required"
          sx={{ mb: 2 }}
        />
        {editingId && (
          <FormControlLabel
            control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={fetchingAssessment} />}
            label="Active"
            sx={{ mb: 2 }}
          />
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || fetchingAssessment}
          sx={{ mt: 2 }}
        >
          {editingId ? "Update Assessment" : "Create Assessment"}
        </Button>
        {editingId && (
          <Button variant="outlined" color="secondary" onClick={resetForm} sx={{ mt: 2, ml: 2 }} disabled={fetchingAssessment}>
            Cancel Edit
          </Button>
        )}
      </Box>

      <Typography variant="h5" gutterBottom>
        Existing Assessments
      </Typography>
      {assessments.length === 0 ? (
        <Typography color="textSecondary">No assessments found</Typography>
      ) : (
        <List sx={{ bgcolor: "#fff", borderRadius: 2, boxShadow: 1 }}>
          {assessments.map((assessment) => (
            <ListItem key={assessment._id} divider>
              <ListItemText
                primary={assessment.title}
                secondary={`Question: ${assessment.question.text} | Type: ${assessment.question.type} | Active: ${assessment.isActive ? "Yes" : "No"}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEdit(assessment._id)} disabled={loading}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(assessment._id)} disabled={loading}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AssessmentManager;