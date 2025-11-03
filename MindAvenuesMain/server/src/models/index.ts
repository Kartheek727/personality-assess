import { model } from 'mongoose';
import {
  UserSchema,
  AssessmentSchema,
  QuestionSchema,
  OptionSchema,
  ResponseSchema,
  PaymentSchema,
  AdminInsightsSchema,
  PDFLogoSchema,
} from './schemas';
import { IUser, IAssessment, IQuestion, IOption, IResponse, IPayment } from '../types';
import { IAdminInsights } from '../types/adminInsights';
import { IPDFLogo } from './schemas';

const User = model<IUser>('User', UserSchema);
const Assessment = model<IAssessment>('Assessment', AssessmentSchema);
const Question = model<IQuestion>('Question', QuestionSchema);
const Option = model<IOption>('Option', OptionSchema);
const Response = model<IResponse>('Response', ResponseSchema);
const Payment = model<IPayment>('Payment', PaymentSchema);
const AdminInsights = model<IAdminInsights>('AdminInsights', AdminInsightsSchema);
const PDFLogo = model<IPDFLogo>('PDFLogo', PDFLogoSchema);

export { User, Assessment, Question, Option, Response, Payment, AdminInsights, PDFLogo };