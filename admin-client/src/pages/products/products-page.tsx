import { DataTable } from '@/components/table/data-table.tsx';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import React from 'react';
import { useSearch } from '@tanstack/react-router';
import { getJwtStoreId } from '@/utils/authentication';
import { getSecure } from '@/utils/api-calls';
import { ProductSchema } from '@/pages/products/product-schema.ts';
type Product = z.infer<typeof ProductSchema>;


async function getProducts(
    // pageIndex = 0,
    // pageSize = 10,
    // filters: Record<string, any>
): Promise<{ products: Product[]; totalRecords: number }> {
    try {
        const response = await getSecure('/seller/product', {
            store_id: getJwtStoreId(),
            // page: pageIndex,
            // count: pageSize,
            // filter: filters,
        });

        return {
            products: ProductSchema.array().parse(response.products),
            totalRecords: response.totalRecords,
        };
    } catch (error) {
        console.error('Failed to fetch seller products:', error);
        throw new Error('Failed to fetch seller products');
    }
}

export default function ProductsPage(){
    const { data, isLoading, error } = useQuery( )

}
)