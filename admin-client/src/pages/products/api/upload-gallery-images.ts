import axios, { AxiosError } from 'axios';
import { delSecure } from '@/utils/api-calls';
const BUNNY_STORAGE_ZONE = import.meta.env.VITE_BUNNY_STORAGE_ZONE; 
const BUNNY_CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL;
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY;
const BUNNY_STORAGE_REGION = import.meta.env.VITE_BUNNY_STORAGE_REGION;
const BUNNNY_SUBFOLDER = import.meta.env.VITE_BUNNY_SUBFOLDER;

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

        const uploadPath = `${BUNNNY_SUBFOLDER}/${storeSlug}/${productId}/${fileName}`;
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
// 5. Figure out why thumbnail is also being passed to gallery (done)
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

// Uploads the variant image to the CDN (Bunny or your CDN)
export async function uploadVariantImageToCDN(
    file: File,
    storeHandle: string,
    productId: string,
    variantIndex: number
): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    // Generate a filename using the variant index (e.g., variant_1.png)
    const fileName = `variant_${variantIndex + 1}.png`;
    formData.append('fileName', fileName);

    // Construct the CDN upload URL (modify as needed)
    const uploadUrl = `https://storage.bunnycdn.com/${storeHandle}/${productId}/variants`;

    const response = await axios.post(uploadUrl, formData, {
        headers: {
            AccessKey: process.env.BUNNY_API_KEY, // or import your API key from your config
            'Content-Type': 'multipart/form-data',
        },
    });

    // Assume the response returns the URL of the uploaded image
    return response.data.url;
}
