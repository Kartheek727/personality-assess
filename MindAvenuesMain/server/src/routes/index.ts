// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import assessmentRoutes from './assessment.routes';
import paymentRoutes from './payment.routes';
import adminRoutes from './admin.routes';
import imageRoutes from './imageRoute';
import passwordRoutes from './passwordRoutes';
import profileRoutes from './profile.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/images', imageRoutes);
router.use('/password', passwordRoutes);
router.use('/profile',profileRoutes)

export default router;