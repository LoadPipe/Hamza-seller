import axios from 'axios';

const BUNNY_STORAGE_ZONE = import.meta.env.VITE_BUNNY_STORAGE_ZONE; 
const BUNNY_CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL;
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY;
const BUNNY_STORAGE_REGION = import.meta.env.VITE_BUNNY_STORAGE_REGION; 
const BUNNNY_SUBFOLDER = import.meta.env.VITE_BUNNY_SUBFOLDER;

/**
 * @param file - The image file to upload.
 * @param storeSlug - The store handle/slug.
 * @param productFolder - The folder name for the product (e.g. derived from the product name).
 * @returns The CDN URL of the uploaded thumbnail.
 */
export const uploadProductThumbnailAdd = async (
    file: File,
    storeSlug: string,
    productFolder: string
) => {
    const fileExtension = file.name.split('.').pop(); 
    const fileName = `thumbnail.${fileExtension}`;
    const uploadPath = `${BUNNNY_SUBFOLDER}/${storeSlug}/${productFolder}/${fileName}`;
    
    // Bunny Storage Upload URL (private API)
    const storageUploadUrl = `https://${BUNNY_STORAGE_REGION}/${BUNNY_STORAGE_ZONE}/${uploadPath}`;
    // Bunny CDN Public URL (where users fetch images)
    const cdnUrl = `${BUNNY_CDN_URL}/${uploadPath}`;

    try {
        const response = await axios.put(storageUploadUrl, file, {
            headers: {
                AccessKey: BUNNY_API_KEY,
                'Content-Type': 'application/octet-stream',
            },
        });

        if (response.status === 201) {
            return cdnUrl;
        } else {
            throw new Error('Failed to upload image to Bunny.net');
        }
    } catch (error) {
        console.error('Bunny.net Upload Error:', error);
        throw error;
    }
};
