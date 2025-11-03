// src/controllers/profile.controller.ts
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getProfileData } from "../services/profile.service";
import catchAsyncError from "../middleware/catchAsyncError";

export const getProfileController = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const profileData = await getProfileData(req.user._id.toString());
  res.status(200).json({
    success: true,
    data: profileData,
  });
});