//src/types/index.ts
import { Types } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum AssessmentType {
  SINGLE_CHOICE = 'single',
  MULTIPLE_CHOICE = 'multiple',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface ICompletedAssessment {
  assessment: Types.ObjectId;
  completedAt: Date;
  selectedOptions: Types.ObjectId[];
  responseReceived: Types.ObjectId[]; // Changed from ObjectId to ObjectId[]
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  role: UserRole;
  isVerified: boolean;
  verificationToken?: string;
  profilePicture?: string;
  paymentStatus: PaymentStatus;
  completedAssessments: ICompletedAssessment[];
  insights: {
    totalAssessments: number;
    lastAssessmentDate: Date;
    preferredResponseTypes: Map<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>; // Added
}

export interface IAssessment {
  _id: Types.ObjectId;
  title: string;
  question: Types.ObjectId | IQuestion; // Allow populated question
  isActive: boolean;
  createdBy: Types.ObjectId;
  analytics: {
    totalCompletions: number;
    completionRate: number;
    averageTimeToComplete?: number;
    optionSelectionStats: Map<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  _id: Types.ObjectId;
  text: string;
  type: AssessmentType;
  options: Types.ObjectId[] | (IOption & { response: IResponse })[]; // Allow populated options
  isRequired: boolean;
  customInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOption {
  _id: Types.ObjectId;
  text: string;
  response: Types.ObjectId | IResponse; // Allow populated response
  weight?: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResponse {
  _id: Types.ObjectId;
  content: string;
  category: string;
  createdBy: Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPDFLogo {
  url: string;
  title: string;
  subtitle: string;
  tagline: string;
  createdAt: Date;
  updatedAt: Date;
}