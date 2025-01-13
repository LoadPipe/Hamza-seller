import { getSecure } from '@/utils/api-calls.ts';
import { getJwtStoreId } from '@/utils/authentication';

export const fetchProductById = async (productId: string) => {
    const response = await getSecure(`/seller/product/edit-product`, {
        params: { id: productId, store_id: getJwtStoreId },
    });
    return response.data;
};
