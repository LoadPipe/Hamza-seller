import axios, { AxiosError } from 'axios';
import { delSecure } from '@/utils/api-calls';

const BUNNY_STORAGE_ZONE = import.meta.env.VITE_BUNNY_STORAGE_ZONE;
const BUNNY_CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL;
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY;
const BUNNY_STORAGE_REGION = import.meta.env.VITE_BUNNY_STORAGE_REGION;
const BUNNNY_SUBFOLDER = import.meta.env.VITE_BUNNY_SUBFOLDER;

/**
 * @param files - Array of image files to upload.
 * @param storeSlug - The store handle/slug.
 * @param productFolder - The folder name for the product (e.g. derived from the product name).
 * @param options - Optional settings (such as replacement file name).
 * @returns An array of uploaded image URLs.
 */
export const uploadGalleryImagesAdd = async (
    files: File[],
    storeSlug: string,
    productFolder: string,
    options?: { replacementFileName?: string }
): Promise<string[]> => {
    const uploadUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.split('.').pop();
        const fileName =
            i === 0 && options?.replacementFileName
                ? options.replacementFileName
                : `gallery_${i + 1}.${fileExtension}`;

        const uploadPath = `${BUNNNY_SUBFOLDER}/${storeSlug}/${productFolder}/${fileName}`;
        const storageUploadUrl = `https://${BUNNY_STORAGE_REGION}/${BUNNY_STORAGE_ZONE}/${uploadPath}`;
        const cdnUrl = `${BUNNY_CDN_URL}/${uploadPath}`;

        try {
            const response = await axios.put(storageUploadUrl, file, {
                headers: {
                    AccessKey: BUNNY_API_KEY,
                    'Content-Type': 'application/octet-stream',
                },
            });

            if (response.status === 201) {
                uploadUrls.push(cdnUrl);
            } else {
                throw new Error('Failed to upload an image');
            }
        } catch (error) {
            console.error('Bunny Upload Error:', error);
        }
    }

    return uploadUrls;
};

export const deleteImageFromCDN = async (imageUrl: string) => {
    if (!imageUrl) {
        console.warn('deleteImageFromCDN called with an empty URL');
        return;
    }

    const imagePath = imageUrl.replace(`${BUNNY_CDN_URL}/`, '');
    const storageDeleteUrl = `https://${BUNNY_STORAGE_REGION}/${BUNNY_STORAGE_ZONE}/${imagePath}`;

    console.log('Deleting image from CDN:', {
        imageUrl,
        imagePath,
        storageDeleteUrl,
    });

    try {
        await axios.delete(storageDeleteUrl, {
            headers: { AccessKey: BUNNY_API_KEY },
        });
        return true;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
            console.warn('CDN image not found, skipping deletion:', imageUrl);
            return false;
        }
        console.error('Failed to delete image:', error);
        throw error;
    }
};

export const deleteImageFromdB = async (imageId: string) => {
    try {
        await delSecure(`/seller/product/edit-product/delete-image`, {
            image_id: imageId,
        });
        return true;
    } catch (error) {
        console.error('Failed to delete image:', error);
        throw error;
    }
};
