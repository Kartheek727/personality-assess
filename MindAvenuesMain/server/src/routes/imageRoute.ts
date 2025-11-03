import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../types';
import {
  updateProfilePicture,
  removeProfilePicture,
  updatePDFLogo,
  removePDFLogo,
  fetchPDFLogo,
  fetchProfilePicture,
} from '../controllers/imageController';
import { Readable } from 'stream';

const router = express.Router();

// Middleware to parse raw file uploads
router.use(express.raw({ type: 'image/*', limit: '10mb' }), (req, res, next) => {
    if (req.body && Buffer.isBuffer(req.body)) {
      req.file = {
        buffer: req.body,
        mimetype: req.headers['content-type'] || 'image/jpeg',
        originalname: `image_${Date.now()}`,
        fieldname: 'file',
        encoding: '7bit',
        size: req.body.length,
        stream: new Readable(),
        destination: '', // Add appropriate value
        filename: `image_${Date.now()}.jpeg`, // Add appropriate value
        path: '', // Add appropriate value
      };
      req.file.stream.push(req.body);
      req.file.stream.push(null);
    }
    next();
  });

// Profile Picture Routes (Authenticated Users)
router.put('/profile-picture', authenticate, updateProfilePicture);
router.delete('/profile-picture', authenticate, removeProfilePicture);
router.get('/profile-picture', authenticate, fetchProfilePicture); // New route

// PDF Logo Routes (Admin Only for updates, public for retrieval)
router.put('/pdf-logo', authenticate, authorize([UserRole.ADMIN]), updatePDFLogo);
router.delete('/pdf-logo', authenticate, authorize([UserRole.ADMIN]), removePDFLogo);
router.get('/pdf-logo', fetchPDFLogo); // Public route to fetch logo

export default router;