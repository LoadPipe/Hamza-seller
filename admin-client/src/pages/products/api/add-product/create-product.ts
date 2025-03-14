import { postSecure } from '@/utils/api-calls.ts';
import { getJwtStoreId } from '@/utils/authentication';

export const createProduct = async (data: any) => {
    const response = await postSecure(`/seller/product/create-product`, {
        store_id: getJwtStoreId(),
        ...data,
    });

    console.log('Create Product Response:', response);

    return response;
};
