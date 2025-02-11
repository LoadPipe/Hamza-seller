import axios from 'axios';

const BUNNY_STORAGE_ZONE = 'hamza-market'; // Storage Zone Name
const BUNNY_CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL; // Your CDN Public URL
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY;
const BUNNY_STORAGE_REGION = 'storage.bunnycdn.com'; // Default Falkenstein Region

export const uploadProductThumbnail = async (
    file: File,
    storeSlug: string,
    productId: string
) => {
    const fileExtension = file.name.split('.').pop(); // Extract file extension
    const fileName = `thumbnail.${fileExtension}`; // Always overwrite old thumbnail
    const uploadPath = `${storeSlug}/${productId}/${fileName}`; // Organized per product

    // Bunny Storage Upload URL (private API)
    const storageUploadUrl = `https://${BUNNY_STORAGE_REGION}/${BUNNY_STORAGE_ZONE}/${uploadPath}`;
    // Bunny CDN Public URL (where users fetch images)
    const cdnUrl = `${BUNNY_CDN_URL}/${uploadPath}`;

    try {
        const response = await axios.put(storageUploadUrl, file, {
            headers: {
                AccessKey: BUNNY_API_KEY, // Required for authentication
                'Content-Type': 'application/octet-stream', // Ensure raw binary data
            },
        });

        if (response.status === 201) {
            return cdnUrl; // Return public URL for frontend use
        } else {
            throw new Error('Failed to upload image to Bunny.net');
        }
    } catch (error) {
        console.error('Bunny.net Upload Error:', error);
        throw error;
    }
};
