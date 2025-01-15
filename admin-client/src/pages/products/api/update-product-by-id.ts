import { patchSecure } from '@/utils/api-calls.ts';
import { getJwtStoreId } from '@/utils/authentication';

export const updateProductById = async (id: string, data: any) => {
    const response = await patchSecure(`/seller/product/edit-product`, {
        id: id,
        store_id: getJwtStoreId(),
        ...data,
    });
    if (!response.ok) {
        throw new Error('Failed to update product');
    }
    return await response.json();
};
