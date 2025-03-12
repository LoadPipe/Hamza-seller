import { getJwtStoreId } from '@/utils/authentication';
import { postSecure } from '@/utils/api-calls';

export const importProductsByCsv = async (
    file: File
): Promise<{
    success: boolean;
    message: string;
    errors: string[];
}> => {
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
        return {
            success: response.success,
            message:
                response.errors?.length > 0
                    ? 'Products imported successfully. But with some errors: <br />' +
                      '<ul style="list-style: number; padding: 20px;">' +
                      response.errors
                          .map(
                              (error: string) =>
                                  `<li style="margin-bottom: 10px;">${error}</li>`
                          )
                          .join('') +
                      '</ul>'
                    : 'Products imported successfully.',
            errors: response.errors,
        };
    } catch (e: any) {
        const responseData = e?.response?.data;

        let errorMessage =
            JSON.stringify(responseData?.message) ||
            responseData?.updateMessage;

        if (e?.response?.data?.errors?.length > 0) {
            errorMessage +=
                '<ul style="list-style: number; padding: 20px;">' +
                responseData?.errors
                    .map(
                        (error: string) =>
                            `<li style="margin-bottom: 10px;">${error}</li>`
                    )
                    .join('') +
                '</ul>';
        }

        console.error('Error importing products by CSV:', errorMessage);
        // Throw the error message
        throw new Error(errorMessage);
    }
};
