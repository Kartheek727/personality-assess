//src/middleware/payment.middleware.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { PaymentStatus } from '../types';
import { BadRequestError } from './error';

export const checkPaymentStatus = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.paymentStatus !== PaymentStatus.COMPLETED) {
    throw new BadRequestError('Payment required to access assessments');
  }
  next();
};