import { getSecure } from '@/utils/api-calls.ts';

// `productId` is the ID of the product to fetch
export const validateSku = async (sku: number, variant_id: string) => {
    try {
        const response = await getSecure('/seller/product/validate-sku', {
            sku: sku,
            variant_id: variant_id,
        });
        return response;
    } catch (e) {
        console.error('Failed to check SKU list:', e);
        throw new Error('Failed to check SKU list');
    }
};
