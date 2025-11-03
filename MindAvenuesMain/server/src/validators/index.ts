//src/validators/index.ts
import { z } from 'zod';
import { UserRole, AssessmentType } from '../types';

// User Validators
export const registerUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name too long'),
  mobileNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid mobile number'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
});

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Assessment Validators
export const createAssessmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  question: z.object({
    text: z.string().min(1, 'Question text is required').max(500, 'Question too long'),
    type: z.nativeEnum(AssessmentType),
    options: z.array(
      z.object({
        text: z.string().min(1, 'Option text is required').max(1000, 'Option too long'),
        response: z.string().min(1, 'Response ID is required'), // Will be converted to ObjectId
        weight: z.number().min(0).optional().default(1),
        order: z.number().optional().default(0),
      })
    ).min(2, 'At least 2 options required'),
    isRequired: z.boolean().optional().default(true),
    customInstructions: z.string().max(1000, 'Instructions too long').optional(),
  }),
});

// Payment Validators
export const createPaymentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'), // Will be converted to ObjectId
  amount: z.number().min(0, 'Amount must be positive'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
});

// Response Validators
export const createResponseSchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string().max(50, 'Tag too long')).optional(),
});


// Existing schemas (registerUserSchema, loginUserSchema assumed)
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// Utility to parse and validate requests
export const validate = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): T => {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.errors.map((e) => e.message).join(', '));
    }
    return result.data;
  };
};