//src/routes/passwordRoutes.ts
import { Router } from 'express';
import {
  resendOtpController,
  forgotPasswordController,
  changePasswordWithOtpController,
  changePasswordController,
} from '../controllers/passwordController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/resend-otp', resendOtpController);
router.post('/forgot-password', forgotPasswordController);
router.post('/change-password-otp', changePasswordWithOtpController);
router.post('/change-password', authenticate, changePasswordController);

export default router;