// src/routes/assessment.routes.ts
import { Router } from 'express';
import { create, update, remove, take, getAll, getById, getAssessmentResponse, getByIdUser } from '../controllers/assessment.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { checkPaymentStatus } from '../middleware/payment.middleware';
import { UserRole } from '../types';

const router = Router();

router.post('/create', authenticate, authorize([UserRole.ADMIN]), create);
router.put('/:id', authenticate, authorize([UserRole.ADMIN]), update);
router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), remove);
router.post('/take', authenticate, checkPaymentStatus, take);
router.get('/', authenticate, getAll);
router.get('/:id', authenticate, authorize([UserRole.ADMIN]), getById);
router.get('/user/:id', authenticate, checkPaymentStatus, getByIdUser);
router.get('/:id/response', authenticate, getAssessmentResponse);

export default router;