import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  createAssessment,
  updateAssessment,
  deleteAssessment,
  takeAssessment,
  getActiveAssessments,
  getAssessmentByIdAdmin,
  getAssessmentByIdUser,
  getUserAssessmentResponse,
} from '../services/assessment.service';
import { validate, createAssessmentSchema } from '../validators';
import catchAsyncError from '../middleware/catchAsyncError';
import { z } from 'zod';
import { IAssessment, IQuestion, IOption } from '../types';

// Define a schema for updating assessments
const updateAssessmentSchema = z.object({
  title: z.string().trim().max(500).optional(),
  isActive: z.boolean().optional(),
  question: z
    .object({
      text: z.string().trim().max(1000).optional(),
      type: z.enum(['single', 'multiple']).optional(),
      options: z
        .array(
          z.object({
            _id: z.string().optional(),
            text: z.string().trim().max(1000).optional(),
            response: z.string().max(5000).optional(),
            weight: z.number().min(0).optional(),
            order: z.number().optional(),
          })
        )
        .optional(),
      isRequired: z.boolean().optional(),
      customInstructions: z.string().max(1000).optional().nullable(),
    })
    .optional(),
}).strict();

// Type assertion to align Zod output with updateAssessment expectations
type UpdateAssessmentData = Partial<IAssessment & {
  question: Partial<IQuestion & { options?: (Partial<IOption> & { response?: string })[] }>;
}>;

export const create = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const data = validate(createAssessmentSchema)(req.body);
  const transformedOptions = data.question.options.map((opt) => ({
    text: opt.text,
    response: opt.response,
    weight: opt.weight,
    order: opt.order,
  }));

  const assessment = await createAssessment(
    data.title,
    {
      text: data.question.text,
      type: data.question.type,
      options: transformedOptions,
      isRequired: data.question.isRequired ?? true,
      customInstructions: data.question.customInstructions,
    },
    req.user!._id
  );
  res.status(201).json({ success: true, assessment });
});

export const update = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const rawData = validate(updateAssessmentSchema)(req.body); // Validate with Zod
  const data = rawData as UpdateAssessmentData; // Type assertion to match service expectation
  const assessment = await updateAssessment(id, data, req.user!._id);
  res.status(200).json({ success: true, assessment });
});

export const remove = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await deleteAssessment(id, req.user!._id);
  res.status(200).json({ success: true, message: 'Assessment deleted' });
});

export const take = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const { assessmentId, selectedOptionIds } = req.body;
  const response = await takeAssessment(req.user!._id, assessmentId, selectedOptionIds);
  res.status(200).json({ success: true, response });
});

export const getAll = catchAsyncError(async (_req: Request, res: Response) => {
  const assessments = await getActiveAssessments();
  res.status(200).json({ success: true, assessments });
});

export const getById = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assessment = await getAssessmentByIdAdmin(id);
  res.status(200).json({ success: true, assessment });
});

export const getByIdUser = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const assessment = await getAssessmentByIdUser(id, req.user!._id);
  res.status(200).json({ success: true, assessment });
});

export const getAssessmentResponse = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const assessmentId = req.params.id;
  const response = await getUserAssessmentResponse(userId, assessmentId);
  res.status(200).json({ success: true, response });
});