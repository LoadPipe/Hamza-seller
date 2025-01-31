import { getSecure } from '@/utils/api-calls.ts';

// `productId` is the ID of the product to fetch
export const fetchAllCategories = async () => {
    try {
        const response = await getSecure('/seller/product/categories', {});

        return response;
    } catch (e) {
        console.error('Failed to fetch categories', e);
        throw new Error('Failed to fetch categories');
    }
};
