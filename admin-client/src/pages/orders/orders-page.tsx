import { OrderSchema, columns } from '@/components/orders/columns';
import { DataTable } from '@/components/table/data-table.tsx';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import React from 'react';
import { useSearch } from '@tanstack/react-router';
import { OrderSearchSchema } from '@/routes.tsx';
import { filterStore } from '@/stores/order-filter/order-filter-store.ts';
import { useStore } from '@tanstack/react-store';
import { SortingState } from '@tanstack/react-table';
import { useNavigate } from '@tanstack/react-router';
import { setFilter } from '@/stores/order-filter/order-filter-store.ts';
import { ReleaseEscrow } from '@/components/orders/release-escrow.tsx';
import { getSellerOrders } from '@/pages/orders/api/seller-orders.ts';

type Order = z.infer<typeof OrderSchema>;

export default function OrdersPage() {
    const { filters } = useStore(filterStore); // Subscribe to filter store

    const search = useSearch({ from: '/orders' });

    const { page, count, sort, filter } = OrderSearchSchema.parse(search);

    // Parse sort into field and direction
    const [sortField, sortDirection] = sort
        ? sort.split(':')
        : ['created_at', 'DESC'];

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
                    : 'created_at:DESC',
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

    // console.log('orders: ', data);
    // console.log('columns: ' + JSON.stringify(columns));
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
