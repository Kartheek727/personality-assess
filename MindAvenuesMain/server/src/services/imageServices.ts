import { Readable } from 'stream';
import cloudinary from '../config/cloudinaryConfig';
import { User, PDFLogo } from '../models';
import { BadRequestError, NotFoundError } from '../middleware/error';

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer, folder: string, publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // End of stream
    readableStream.pipe(stream);
  });
};

// Upload profile picture for authenticated users
export const uploadProfilePicture = async (userId: string, file: Express.Multer.File) => {
  try {
    const result = await uploadToCloudinary(
      file.buffer,
      'profile_pictures',
      `user_${userId}_${Date.now()}`
    );

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { new: true }
    );

    if (!user) throw new NotFoundError('User not found');
    return result.secure_url;
  } catch (error) {
    throw new BadRequestError(`Failed to upload profile picture: ${(error as Error).message}`);
  }
};

// Delete profile picture
export const deleteProfilePicture = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !user.profilePicture) throw new NotFoundError('Profile picture not found');

  const publicId = user.profilePicture.split('/').pop()?.split('.')[0];
  await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
  user.profilePicture = undefined;
  await user.save();
  return { message: 'Profile picture deleted successfully' };
};

// Upload or update PDF logo (admin only)
export const upsertPDFLogo = async (file: Express.Multer.File, title: string, subtitle: string, tagline: string) => {
  try {
    const result = await uploadToCloudinary(
      file.buffer,
      'pdf_logos',
      `pdf_logo_${Date.now()}`
    );

    const existingLogo = await PDFLogo.findOne();
    if (existingLogo) {
      const oldPublicId = existingLogo.url.split('/').pop()?.split('.')[0];
      await cloudinary.uploader.destroy(`pdf_logos/${oldPublicId}`);
      existingLogo.url = result.secure_url;
      existingLogo.title = title;
      existingLogo.subtitle = subtitle;
      existingLogo.tagline = tagline;
      await existingLogo.save();
      return existingLogo;
    } else {
      const newLogo = new PDFLogo({
        url: result.secure_url,
        title,
        subtitle,
        tagline,
      });
      await newLogo.save();
      return newLogo;
    }
  } catch (error) {
    throw new BadRequestError(`Failed to upload PDF logo: ${(error as Error).message}`);
  }
};

// Delete PDF logo (admin only)
export const deletePDFLogo = async () => {
  const logo = await PDFLogo.findOne();
  if (!logo) throw new NotFoundError('PDF logo not found');

  const publicId = logo.url.split('/').pop()?.split('.')[0];
  await cloudinary.uploader.destroy(`pdf_logos/${publicId}`);
  await logo.deleteOne();
  return { message: 'PDF logo deleted successfully' };
};

// Get PDF logo
export const getPDFLogo = async () => {
  const logo = await PDFLogo.findOne();
  if (!logo) throw new NotFoundError('PDF logo not found');
  return logo;
};

// Get profile picture
export const getProfilePicture = async (userId: string) => {
  const user = await User.findById(userId).select('profilePicture');
  if (!user) throw new NotFoundError('User not found');
  if (!user.profilePicture) throw new NotFoundError('Profile picture not found');
  return { url: user.profilePicture };
};