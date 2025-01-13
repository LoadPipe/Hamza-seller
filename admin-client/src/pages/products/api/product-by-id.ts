import { getSecure } from '@/utils/api-calls.ts';
import { getJwtStoreId } from '@/utils/authentication';

// `productId` is the ID of the product to fetch
export const fetchProductById = async (productId: string) => {
    try {
        const storeId = getJwtStoreId();

        const response = await getSecure('/seller/product/edit-product', {
            id: productId,
            store_id: storeId,
        });
        return response;
    } catch (e) {
        console.error('Failed to fetch product by id:', e);
        throw new Error('Failed to fetch product by id');
    }
};
