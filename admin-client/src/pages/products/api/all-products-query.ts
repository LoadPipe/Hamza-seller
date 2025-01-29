import { SortingState } from '@tanstack/react-table';
import { getJwtStoreId } from '@/utils/authentication';
import { postSecure } from '@/utils/api-calls.ts';
import { ProductSchema } from '@/pages/products/product-schema.ts';
import { z } from 'zod';
type Product = z.infer<typeof ProductSchema>;

export async function sellerAllProductsQuery(
    pageIndex = 0,
    pageSize = 10,
    filters: Record<string, any>,
    sorting: SortingState = []
): Promise<{
    products: Product[];
    totalRecords: number;
    filteredProductsCount: number;
    categoryMap: Map<string, string>;
}> {
    try {
        // Construct sorting parameters
        const sort = sorting[0]
            ? `${sorting[0].id}:${sorting[0].desc ? 'DESC' : 'ASC'}`
            : 'created_at:ASC';

        // Prepare query parameters
        const params = {
            store_id: getJwtStoreId(),
            page: pageIndex,
            count: pageSize,
            sort: sort,
            filter: filters,
        };

        // Use getSecure with parameters
        const response = await postSecure(
            '/seller/product/seller-products',
            params
        );

        const categoryMap = response.availableCategories.reduce(
            (map: Record<string, string>, cat: any) => {
                map[cat.id] = cat.name;
                return map;
            },
            {}
        );

        const data: object = response.products as object;

        return {
            products: ProductSchema.array().parse(data),
            totalRecords: response.totalRecords ?? 0,
            filteredProductsCount: response.filteredProductsCount,
            categoryMap,
        };
    } catch (error) {
        console.error('Failed to fetch seller products:', error);
        throw new Error('Failed to fetch seller products');
    }
}
