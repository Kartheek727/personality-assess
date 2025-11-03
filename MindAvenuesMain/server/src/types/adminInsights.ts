// src/types/adminInsights.ts
import { Types } from 'mongoose';

export interface IAdminInsights {
  _id: Types.ObjectId;
  totalUsers: number;
  paidUsers: number;
  unpaidUsers: number;
  totalPayments: number;
  totalRevenue: number;
  paymentStatsByDate: Map<string, { count: number; amount: number }>;
  assessmentStats: {
    totalAssessments: number;
    activeAssessments: number;
    completedAssessments: number;
  };
  createdAt: Date;
  updatedAt: Date;
}