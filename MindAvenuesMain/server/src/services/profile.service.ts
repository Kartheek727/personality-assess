// src/services/profile.service.ts
import { Types } from "mongoose";
import { NotFoundError } from "../middleware/error";
import { User, Assessment, Payment } from "../models";
import { IAssessment, IPayment } from "../types";

interface ProfileData {
  user: {
    _id: Types.ObjectId;
    email: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    role: string;
    paymentStatus: string;
    profilePicture?: string;
    completedAssessmentsCount: number;
  };
  assessments: IAssessment[];
  payments: IPayment[];
  totalAssessmentsAvailable: number;
}

export const getProfileData = async (userId: string): Promise<ProfileData> => {
  // Fetch user data
  const user = await User.findById(userId)
    .select("email firstName lastName mobileNumber role paymentStatus profilePicture completedAssessments")
    .lean();
  if (!user) throw new NotFoundError("User not found");

  // Fetch user's completed assessments with populated question details
  const completedAssessments = await User.findById(userId)
    .select("completedAssessments")
    .populate({
      path: "completedAssessments.assessment",
      select: "title question isActive createdAt updatedAt",
      populate: {
        path: "question",
        select: "text type options isRequired customInstructions createdAt updatedAt",
      },
    })
    .lean();

  const assessments = completedAssessments?.completedAssessments.map((ca: any) => ({
    _id: ca.assessment._id,
    title: ca.assessment.title,
    question: ca.assessment.question,
    isActive: ca.assessment.isActive,
    createdAt: ca.assessment.createdAt,
    updatedAt: ca.assessment.updatedAt,
    completedAt: ca.completedAt,
    createdBy: ca.assessment.createdBy,
    analytics: ca.assessment.analytics,
  })) || [];

  // Fetch payments
  const payments = await Payment.find({ user: userId }).lean();

  // Fetch total available assessments (for comparison)
  const totalAssessmentsAvailable = await Assessment.countDocuments({ isActive: true });

  return {
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      role: user.role,
      paymentStatus: user.paymentStatus,
      profilePicture: user.profilePicture || undefined,
      completedAssessmentsCount: assessments.length,
    },
    assessments,
    payments,
    totalAssessmentsAvailable,
  };
};