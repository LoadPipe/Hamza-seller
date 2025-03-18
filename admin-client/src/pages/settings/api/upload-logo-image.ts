import axios from 'axios';

const BUNNY_STORAGE_ZONE = import.meta.env.VITE_BUNNY_STORAGE_ZONE;
const BUNNY_CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL;
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY;
const BUNNY_STORAGE_REGION = import.meta.env.VITE_BUNNY_STORAGE_REGION;
const BUNNNY_SUBFOLDER = import.meta.env.VITE_BUNNY_SUBFOLDER;

/**
 * Uploads a logo image to Bunny.net storage.
 *
 * @param file - The image file to upload.
 * @param storeSlug - The store handle/slug.
 * @returns The CDN URL of the uploaded logo.
 */
export const uploadLogoImage = async (file: File, storeSlug: string) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExtension}`;
    const uploadPath = `${BUNNNY_SUBFOLDER}/${storeSlug}/logo/${fileName}`;

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
            console.log('Logo uploaded successfully:', cdnUrl);
            return cdnUrl;
        } else {
            throw new Error('Failed to upload logo to Bunny.net');
        }
    } catch (error) {
        console.error('Bunny.net Upload Error:', error);
        throw error;
    }
};
