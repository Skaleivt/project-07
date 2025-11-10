// src/utils/uploadToCloudinary.js
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

let cloudinary;

/**
 * Lazily initialize cloudinary if env vars are present.
 */
async function ensureCloudinary() {
  if (cloudinary) return;

  if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
    // dynamic import to avoid hard dependency when Cloudinary is not configured
    const mod = await import('cloudinary');
    cloudinary = mod.v2;
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
  }
}

/**
 * Upload file at `filePath` to Cloudinary if configured.
 * If Cloudinary is not configured, returns an object with secure_url = filePath.
 * @param {string} filePath
 * @returns {Promise<{secure_url?: string, url?: string, public_id?: string}>}
 */
export async function uploadToCloudinary(filePath) {
  await ensureCloudinary();

  if (cloudinary) {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: process.env.CLOUDINARY_FOLDER || 'avatars',
    });

    // optional: remove local file after upload
    try {
      await unlinkAsync(filePath);
    } catch (unlinkErr) {
      // Log removal error but don't fail the whole upload flow
      console.warn('Failed to remove local file after upload:', unlinkErr);
    }

    return result;
  }

  // Fallback: no cloudinary configured — return local path as "secure_url"
  // This allows local testing without cloudinary.
  return { secure_url: filePath, url: filePath };
}

export default uploadToCloudinary;
