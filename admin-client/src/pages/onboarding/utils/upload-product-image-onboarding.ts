import axios from 'axios';

const BUNNY_STORAGE_ZONE = import.meta.env.VITE_BUNNY_STORAGE_ZONE;
const BUNNY_CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL;
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY;
const BUNNY_STORAGE_REGION = import.meta.env.VITE_BUNNY_STORAGE_REGION;

/**
 * Upload multiple product images during the onboarding process.
 *
 * @param files - Array of files to upload.
 * @param walletId - The wallet id to use in the path.
 * @param options - Optional: a replacement file name for the first file.
 * @returns Promise resolving to an array of CDN URLs.
 */
export const uploadProductImages = async (
    files: File[],
    walletId: string,
    options?: { replacementFileName?: string }
): Promise<string[]> => {
    const uploadUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.split('.').pop();
        const fileName =
            i === 0 && options?.replacementFileName
                ? options.replacementFileName
                : `image_${i + 1}.${fileExtension}`;

        const uploadPath = `onboarding-wallet/${walletId}/${fileName}`;
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
                throw new Error('Failed to upload product image');
            }
        } catch (error) {
            console.error('Bunny Upload Error:', error);
            throw error;
        }
    }

    return uploadUrls;
};
