//src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from './error';
import { UserRole } from '../types';
import { User } from '../models';
import catchAsyncError from './catchAsyncError';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = catchAsyncError(async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) throw new UnauthorizedError('No token provided');

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  const user = await User.findById(decoded.id).select('-password -verificationToken');
  if (!user) throw new UnauthorizedError('Invalid token');

  req.user = user;
  next();
});

export const authorize = (roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) throw new ForbiddenError('Insufficient permissions');
    next();
  };
};