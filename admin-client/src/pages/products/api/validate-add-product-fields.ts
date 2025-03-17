// validate-new-product-fields.ts
import { getSecure } from '@/utils/api-calls.ts';
import { getJwtStoreId } from '@/utils/authentication';

export const validateSkuForNewProduct = async (sku: string) => {
    try {
        const response = await getSecure('/seller/product/validate-sku-new-product', {
            sku,
        });
        return response;
    } catch (e) {
        console.error('Failed to check SKU list:', e);
        throw new Error('Failed to check SKU list');
    }
};

export const validateBarcodeForNewProduct = async (barcode: string) => {
    try {
        const response = await getSecure('/seller/product/validate-barcode-new-product', {
            barcode,
        });
        return response;
    } catch (e) {
        console.error('Failed to check Barcode list:', e);
        throw new Error('Failed to check Barcode list');
    }
};

export const validateEanForNewProduct = async (ean: string) => {
    try {
        const response = await getSecure('/seller/product/validate-ean-new-product', {
            ean,
            store_id: getJwtStoreId(),
        });
        return response;
    } catch (e) {
        console.error('Failed to check EAN list:', e);
        throw new Error('Failed to check EAN list');
    }
};

export const validateUpcForNewProduct = async (upc: string) => {
    try {
        const response = await getSecure('/seller/product/validate-upc-new-product', {
            upc,
            store_id: getJwtStoreId(),
        });
        return response;
    } catch (e) {
        console.error('Failed to check UPC list:', e);
        throw new Error('Failed to check UPC list');
    }
};


export const validateHandleForNewProduct = async (title: string) => {
    try {
        const response = await getSecure('/seller/product/validate-handle-new-product', {
            title,
        });
        return response;
    } catch (e) {
        console.error('Failed to check product handle uniqueness:', e);
        throw new Error('Failed to check product handle uniqueness');
    }
};
