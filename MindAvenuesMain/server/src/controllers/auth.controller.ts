// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { registerUser, verifyOtp, loginUser } from '../services/auth.service';
import { validate, registerUserSchema, loginUserSchema } from '../validators';
import catchAsyncError from '../middleware/catchAsyncError';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cross-origin in production
  maxAge: 24 * 60 * 60 * 1000, // 1 day
} as const;

export const register = catchAsyncError(async (req: Request, res: Response) => {
  const data = validate(registerUserSchema)(req.body);
  const user = await registerUser(data);
  res.status(201).json({ success: true, user: { email: user.email, id: user._id } });
});

export const verify = catchAsyncError(async (req: Request, res: Response) => {
  const { userId, otp } = req.body;
  const token = await verifyOtp(userId, otp);
  res.cookie('token', token, cookieOptions);
  res.status(200).json({ success: true });
});

export const login = catchAsyncError(async (req: Request, res: Response) => {
  const data = validate(loginUserSchema)(req.body);
  const token = await loginUser(data.email, data.password);
  res.cookie('token', token, cookieOptions);
  res.status(200).json({ success: true });
});

export const logout = catchAsyncError(async (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ success: true, message: 'Logged out' });
});

export const getProfile = catchAsyncError(async (req: AuthRequest, res: Response) => {
  res.status(200).json({ success: true, user: req.user });
});