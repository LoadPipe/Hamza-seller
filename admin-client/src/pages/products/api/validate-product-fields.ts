import { getSecure } from '@/utils/api-calls.ts';
import { getJwtStoreId } from '@/utils/authentication';


// `productId` is the ID of the product to fetch
export const validateSku = async (sku: string, variant_id: string) => {
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

export const validateBarcode = async (barcode: string, variant_id: string) => {
    try {
        const response = await getSecure('/seller/product/validate-barcode', {
            barcode: barcode,
            variant_id: variant_id,
        });
        return response;
    } catch (e) {
        console.error('Failed to check Barcode list:', e);
        throw new Error('Failed to check Barcode list');
    }
};

export const validateEan = async (ean: string, variant_id: string) => {
    try {
        const response = await getSecure('/seller/product/validate-ean', {
            ean: ean,
            variant_id: variant_id,
            store_id: getJwtStoreId(),
        });
        return response;
    } catch (e) {
        console.error('Failed to check EAN list:', e);
        throw new Error('Failed to check EAN list');
    }
};


export const validateUpc = async (upc: string, variant_id: string) => {
    try {
        const response = await getSecure('/seller/product/validate-upc', {
            upc: upc,
            variant_id: variant_id,
            store_id: getJwtStoreId(),
        });
        return response;
    } catch (e) {
        console.error('Failed to check UPC list:', e);
        throw new Error('Failed to check UPC list');
    }
};