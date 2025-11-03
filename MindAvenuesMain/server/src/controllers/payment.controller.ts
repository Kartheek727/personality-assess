// src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { createPaymentOrder, verifyPayment, getUserPayments } from '../services/payment.service';
import catchAsyncError from '../middleware/catchAsyncError';

export const createOrder = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const order = await createPaymentOrder(req.user!._id);
  res.status(200).json({ success: true, order });
});

export const verify = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const payment = await verifyPayment(req.user!._id, razorpayOrderId, razorpayPaymentId, razorpaySignature);
  res.status(200).json({ success: true, payment });
});

export const getRazorpayKey = catchAsyncError(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, razorpayApiKey: process.env.RAZORPAY_KEY_ID });
});

// New handler to get user payments
export const getPayments = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const payments = await getUserPayments(req.user!._id);
  res.status(200).json({ success: true, payments });
});