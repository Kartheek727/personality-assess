// src/services/assessment.service.ts
import { Assessment, Question, Option, Response, User } from '../models';
import { IAssessment, IQuestion, IOption, PaymentStatus, IResponse } from '../types';
import { BadRequestError, NotFoundError } from '../middleware/error';
import { Types } from 'mongoose';

export const createAssessment = async (title: string, questionData: any, createdBy: string): Promise<IAssessment> => {
  const user = await User.findById(createdBy);
  if (!user || user.role !== 'admin') throw new BadRequestError('Only admins can create assessments');

  const options = await Promise.all(
    questionData.options.map(async (opt: any) => {
      const responseDoc = await Response.create({
        content: opt.response,
        category: 'default',
        createdBy: user._id,
        tags: [],
      });
      return await Option.create({
        text: opt.text,
        response: responseDoc._id,
        weight: opt.weight || 1,
        order: opt.order || 0,
      });
    })
  );

  const question = await Question.create({
    text: questionData.text,
    type: questionData.type,
    options: options.map((opt) => opt._id),
    isRequired: questionData.isRequired ?? true,
    customInstructions: questionData.customInstructions,
  });

  return await Assessment.create({
    title,
    question: question._id,
    createdBy,
  });
};

export const updateAssessment = async (
  assessmentId: string,
  data: Partial<IAssessment & { question: Partial<IQuestion & { options?: (Partial<IOption> & { response?: string })[] }> }>,
  adminId: string
): Promise<IAssessment> => {
  const assessment = await Assessment.findById(assessmentId).populate({
    path: 'question',
    populate: { path: 'options', populate: { path: 'response' } },
  });
  if (!assessment) throw new NotFoundError('Assessment not found');

  const admin = await User.findById(adminId);
  if (!admin || admin.role !== 'admin') throw new BadRequestError('Only admins can update assessments');

  // Update top-level assessment fields
  if (data.title !== undefined) assessment.title = data.title;
  if (data.isActive !== undefined) assessment.isActive = data.isActive;
  if (data.createdBy && Types.ObjectId.isValid(data.createdBy)) {
    const newCreator = await User.findById(data.createdBy);
    if (!newCreator || newCreator.role !== 'admin') throw new BadRequestError('Invalid or non-admin creator');
    assessment.createdBy = new Types.ObjectId(data.createdBy);
  }

  // Update question fields if provided
  if (data.question) {
    const questionDoc = await Question.findById(assessment.question);
    if (!questionDoc) throw new NotFoundError('Question not found');

    const populatedQuestion = assessment.question as IQuestion & { options: (IOption & { response: IResponse })[] };

    // Log incoming data for debugging
    console.log('Incoming question data:', data.question);

    if (data.question.text !== undefined) questionDoc.text = data.question.text;
    if (data.question.type !== undefined) {
      console.log('Updating type to:', data.question.type);
      questionDoc.type = data.question.type; // Should be "single" or "multiple"
      questionDoc.markModified('type'); // Ensure Mongoose detects the change
    }
    if (data.question.isRequired !== undefined) questionDoc.isRequired = data.question.isRequired;
    if (data.question.customInstructions !== undefined) questionDoc.customInstructions = data.question.customInstructions;

    // Handle options updates
    if (data.question.options !== undefined) {
      const existingOptions = new Map(populatedQuestion.options.map((opt) => [opt._id.toString(), opt]));

      const newOptions: IOption[] = await Promise.all(
        data.question.options.map(async (opt: Partial<IOption> & { response?: string }) => {
          if (opt._id && existingOptions.has(opt._id.toString())) {
            const existingOpt = await Option.findById(opt._id);
            if (!existingOpt) throw new BadRequestError(`Option ${opt._id} not found`);

            if (opt.text !== undefined) existingOpt.text = opt.text;
            if (opt.weight !== undefined) existingOpt.weight = opt.weight;
            if (opt.order !== undefined) existingOpt.order = opt.order;
            if (opt.response !== undefined) {
              const response = await Response.findById(existingOpt.response);
              if (response) {
                response.content = opt.response;
                await response.save();
              } else {
                const newResponse = await Response.create({
                  content: opt.response,
                  category: 'default',
                  createdBy: admin._id,
                  tags: [],
                });
                existingOpt.response = newResponse._id;
              }
            }
            await existingOpt.save();
            return existingOpt;
          } else {
            const responseDoc = await Response.create({
              content: opt.response || '',
              category: 'default',
              createdBy: admin._id,
              tags: [],
            });
            return await Option.create({
              text: opt.text || '',
              response: responseDoc._id,
              weight: opt.weight || 1,
              order: opt.order || 0,
            });
          }
        })
      );

      const newOptionIds = newOptions.map((opt: IOption) => opt._id.toString());
      const optionsToDelete = populatedQuestion.options.filter((opt) => !newOptionIds.includes(opt._id.toString()));
      await Promise.all(optionsToDelete.map(async (opt) => {
        await Response.deleteOne({ _id: opt.response });
        await Option.deleteOne({ _id: opt._id });
      }));

      questionDoc.options = newOptions.map((opt: IOption) => opt._id);
    }

    console.log('Question before save:', questionDoc.toObject());
    await questionDoc.save();
    const savedQuestion = await Question.findById(questionDoc._id);
    if (savedQuestion) {
      console.log('Question after save:', savedQuestion.toObject());
    } else {
      console.log('Question not found after save');
    }
  }

  await assessment.save();
  return assessment;
};

export const deleteAssessment = async (assessmentId: string, adminId: string): Promise<void> => {
  const assessment = await Assessment.findById(assessmentId).populate({
    path: 'question',
    populate: { path: 'options', populate: { path: 'response' } },
  });
  if (!assessment) throw new NotFoundError('Assessment not found');

  const admin = await User.findById(adminId);
  if (!admin || admin.role !== 'admin') throw new BadRequestError('Only admins can delete assessments');

  // Delete associated question, options, and responses
  const question = assessment.question as any;
  if (question) {
    await Promise.all(
      question.options.map(async (opt: any) => {
        await Response.deleteOne({ _id: opt.response });
        await Option.deleteOne({ _id: opt._id });
      })
    );
    await Question.deleteOne({ _id: question._id });
  }

  // Step 1: Pull the completed assessment from users
  await User.updateMany(
    { 'completedAssessments.assessment': new Types.ObjectId(assessmentId) },
    {
      $pull: { completedAssessments: { assessment: new Types.ObjectId(assessmentId) } },
    }
  );

  // Step 2: Update insights for affected users
  const users = await User.find({ 'completedAssessments.assessment': new Types.ObjectId(assessmentId) });
  await Promise.all(
    users.map(async (user) => {
      // Filter out the deleted assessment
      const remainingAssessments = user.completedAssessments.filter(
        (ca) => ca.assessment.toString() !== assessmentId
      );

      // Calculate totalAssessments and lastAssessmentDate
      const totalAssessments = remainingAssessments.length;
      const lastAssessmentDate = remainingAssessments.length > 0
        ? new Date(Math.max(...remainingAssessments.map(ca => ca.completedAt.getTime())))
        : null; // Set to null if no assessments remain

      // Update the user's insights
      user.insights.totalAssessments = totalAssessments;
      user.insights.lastAssessmentDate = lastAssessmentDate || new Date(0);
      await user.save();
    })
  );

  // Delete the assessment
  await Assessment.deleteOne({ _id: assessmentId });
};

export const takeAssessment = async (
  userId: string,
  assessmentId: string,
  selectedOptionIds: string[]
): Promise<any> => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User not found');
  if (user.paymentStatus !== PaymentStatus.COMPLETED) throw new BadRequestError('Payment required');

  const assessment = await Assessment.findById(assessmentId).populate({
    path: 'question',
    populate: { path: 'options', populate: { path: 'response' } },
  });
  if (!assessment || !assessment.isActive) throw new NotFoundError('Active assessment not found');

  const question = assessment.question as IQuestion & { options: (IOption & { response: IResponse })[] };
  const validOptions = question.options.map(opt => opt._id.toString());
  if (!selectedOptionIds.every(id => validOptions.includes(id))) throw new BadRequestError('Invalid option selected');

  // Collect all responses for selected options
  const responsesReceived = question.options
    .filter(opt => selectedOptionIds.includes(opt._id.toString()))
    .map(opt => opt.response);

  // Store the assessment response in the user's completedAssessments
  user.completedAssessments.push({
    assessment: assessment._id,
    completedAt: new Date(),
    selectedOptions: selectedOptionIds.map(id => new Types.ObjectId(id)),
    responseReceived: responsesReceived.map(resp => resp._id), // Array of response IDs
  });

  // Update analytics using Map methods
  assessment.analytics.totalCompletions += 1;
  selectedOptionIds.forEach((optionId) => {
    const stats = assessment.analytics.optionSelectionStats;
    if (!stats.has(optionId)) {
      stats.set(optionId, 0);
    }
    stats.set(optionId, (stats.get(optionId) || 0) + 1);
  });

  await Promise.all([user.save(), assessment.save()]);

  // Return all responses for the selected options
  return {
    assessmentId: assessment._id.toString(),
    selectedOptionIds,
    responses: responsesReceived.map(resp => ({
      _id: resp._id.toString(),
      content: resp.content,
      category: resp.category,
      createdBy: resp.createdBy.toString(),
      tags: resp.tags,
      createdAt: resp.createdAt,
      updatedAt: resp.updatedAt,
      // __v is optional; include only if explicitly needed and typed in IResponse
    })),
  };
};

export const getActiveAssessments = async (): Promise<IAssessment[]> => {
  return await Assessment.find({ isActive: true }).populate('question');
};

export const getAssessmentByIdAdmin = async (id: string): Promise<IAssessment> => {
  const assessment = await Assessment.findById(id).populate({
    path: 'question',
    populate: { path: 'options', populate: { path: 'response' } },
  });
  if (!assessment) throw new NotFoundError('Assessment not found');
  return assessment;
};

export const getAssessmentByIdUser = async (id: string, userId: string): Promise<any> => {
  const assessment = await Assessment.findById(id).populate({
    path: 'question',
    populate: { path: 'options', populate: { path: 'response' } },
  });
  if (!assessment) throw new NotFoundError('Assessment not found');

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User not found');

  const completedAssessment = user.completedAssessments.find(
    (ca) => ca.assessment.toString() === id
  );

  const question = assessment.question as any;
  let filteredOptions;

  if (completedAssessment) {
    const selectedOptionIds = completedAssessment.selectedOptions.map((id) => id.toString());
    filteredOptions = question.options.filter((opt: any) =>
      selectedOptionIds.includes(opt._id.toString())
    );
  } else {
    filteredOptions = question.options.map((opt: any) => ({
      _id: opt._id,
      text: opt.text,
      weight: opt.weight,
      order: opt.order,
      createdAt: opt.createdAt,
      updatedAt: opt.updatedAt,
      __v: opt.__v,
    }));
  }

  const filteredAssessment = {
    _id: assessment._id,
    title: assessment.title,
    isActive: assessment.isActive,
    createdBy: assessment.createdBy,
    analytics: assessment.analytics,
    createdAt: assessment.createdAt,
    updatedAt: assessment.updatedAt,
    __v: assessment.__v,
    question: {
      _id: question._id,
      text: question.text,
      type: question.type,
      options: filteredOptions,
      isRequired: question.isRequired,
      customInstructions: question.customInstructions,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      __v: question.__v,
    },
  };

  return filteredAssessment;
};

export const getUserAssessmentResponse = async (userId: string, assessmentId: string): Promise<any> => {
  const user = await User.findById(userId).populate({
    path: 'completedAssessments.responseReceived',
    model: 'Response',
  });
  if (!user) throw new NotFoundError('User not found');

  const completedAssessment = user.completedAssessments.find(
    (ca) => ca.assessment.toString() === assessmentId
  );
  if (!completedAssessment) throw new NotFoundError('Assessment not completed by user');

  return completedAssessment.responseReceived;
};