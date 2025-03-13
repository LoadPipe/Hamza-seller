import axios from 'axios';

const BUNNY_STORAGE_ZONE = import.meta.env.VITE_BUNNY_STORAGE_ZONE;
const BUNNY_CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL;
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY;
const BUNNY_STORAGE_REGION = import.meta.env.VITE_BUNNY_STORAGE_REGION;
const BUNNNY_SUBFOLDER = import.meta.env.VITE_BUNNY_SUBFOLDER;

/**
 * Uploads a single variant image to the CDN.
 * This function is similar to your uploadGalleryImages but is for a single file.
 *
 * @param file - The file to upload.
 * @param storeHandle - The store handle/slug.
 * @param productId - The product ID.
 * @param variantIndex - The index of the variant (used for naming).
 * @returns The URL of the uploaded image.
 */
export async function uploadVariantImageToCDN(
    file: File,
    storeHandle: string,
    productId: string,
    variantIndex: number
): Promise<string> {
    // Extract file extension; if not available, default to "png"
    const fileExtension = file.name.split('.').pop() || 'png';
    // Generate a filename using the variant index (e.g., variant_1.png)
    const fileName = `variant_${variantIndex + 1}.${fileExtension}`;
    // Construct the upload path – you might want to include a folder similar to your gallery path.
    // For example, if your gallery uploads use "storedev", adjust as needed.
    const uploadPath = `${BUNNNY_SUBFOLDER}/${storeHandle}/${productId}/variants/${fileName}`;
    // Construct the full storage upload URL and the CDN URL.
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
        console.error('Variant image upload error:', error);
        throw error;
    }
}
