//src/controllers/passwordController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { resendOtp, forgotPassword, changePasswordWithOtp, changePassword } from '../services/passwordServices';
import catchAsyncError from '../middleware/catchAsyncError';
import { validate, changePasswordSchema } from '../validators';

export const resendOtpController = catchAsyncError(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  await resendOtp(email);
  res.status(200).json({ success: true, message: 'OTP resent successfully' });
});

export const forgotPasswordController = catchAsyncError(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  await forgotPassword(email);
  res.status(200).json({ success: true, message: 'Password reset OTP sent' });
});

export const changePasswordWithOtpController = catchAsyncError(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }

  await changePasswordWithOtp(email, otp, newPassword);
  res.status(200).json({ success: true, message: 'Password changed successfully' });
});

export const changePasswordController = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const data = validate(changePasswordSchema)(req.body);
  await changePassword(req.user._id, data.oldPassword, data.newPassword);
  res.status(200).json({ success: true, message: 'Password updated successfully' });
});