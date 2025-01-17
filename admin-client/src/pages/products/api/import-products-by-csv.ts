import { getJwtStoreId } from '@/utils/authentication';
import { postSecure } from '@/utils/api-calls';

export const importProductsByCsv = async (file: File) => {
    try {
        const store_id = getJwtStoreId() as string;

        // Create a FormData instance and append fields
        const formData = new FormData();
        formData.append('file', file); // Append file
        formData.append('store_id', store_id); // Append store ID

        console.log(`$$$ FORMDATA CONTENTS:`);
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        // Pass FormData directly to the postSecure function
        const response = await postSecure('seller/product/csv', formData);
        return response.success;
    } catch (e: any) {
        const errorMessage =
            e?.response?.data?.message || 'Failed to import products by CSV.';
        console.error('Error importing products by CSV:', errorMessage);
        // Throw the error message
        throw new Error(errorMessage);
    }
};
