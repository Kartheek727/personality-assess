// src/components/profile/UserDetailsCard.tsx
import React, { useEffect } from "react";
import { useDispatch, useAppSelector } from "@/redux/hooks";
import { uploadProfilePicture, fetchProfilePicture, clearImageMessages } from "@/features/image/imageSlice";
import { Card, CardContent, Typography, Chip, Avatar, Box, IconButton, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface UserDetailsCardProps {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    role: string;
    paymentStatus: string;
    profilePicture?: string;
    completedAssessmentsCount: number;
  };
}

const UserDetailsCard: React.FC<UserDetailsCardProps> = ({ user }) => {
  const dispatch = useDispatch();
  const { profilePicture, loading: imageLoading, error: imageError, successMessage } = useAppSelector((state) => state.image);

  // Fetch profile picture on mount if not already fetched
  useEffect(() => {
    if (!profilePicture) {
      dispatch(fetchProfilePicture());
    }
  }, [dispatch, profilePicture]);

  // Show toast messages for success or error
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearImageMessages()); // Clear message after showing success toast
    }
    if (imageError) {
      toast.error(imageError);
      dispatch(clearImageMessages()); // Clear message after showing error toast
    }
  }, [successMessage, imageError, dispatch]);

  // Use Redux profile picture if available, otherwise fall back to user prop or default
  const displayPicture = profilePicture || user.profilePicture || "https://via.placeholder.com/150?text=User";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const resultAction = await dispatch(uploadProfilePicture(file));
      if (uploadProfilePicture.rejected.match(resultAction)) {
        toast.error(resultAction.payload as string);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card sx={{ borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)", border: "1px solid #1a62a4/20" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar src={displayPicture} sx={{ width: 80, height: 80, bgcolor: "#1a62a4" }}>
                {!profilePicture && !user.profilePicture && user.firstName[0]}
              </Avatar>
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  bgcolor: "#f47528",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "#fc9054" },
                  p: 0.75,
                }}
                disabled={imageLoading}
              >
                {imageLoading ? (
                  <CircularProgress size={20} sx={{ color: "#ffffff" }} />
                ) : (
                  <EditIcon fontSize="small" />
                )}
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              </IconButton>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a62a4", ml: 2 }}>
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
          <Typography sx={{ color: "#045494", mb: 1 }}>Email: {user.email}</Typography>
          <Typography sx={{ color: "#045494", mb: 2 }}>Mobile: {user.mobileNumber}</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={user.role}
              sx={{ bgcolor: user.role === "admin" ? "#1a62a4" : "#e0e0e0", color: user.role === "admin" ? "#ffffff" : "#045494" }}
            />
            <Chip
              label={user.paymentStatus}
              sx={{ bgcolor: user.paymentStatus === "completed" ? "#f47528" : "#fc9054", color: "#ffffff" }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserDetailsCard;