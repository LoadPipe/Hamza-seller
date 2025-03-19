import { orderColumns } from '@/pages/orders/order-columns.tsx';
import { OrderTable } from '@/pages/orders/order-table.tsx';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import React, { useEffect } from 'react';
import { useRouter, useSearch } from '@tanstack/react-router';
import { OrderSearchSchema } from '@/routes.tsx'; import { filterStore } from '@/stores/order-filter/order-filter-store.ts';
import { useStore } from '@tanstack/react-store';
import { SortingState } from '@tanstack/react-table';
import { useNavigate } from '@tanstack/react-router';
import { setFilter } from '@/stores/order-filter/order-filter-store.ts';
import { ReleaseEscrow } from '@/pages/orders/sidebar/release-escrow.tsx';
import { getSellerOrders } from '@/pages/orders/api/seller-orders.ts';
import { OrderSchema } from '@/pages/orders/order-schema.ts';
import { openOrderSidebar } from '@/stores/order-sidebar/order-sidebar-store';

type Order = z.infer<typeof OrderSchema>;

export default function OrdersPage() {
    const navigate = useNavigate();
    const { filters } = useStore(filterStore); // Subscribe to filter store
    const router = useRouter();
    const search = useSearch({ from: '/orders' });

    // Extract pagination, sorting, and filters from URL
    const { page, count, sort, filter } = OrderSearchSchema.parse(search);

    // Get order ID from route params (if on detail route) or query params
    const routeParams = router.state.matches.find(m =>
        m.routeId === '/orders/$orderId'
    )?.params as { orderId?: string } | undefined;

    const orderIdFromPath = routeParams?.orderId;
    const orderIdFromQuery = search.order_id;

    // Handle opening order sidebar when appropriate
    useEffect(() => {
        // Format order ID to ensure consistent prefix
        const formatOrderId = (id: string) => {
            if (!id) return null;
            return id.startsWith('order_') ? id : `order_${id}`;
        };

        // Path parameter takes precedence over query parameter
        const orderId = orderIdFromPath || orderIdFromQuery;

        if (orderId) {
            const formattedOrderId = formatOrderId(orderId);
            if (formattedOrderId) {
                openOrderSidebar(formattedOrderId);
            }
        }
    }, [orderIdFromPath, orderIdFromQuery]);

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

    // Local State for pagination and sorting
    const [pageIndex, setPageIndex] = React.useState(page);
    const [pageSize, setPageSize] = React.useState(count);
    const [sorting, setSorting] = React.useState<SortingState>(
        sortField && sortDirection
            ? [{ id: sortField, desc: sortDirection === 'DESC' }]
            : []
    );

    // Update URL when filters, page, or sorting change
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
    // console.log('orderColumns: ' + JSON.stringify(orderColumns));
    return (
        <>
            <OrderTable
                columns={orderColumns}
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
