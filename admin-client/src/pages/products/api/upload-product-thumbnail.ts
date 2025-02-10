import axios from 'axios';

const BUNNY_STORAGE_URL = import.meta.env.VITE_BUNNY_STORAGE_URL;
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY;

export const uploadProductThumbnail = async (file: File, storeSlug: string) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const fileName = `${Date.now()}-${file.name}`; // Avoid conflicts
        const uploadPath = `/stores/${storeSlug}/${fileName}`;

        const response = await axios.put(
            `${BUNNY_STORAGE_URL}${uploadPath}`,
            file,
            {
                headers: {
                    AccessKey: BUNNY_API_KEY,
                    'Content-Type': file.type, // Set correct file type
                },
            }
        );

        if (response.status === 201) {
            return `https://${BUNNY_STORAGE_URL}.b-cdn.net/stores/${storeSlug}/${fileName}`;
        } else {
            throw new Error('Failed to upload image to Bunny.net');
        }
    } catch (error) {
        console.error('Bunny.net Upload Error:', error);
        throw error;
    }
};
