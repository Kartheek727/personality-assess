"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { upsertPDFLogo, fetchPDFLogo } from "@/features/image/imageSlice";
import { Card, CardContent, Typography, Box, Button, TextField, CircularProgress, Avatar, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import toast from "react-hot-toast";

const PDFLogoManager: React.FC = () => {
  const dispatch = useDispatch();
  const { pdfLogo, loading, error } = useAppSelector((state) => state.image);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!pdfLogo) {
      dispatch(fetchPDFLogo());
    } else {
      setTitle(pdfLogo.title);
      setSubtitle(pdfLogo.subtitle);
      setTagline(pdfLogo.tagline);
    }
  }, [dispatch, pdfLogo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !title || !subtitle || !tagline) {
      toast.error("Please provide an image, title, subtitle, and tagline.");
      return;
    }

    const resultAction = await dispatch(upsertPDFLogo({ file, title, subtitle, tagline }));
    if (upsertPDFLogo.fulfilled.match(resultAction)) {
      toast.success("PDF logo updated successfully!");
      setFile(null);
      setIsEditing(false);
    } else {
      toast.error((resultAction.payload as string) || "Failed to update PDF logo");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFile(null); // Reset file when starting to edit
    }
  };

  if (loading && !pdfLogo) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !pdfLogo) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ bgcolor: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          PDF Logo Manager
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Box sx={{ position: "relative", width: 150, height: 150 }}>
            <Avatar
              src={pdfLogo?.url || "https://via.placeholder.com/150?text=PDF+Logo"}
              alt="PDF Logo"
              sx={{ width: 150, height: 150, borderRadius: "8px" }}
            />
            {isEditing && (
              <IconButton
                onClick={() => document.getElementById("pdf-logo-upload")?.click()}
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  bgcolor: "#9333ea",
                  color: "white",
                  "&:hover": { bgcolor: "#7e22ce" },
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          {isEditing ? (
            <>
              <input
                id="pdf-logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {file ? file.name : "No file selected"}
              </Typography>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" } }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save PDF Logo"}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary">
                Title: {pdfLogo?.title || "N/A"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Subtitle: {pdfLogo?.subtitle || "N/A"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Tagline: {pdfLogo?.tagline || "N/A"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditToggle}
                sx={{ mt: 2, bgcolor: "#9333ea", "&:hover": { bgcolor: "#7e22ce" } }}
              >
                Update PDF Logo
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PDFLogoManager;