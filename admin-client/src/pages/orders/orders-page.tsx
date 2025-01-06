import { OrderSchema, columns } from '@/components/orders/columns';
import { DataTable } from '@/components/table/data-table.tsx';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import React from 'react';
import { useSearch } from '@tanstack/react-router';
import { OrderSearchSchema } from '@/routes.tsx';
import { getJwtStoreId } from '@/utils/authentication';
import { postSecure } from '@/utils/api-calls';
import { filterStore } from '@/stores/order-filter/order-filter-store.ts';
import { useStore } from '@tanstack/react-store';
import { SortingState } from '@tanstack/react-table';
import {
    saveStatusCountToStorage,
    updateStatusCount,
} from '@/stores/order-filter/order-filter-store';
import { useNavigate } from '@tanstack/react-router';
import { setFilter } from '@/stores/order-filter/order-filter-store.ts';
import { ReleaseEscrow } from '@/components/orders/release-escrow.tsx';

type Order = z.infer<typeof OrderSchema>;

async function getSellerOrders(
    pageIndex = 0,
    pageSize = 10,
    filters: Record<string, any>,
    sorting: SortingState = []
): Promise<{ orders: Order[]; totalRecords: number }> {
    try {
        const sort = sorting[0]
            ? {
                  field: sorting[0].id,
                  direction: sorting[0].desc ? 'DESC' : 'ASC',
              }
            : { field: 'created_at', direction: 'ASC' };

        const response = await postSecure('/seller/order', {
            store_id: getJwtStoreId(),
            page: pageIndex,
            count: pageSize,
            filter: filters, // Add filters here
            sort: sort,
        });

        // SS orders: object => typecast: object ...
        const data: object = response.orders as object;
        // SS totalRecords: string => typecast: number...
        const totalRecords: number = response.totalRecords as number;
        // console.log(`TOTAL RECORDS: ${JSON.stringify(response.statusCount)}`);
        saveStatusCountToStorage(response.statusCount);
        updateStatusCount(response.statusCount);
        return {
            orders: OrderSchema.array().parse(data), // Validate using Zod
            totalRecords,
        };
    } catch (error) {
        console.error('Failed to fetch seller orders:', error);
        throw new Error('Failed to fetch seller orders');
    }
}

export default function OrdersPage() {
    const { filters } = useStore(filterStore); // Subscribe to filter store

    const search = useSearch({ from: '/orders' });

    const { page, count, sort, filter } = OrderSearchSchema.parse(search);

    // Parse sort into field and direction
    const [sortField, sortDirection] = sort
        ? sort.split(':')
        : ['created_at', 'ASC'];

    // Initialize filters from URL or store
    React.useEffect(() => {
        if (filter) {
            const parsedFilters = JSON.parse(filter);
            Object.entries(parsedFilters).forEach(([key, value]) => {
                setFilter(key, value);
            });
        }
    }, [filter]);

    // data table hooks
    const [pageIndex, setPageIndex] = React.useState(page);
    const [pageSize, setPageSize] = React.useState(count);
    const [sorting, setSorting] = React.useState<SortingState>(
        sortField && sortDirection
            ? [{ id: sortField, desc: sortDirection === 'DESC' }]
            : []
    );

    // Update URL when filters, page, or sorting change
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate({
            to: '/orders',
            search: {
                page: pageIndex,
                count: pageSize,
                sort: sorting[0]
                    ? `${sorting[0].id}:${sorting[0].desc ? 'DESC' : 'ASC'}`
                    : 'created_at:ASC',
                filter: JSON.stringify(filters),
            },
            replace: true,
        });
    }, [pageIndex, pageSize, sorting, filters, navigate]);

    const { data, isLoading, error } = useQuery<
        {
            orders: Order[];
            totalRecords: number;
        },
        Error
    >({
        queryKey: ['orders', pageIndex, pageSize, filters, sorting],
        queryFn: () => getSellerOrders(pageIndex, pageSize, filters, sorting), // Fetch with pagination
    });

    if (error instanceof Error) {
        return <div>{error.message}</div>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={data?.orders ?? []}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                totalRecords={data?.orders.length ?? 0}
                sorting={sorting}
                setSorting={setSorting}
                isLoading={isLoading}
            />
            <ReleaseEscrow />
        </>
    );
}
