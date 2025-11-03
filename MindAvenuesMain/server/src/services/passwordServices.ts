//src/services/passwordServices.ts
import { User } from '../models';
import { BadRequestError, NotFoundError } from '../middleware/error';
import { CacheService } from './cache.service';
import { sendVerificationEmail } from './email.service';

// Resend OTP for email verification
export const resendOtp = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError('User not found');
  if (user.isVerified) throw new BadRequestError('Account already verified');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationToken = otp;
  await user.save();

  await CacheService.set(`otp:${user._id}`, otp, 300); // 5-minute expiry
  await sendVerificationEmail(user.email, otp);
};

// Forgot Password - Send OTP
export const forgotPassword = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError('User not found');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await CacheService.set(`reset:${user._id}`, otp, 600); // 10-minute expiry
  await sendVerificationEmail(user.email, otp);
};

// Change Password with OTP
export const changePasswordWithOtp = async (email: string, otp: string, newPassword: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError('User not found');

  const cachedOtp = await CacheService.get<string>(`reset:${user._id}`);
  if (!cachedOtp || cachedOtp !== otp) throw new BadRequestError('Invalid or expired OTP');

  user.password = newPassword; // Trigger pre-save hook
  await user.save();

  await CacheService.del(`reset:${user._id}`);
};

// Change Password (Authenticated User)
export const changePassword = async (userId: string, oldPassword: string, newPassword: string): Promise<void> => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new NotFoundError('User not found');

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new BadRequestError('Incorrect old password');

  user.password = newPassword; // Trigger pre-save hook
  await user.save();
};