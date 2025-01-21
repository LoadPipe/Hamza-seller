import { patchSecure } from '@/utils/api-calls.ts';
import { getJwtStoreId } from '@/utils/authentication';

export const updateProductById = async (id: string, data: any) => {
    const response = await patchSecure(`/seller/product/edit-product`, {
        id: id,
        store_id: getJwtStoreId(),
        ...data,
    });

    // Log the response for debugging purposes
    console.log('Update Product Response:', response);

    return response; // Response is already parsed JSON in your setup
};
