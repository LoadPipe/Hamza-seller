'use client';

import { getSecure } from '@/utils/api-calls';
import { getJwtStoreId } from '@/utils/authentication';
export const downloadProductsCSV = async (productId?: string) => {
    try {
        alert(productId);
        const storeId = getJwtStoreId();
        const response = await getSecure('/seller/product/csv/export', {
            store_id: storeId,
            ...(productId && { product_id: productId }),
        });

        const downloadFile = (data: any, filename: string) => {
            const blob = new Blob([data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        };

        const filename = `products-${new Date().toISOString()}.csv`;
        downloadFile(response, filename);
    } catch (error) {
        console.error('Failed to download CSV:', error);
    }
};
