import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import React from 'react';
import { getJwtStoreId } from '@/utils/authentication';
import { getSecure } from '@/utils/api-calls';
import { ProductSchema } from '@/pages/products/product-schema.ts';
import { ProductTable } from '@/pages/products/product-table.tsx';
import { productColumns } from '@/pages/products/product-columns.tsx';
import { SortingState } from '@tanstack/react-table';

type Product = z.infer<typeof ProductSchema>;

async function getSellerProducts(
    pageIndex = 0,
    pageSize = 10,
    filters: Record<string, any>,
    sorting: SortingState = []
): Promise<{ products: Product[]; totalRecords: number }> {
    try {
        // Construct sorting parameters
        const sort = sorting[0]
            ? `${sorting[0].id}:${sorting[0].desc ? 'DESC' : 'ASC'}`
            : 'created_at:ASC';

        // Prepare query parameters
        const params = {
            store_id: getJwtStoreId(),
            page: pageIndex,
            products_per_page: pageSize,
            sort,
            filter: filters, // Pass filters directly
        };

        // Use getSecure with parameters
        const response = await getSecure(
            '/seller/product/seller-products',
            params
        );

        // Parse and return the response
        return {
            products: ProductSchema.array().parse(response.products),
            totalRecords: response.totalRecords ?? 0,
        };
    } catch (error) {
        console.error('Failed to fetch seller products:', error);
        throw new Error('Failed to fetch seller products');
    }
}

export default function ProductsPage() {
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const { data, isLoading, error } = useQuery<
        { products: Product[]; totalRecords: number },
        Error
    >({
        queryKey: ['products', pageIndex, pageSize],
        queryFn: () => getSellerProducts(),
    });

    if (error instanceof Error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <ProductTable
                columns={productColumns}
                data={data?.products ?? []}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                totalRecords={data?.totalRecords ?? 0}
                sorting={sorting}
                setSorting={setSorting}
                isLoading={isLoading}
            />
        </>
    );
}
