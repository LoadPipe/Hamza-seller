import axios from 'axios';

const BUNNY_STORAGE_ZONE = import.meta.env.VITE_BUNNY_STORAGE_ZONE;
const BUNNY_CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL;
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY;
const BUNNY_STORAGE_REGION = import.meta.env.VITE_BUNNY_STORAGE_REGION;
const BUNNY_SUBFOLDER = import.meta.env.VITE_BUNNY_SUBFOLDER;

/**
 * @param file - The file to upload.
 * @param storeHandle - The store handle/slug.
 * @param variantIndex - The index of the variant (used for naming).
 * @param productFolder - The folder name derived from the product name.
 * @returns The URL of the uploaded image.
 */
export async function uploadAddProductVariantImageToCDN(
    file: File,
    storeHandle: string,
    variantIndex: number,
    productFolder: string
): Promise<string> {
    const fileExtension = file.name.split('.').pop() || 'png';
    const fileName = `variant_${variantIndex + 1}.${fileExtension}`;
    const uploadPath = `${BUNNY_SUBFOLDER}/${storeHandle}/${productFolder}/variants/${fileName}`;
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
            return cdnUrl;
        } else {
            throw new Error('Failed to upload variant image');
        }
    } catch (error) {
        console.error('Add product variant image upload error:', error);
        throw error;
    }
}
