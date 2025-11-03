//src/services/auth.service.ts
import { User } from '../models';
import { IUser, PaymentStatus } from '../types';
import { BadRequestError } from '../middleware/error';
import { CacheService } from './cache.service';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from './email.service';

export const registerUser = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
}): Promise<IUser> => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new BadRequestError('Email already exists');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await User.create({ ...data, verificationToken: otp });
  await CacheService.set(`otp:${user._id}`, otp, 300);
  await sendVerificationEmail(user.email, otp);
  return user;
};

export const verifyOtp = async (userId: string, otp: string): Promise<string> => {
  const cachedOtp = await CacheService.get<string>(`otp:${userId}`);
  if (!cachedOtp || cachedOtp !== otp) throw new BadRequestError('Invalid or expired OTP');

  const user = await User.findById(userId);
  if (!user) throw new BadRequestError('User not found');

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  await CacheService.del(`otp:${userId}`);

  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
};

export const loginUser = async (email: string, password: string): Promise<string> => {
  const user = await User.findOne({ email }).select('+password') as IUser & { comparePassword: (pass: string) => Promise<boolean> };
  if (!user || !(await user.comparePassword(password))) throw new BadRequestError('Invalid credentials');
  if (!user.isVerified) throw new BadRequestError('Please verify your account');

  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
};

export const updatePaymentStatus = async (userId: string, status: PaymentStatus): Promise<void> => {
  await User.findByIdAndUpdate(userId, { paymentStatus: status });
};