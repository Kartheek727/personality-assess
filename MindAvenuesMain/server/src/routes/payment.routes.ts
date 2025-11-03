// src/routes/payment.routes.ts
import { Router } from 'express';
import { createOrder, verify, getRazorpayKey, getPayments } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/key', authenticate, getRazorpayKey);
router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verify);
router.get('/payments', authenticate, getPayments); // New route

export default router;