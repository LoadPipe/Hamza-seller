import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import React from 'react';
import { getJwtStoreId } from '@/utils/authentication';
import { postSecure } from '@/utils/api-calls';
import { ProductSchema } from '@/pages/products/product-schema.ts';
import { ProductTable } from '@/pages/products/product-table.tsx';
import { columns } from '@/pages/products/product-columns.tsx';
import { SortingState } from '@tanstack/react-table';
import { ProductSearchSchema } from '@/routes.tsx';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { productStore } from '@/stores/product-filter/product-filter-store.tsx';
import { useStore } from '@tanstack/react-store';

type Product = z.infer<typeof ProductSchema>;

async function sellerAllProductsQuery(
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

export default function ProductsPage() {
    const navigate = useNavigate();
    const search = useSearch({ from: '/products' });

    // Extract pagination, sorting, and filters from URL
    const { page, count, sort, filter } = ProductSearchSchema.parse(search);
    const [sortField, sortDirection] = sort
        ? sort.split(':')
        : ['created_at', 'ASC'];

    // Initialize filters from URL or default
    const { filters } = useStore(productStore);

    // Local state for pagination and sorting
    const [pageIndex, setPageIndex] = React.useState(page ?? 0);
    const [pageSize, setPageSize] = React.useState(count ?? 10);
    const [sorting, setSorting] = React.useState<SortingState>(
        sortField && sortDirection
            ? [{ id: sortField, desc: sortDirection === 'DESC' }]
            : []
    );

    // Update URL when filters, pagination, or sorting change
    React.useEffect(() => {
        navigate({
            to: '/products',
            search: {
                page: pageIndex,
                count: pageSize,
                sort: sorting[0]
                    ? `${sorting[0].id}:${sorting[0].desc ? 'DESC' : 'ASC'}`
                    : 'created_at:ASC',
                filter: JSON.stringify(filters || filter),
            },
            replace: true,
        });
    }, [pageIndex, pageSize, sorting, JSON.stringify(filters), navigate]);

    // Fetch products with the query
    const { data, isLoading, error } = useQuery<
        {
            products: Product[];
            totalRecords: number;
            categoryMap: Map<string, string>;
            filteredProductsCount: number;
        },
        Error
    >({
        queryKey: ['products', pageIndex, pageSize, filters, sorting],
        queryFn: () =>
            sellerAllProductsQuery(pageIndex, pageSize, filters, sorting),
    });

    // console.log('Fetched data:', data);

    // console.log(`$$$ ${JSON.stringify(data?.products)}`);

    if (error instanceof Error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <ProductTable
                columns={columns}
                data={data?.products ?? []}
                pageIndex={pageIndex}
                pageSize={pageSize}
                productCategories={
                    data?.categoryMap instanceof Map
                        ? Object.fromEntries(data.categoryMap)
                        : {}
                }
                filteredProductsCount={data?.filteredProductsCount ?? 0}
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
