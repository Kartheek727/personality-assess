import { Request, Response } from 'express';
import { uploadProfilePicture, deleteProfilePicture, upsertPDFLogo, deletePDFLogo, getPDFLogo, getProfilePicture } from '../services/imageServices';
import { AuthRequest } from '../middleware/auth.middleware';
import catchAsyncError from '../middleware/catchAsyncError';

// Custom interface to handle raw file uploads without Multer
interface CustomFile extends Express.Multer.File {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
}
  
  interface ImageRequest extends AuthRequest {
    file?: CustomFile; // Adjusted to match express.raw() middleware
  }

  export const updateProfilePicture = catchAsyncError(async (req: ImageRequest, res: Response) => {
    console.log('Request body:', req.body); // Debug log
    console.log('Request file:', req.file); // Debug log
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    const url = await uploadProfilePicture(req.user._id, req.file as any);
    res.status(200).json({ message: 'Profile picture updated successfully', url });
  });

export const removeProfilePicture = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const result = await deleteProfilePicture(req.user._id);
  res.status(200).json(result);
});

export const updatePDFLogo = catchAsyncError(async (req: ImageRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const { title: bodyTitle, subtitle: bodySubtitle, tagline: bodyTagline } = req.body;
  const { title: queryTitle, subtitle: querySubtitle, tagline: queryTagline } = req.query;

  const title = bodyTitle || queryTitle;
  const subtitle = bodySubtitle || querySubtitle;
  const tagline = bodyTagline || queryTagline;

  if (!title || !subtitle || !tagline) {
    return res.status(400).json({ message: 'Title, subtitle, and tagline are required' });
  }

  const logo = await upsertPDFLogo(req.file as any, title as string, subtitle as string, tagline as string);
  res.status(200).json({ message: 'PDF logo updated successfully', logo });
});

export const removePDFLogo = catchAsyncError(async (_req: AuthRequest, res: Response) => {
  const result = await deletePDFLogo();
  res.status(200).json(result);
});

export const fetchPDFLogo = catchAsyncError(async (_req: Request, res: Response) => {
  const logo = await getPDFLogo();
  res.status(200).json(logo);
});

export const fetchProfilePicture = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const picture = await getProfilePicture(req.user._id);
  res.status(200).json(picture);
});