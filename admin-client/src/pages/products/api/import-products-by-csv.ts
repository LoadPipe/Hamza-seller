import { getJwtStoreId } from '@/utils/authentication';
import { postSecure } from '@/utils/api-calls.ts';
// import { useQueryClient } from '@tanstack/react-query';

export const importProductsByCsv = async (file: File) => {
    // const queryClient = useQueryClient();
    try {
        const store_id = getJwtStoreId() as string;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('store_id', store_id);
        const response = await postSecure('seller/product/csv', {
            store_id: store_id,
            file,
        });
        return response;
    } catch (e) {
        console.error(e);
        throw new Error('Failed to import products by CSV.');
    }
    // finally {
    //     queryClient.invalidateQueries('products');
    // }
};
