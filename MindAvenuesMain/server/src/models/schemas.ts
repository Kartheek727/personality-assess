//src/models/schemas.ts
import { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  IUser,
  IAssessment,
  IQuestion,
  IOption,
  IResponse,
  IPayment,
  UserRole,
  AssessmentType,
  PaymentStatus,
} from '../types';
import { IAdminInsights } from '../types/adminInsights';

const CompletedAssessmentSchema = new Schema({
  assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  completedAt: { type: Date, default: Date.now },
  selectedOptions: [{ type: Schema.Types.ObjectId, ref: 'Option', required: true }],
  responseReceived: [{ type: Schema.Types.ObjectId, ref: 'Response', required: true }], // Changed to array
});

// User Schema
const UserSchema = new Schema<IUser & Document>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // Don't return password by default
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  }, // Added
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  }, // Added
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid mobile number'], // E.164 format
  }, // Added
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    select: false,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  },
  completedAssessments: [CompletedAssessmentSchema],
  insights: {
    totalAssessments: { type: Number, default: 0 },
    lastAssessmentDate: { type: Date },
    preferredResponseTypes: { type: Map, of: Number, default: () => new Map() },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Enforce single assessment taking and update insights
UserSchema.pre('save', async function (next) {
  if (this.isModified('completedAssessments')) {
    const newAssessmentIds = this.completedAssessments.map((a) => a.assessment.toString());
    const duplicates = newAssessmentIds.some((id, index) => newAssessmentIds.indexOf(id) !== index);
    if (duplicates) {
      throw new Error('User cannot take the same assessment multiple times');
    }
    this.insights.totalAssessments = this.completedAssessments.length;
    this.insights.lastAssessmentDate = new Date();
  }
  this.updatedAt = new Date();
  next();
});

// New PDFLogo Schema
export interface IPDFLogo extends Document {
  url: string; // Cloudinary URL for the logo image
  title: string;
  subtitle: string;
  tagline: string;
  createdAt: Date;
  updatedAt: Date;
}

const PDFLogoSchema = new Schema<IPDFLogo>({
  url: {
    type: String,
    required: true,
    unique: true, // Ensures only one logo exists
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  tagline: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PDFLogoSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Assessment Schema
const AssessmentSchema = new Schema<IAssessment & Document>({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  analytics: {
    totalCompletions: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageTimeToComplete: { type: Number },
    optionSelectionStats: { type: Map, of: Number, default: () => new Map() },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AssessmentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Question Schema
const QuestionSchema = new Schema<IQuestion & Document>({
  text: { type: String, required: true, trim: true, maxlength: 500 },
  type: { type: String, enum: Object.values(AssessmentType), required: true },
  options: [{ type: Schema.Types.ObjectId, ref: 'Option', required: true }],
  isRequired: { type: Boolean, default: true },
  customInstructions: { type: String, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

QuestionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Option Schema
const OptionSchema = new Schema<IOption & Document>({
  text: { type: String, required: true, trim: true, maxlength: 1000 },
  response: { type: Schema.Types.ObjectId, ref: 'Response', required: true },
  weight: { type: Number, min: 0, default: 1 },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

OptionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Response Schema
const ResponseSchema = new Schema<IResponse & Document>({
  content: { type: String, required: true, maxlength: 5000 },
  category: { type: String, required: true, trim: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String, trim: true, maxlength: 50 }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ResponseSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Payment Schema
const PaymentSchema = new Schema<IPayment & Document>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
  transactionId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PaymentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ 'completedAssessments.assessment': 1 });
AssessmentSchema.index({ createdBy: 1, isActive: 1 });
PaymentSchema.index({ user: 1, status: 1 });
ResponseSchema.index({ category: 1, tags: 1 });

const AdminInsightsSchema = new Schema<IAdminInsights & Document>({
  totalUsers: { type: Number, default: 0 },
  paidUsers: { type: Number, default: 0 },
  unpaidUsers: { type: Number, default: 0 },
  totalPayments: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  paymentStatsByDate: { type: Map, of: new Schema({
    count: { type: Number },
    amount: { type: Number },
  }), default: () => new Map() },
  assessmentStats: {
    totalAssessments: { type: Number, default: 0 },
    activeAssessments: { type: Number, default: 0 },
    completedAssessments: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AdminInsightsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export {
  UserSchema,
  AssessmentSchema,
  QuestionSchema,
  OptionSchema,
  ResponseSchema,
  PaymentSchema,
  AdminInsightsSchema,
  PDFLogoSchema, // Export the new schema
};