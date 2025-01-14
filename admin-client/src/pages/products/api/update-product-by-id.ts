import { patchSecure } from '@/utils/api-calls.ts';

export const updateProductById = async (id: string, data: ProductForm) => {
    const response = await patchSecure(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update product');
    }
    return await response.json();
};
