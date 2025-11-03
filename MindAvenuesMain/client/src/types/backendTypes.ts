// src/types/backendTypes.ts
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

export interface IUser {
  _id: string;
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
  completedAssessments: {
    assessment: string;
    completedAt: string;
    selectedOptions: string[];
    responseReceived: string[];
  }[];
  insights: {
    totalAssessments: number;
    lastAssessmentDate: string | null;
    preferredResponseTypes: { [key: string]: number };
  };
  createdAt: string;
  updatedAt: string;
  comparePassword?: (candidatePassword: string) => Promise<boolean>;
}

export interface IAssessment {
  _id: string;
  title: string;
  question: IQuestion;
  isActive: boolean;
  createdBy: string;
  analytics: {
    totalCompletions: number;
    completionRate: number;
    averageTimeToComplete?: number;
    optionSelectionStats: { [key: string]: number };
  };
  createdAt: string;
  updatedAt: string;
}

export interface IQuestion {
  _id: string;
  text: string;
  type: AssessmentType;
  options: IOption[];
  isRequired: boolean;
  customInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOption {
  _id: string;
  text: string;
  response?: string;
  weight?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IResponse {
  _id: string;
  content: string;
  category: string;
  createdBy: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Adjusted to match frontend expectations; we'll transform backend data
export interface IAssessmentResponse {
  assessmentId: string;
  selectedOptionIds: string[];
  responses: IResponse[];
}

export interface IPayment {
  _id: string;
  user: string;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentAdmin {
  _id: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

// New PDFLogo Schema
export interface IPDFLogo {
  url: string; // Cloudinary URL for the logo image
  title: string;
  subtitle: string;
  tagline: string;
  createdAt: Date;
  updatedAt: Date;
}