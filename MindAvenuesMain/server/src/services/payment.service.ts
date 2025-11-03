// src/services/payment.service.ts
import Razorpay from 'razorpay';
import { Payment, User } from '../models';
import { IPayment, PaymentStatus } from '../types';
import { BadRequestError } from '../middleware/error';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_SECRET_KEY || '',
});

export const createPaymentOrder = async (userId: string): Promise<any> => {
  const user = await User.findById(userId);
  if (!user) throw new BadRequestError('User not found');

  const userIdString = userId.toString();
  const receipt = `r_${userIdString.slice(0, 10)}_${Date.now().toString().slice(-8)}`;
  const options = {
    amount: 100, // ₹99 in paise
    currency: 'INR',
    receipt,
  };

  const order = await razorpay.orders.create(options);
  return order;
};

export const verifyPayment = async (
  userId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<IPayment> => {
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY || '')
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new BadRequestError('Payment signature verification failed');
  }

  const existingPayment = await Payment.findOne({ user: userId });
  if (existingPayment) {
    throw new BadRequestError('Payment already processed');
  }

  const payment = await Payment.create({
    user: userId,
    amount: 1, // ₹99
    status: PaymentStatus.COMPLETED,
    transactionId: razorpayPaymentId,
  });

  await User.findByIdAndUpdate(userId, { paymentStatus: PaymentStatus.COMPLETED });
  return payment;
};

// New method to fetch payments for a user
export const getUserPayments = async (userId: string): Promise<IPayment[]> => {
  const payments = await Payment.find({ user: userId }).sort({ createdAt: -1 }); // Sort by latest first
  return payments;
};