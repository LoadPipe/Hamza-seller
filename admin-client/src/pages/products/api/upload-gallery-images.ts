import axios from 'axios';
import { delSecure } from '@/utils/api-calls';
const BUNNY_STORAGE_ZONE = 'hamza-market';
const BUNNY_CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL;
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY;
const BUNNY_STORAGE_REGION = 'storage.bunnycdn.com';

export const uploadGalleryImages = async (
    files: File[],
    storeSlug: string,
    productId: string,
    options?: { replacementFileName?: string }
) => {
    const uploadUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.split('.').pop();

        // For the first file, if a replacement file name is provided, use it.
        const fileName =
            i === 0 && options?.replacementFileName
                ? options.replacementFileName
                : `gallery_${i + 1}.${fileExtension}`;

        const uploadPath = `storedev/${storeSlug}/${productId}/${fileName}`;
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

    return uploadUrls; // Return the array of uploaded image URLs
};

// 1. Move gallery to storedev/ (done)
// 2. Log everything (done)
// 3. Debug the deleting all (done)
// 4. Prevent more than 5 images from being uploaded (done)
// 4. Figure out why thumbnail is also being passed to gallery (WIP)
export const deleteImageFromCDN = async (imageUrl: string) => {
    if (!imageUrl) {
        console.warn('deleteImageFromCDN called with an empty URL');
        return;
    }

    const imagePath = imageUrl.replace(`${BUNNY_CDN_URL}/`, ''); // Ensure no leading `/`
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
        if (error.response?.status === 404) {
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
