import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure env variables are loaded (important for standalone script execution or module loading)
dotenv.config();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dj8s3ripy',
  api_key: process.env.CLOUDINARY_API_KEY || '911475344471319',
  api_secret: process.env.CLOUDINARY_API_SECRET || '91RYOt65sZS0OqokbiyZbLkh7cw',
  secure: true
});

export class CloudinaryService {
  /**
   * Upload a local file to Cloudinary and return its secure URL
   * @param localFilePath Absolute path of the local file
   * @returns The secure URL of the uploaded file on Cloudinary
   */
  async uploadFile(localFilePath: string): Promise<string> {
    try {
      const uploadResult = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'auto', // Detects images, PDFs, etc.
        folder: 'opd_claims'   // Store in a dedicated folder
      });
      return uploadResult.secure_url;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw new Error('Failed to upload document to Cloudinary');
    }
  }
}

export default new CloudinaryService();
