// src/controllers/admin.controller.ts
import { Request, Response } from "express";
import { getAdminInsights, getAllUsers, toggleUserRole } from "../services/admin.service";
import catchAsyncError from "../middleware/catchAsyncError";

export const getAllAdminInsights = catchAsyncError(async (_req: Request, res: Response) => {
  const insights = await getAdminInsights();
  res.status(200).json({ success: true, ...insights });
});

// Controller to get all users
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const result = await getAllUsers();
    res.status(200).json({
      success: true,
      users: result.users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Controller to toggle user role
export const toggleUserRoleController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await toggleUserRole(userId);
    res.status(200).json({
      success: true,
      user: result.user,
    });
  } catch (error: any) {
    res.status(error.message === "User not found" ? 404 : 500).json({
      success: false,
      message: error.message || "Failed to toggle user role",
    });
  }
};