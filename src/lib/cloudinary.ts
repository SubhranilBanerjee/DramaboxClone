import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'yarrowplay-stream';
const apiKey = process.env.CLOUDINARY_API_KEY || '729329983158373';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '729329983158373';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  duration?: number;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}
