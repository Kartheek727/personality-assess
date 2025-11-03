// src/services/admin.service.ts
import { User, Payment, Assessment, AdminInsights } from "../models";
import { PaymentStatus, UserRole } from "../types";

export const getAdminInsights = async (): Promise<any> => {
  const [users, payments, assessments, adminInsights] = await Promise.all([
    User.find(),
    Payment.find().populate("user", "email firstName lastName"),
    Assessment.find(),
    AdminInsights.findOne() || AdminInsights.create({}),
  ]);

  // Payment Insights
  const paidUsersList = users.filter((u) => u.paymentStatus === PaymentStatus.COMPLETED);
  const paidUsers = paidUsersList.length;
  const unpaidUsers = users.length - paidUsers;
  const totalRevenue = payments.reduce(
    (sum, p) => sum + (p.status === PaymentStatus.COMPLETED ? p.amount : 0),
    0
  );

  const paymentStatsByDate = new Map<string, { count: number; amount: number }>();
  payments.forEach((p) => {
    const date = p.createdAt.toISOString().split("T")[0];
    const stat = paymentStatsByDate.get(date) || { count: 0, amount: 0 };
    stat.count += 1;
    if (p.status === PaymentStatus.COMPLETED) stat.amount += p.amount;
    paymentStatsByDate.set(date, stat);
  });

  // Assessment Insights
  const activeAssessments = assessments.filter((a) => a.isActive).length;
  const completedAssessments = users.reduce(
    (sum, u) => sum + u.completedAssessments.length,
    0
  );

  // Update AdminInsights document
  if (adminInsights) {
    adminInsights.totalUsers = users.length;
    adminInsights.paidUsers = paidUsers;
    adminInsights.unpaidUsers = unpaidUsers;
    adminInsights.totalPayments = payments.length;
    adminInsights.totalRevenue = totalRevenue;
    adminInsights.paymentStatsByDate = paymentStatsByDate;
    adminInsights.assessmentStats = {
      totalAssessments: assessments.length,
      activeAssessments,
      completedAssessments,
    };
    await adminInsights.save();
  }

  return {
    paymentStats: {
      totalUsers: users.length,
      paidUsers,
      unpaidUsers,
      totalPayments: payments.length,
      totalRevenue,
      paymentStatsByDate: Object.fromEntries(paymentStatsByDate),
    },
    payments,
    paidUsers: paidUsersList,
    assessmentStats: {
      totalAssessments: assessments.length,
      activeAssessments,
      completedAssessments,
    },
  };
};

// New function to get all users' complete data
export const getAllUsers = async (): Promise<any> => {
  const users = await User.find().populate("completedAssessments.assessment").populate("completedAssessments.responseReceived");
  return {
    users,
  };
};

// New function to toggle user role (promote/demote)
export const toggleUserRole = async (userId: string): Promise<any> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.role = user.role === UserRole.USER ? UserRole.ADMIN : UserRole.USER;
  await user.save();

  return {
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      role: user.role,
      paymentStatus: user.paymentStatus,
      insights: user.insights,
      completedAssessments: user.completedAssessments,
    },
  };
};