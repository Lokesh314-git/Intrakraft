/**
 * Local Media Storage Service
 * Handles uploading and managing product images using local backend server storage.
 */
import { api } from './api';

export interface ImageUploadResponse {
  imageUrl: string;
  imageId: string;
  format: string;
  bytes?: number;
}

/**
 * Resolves local image URL safely
 */
export const getImageUrl = (urlOrId: string): string => {
  if (!urlOrId) return '';
  return urlOrId;
};

/**
 * Uploads an image file to local backend storage
 */
export const uploadProductImage = async (file: File): Promise<ImageUploadResponse> => {
  try {
    const result = await api.uploadImage(file);
    return {
      imageUrl: result.imageUrl,
      imageId: result.imageId || `img_${Date.now()}`,
      format: result.format || 'jpeg',
      bytes: file.size,
    };
  } catch (error: any) {
    // Client-side DataURL fallback for offline local mode
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve({
          imageUrl: result,
          imageId: `local_img_${Date.now()}`,
          format: file.type.split('/')[1] || 'jpeg',
          bytes: file.size,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  }
};
