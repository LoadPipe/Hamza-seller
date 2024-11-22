import { OrderSchema, columns } from '@/components/orders/columns';
import { DataTable } from '@/components/table/data-table.tsx';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import React from 'react';
import { useSearch } from '@tanstack/react-router';
import { OrderSearchSchema } from '@/routes.tsx';
import { getJwtField } from '@/utils/authentication';
import { postSecure } from '@/utils/api-calls';

type Order = z.infer<typeof OrderSchema>;

async function getSellerOrders(
    pageIndex = 0,
    pageSize = 10
): Promise<{ orders: Order[]; totalRecords: number }> {
    try {
        const response = await postSecure('/seller/order', {
            store_id: getJwtField('store_id'),
            page: pageIndex,
            count: pageSize,
            sort: { created_at: 'ASC' },
            filter: { status: { eq: 'pending' } },
        });

        // SS orders: object => typecast: object ...
        const data: object = response.orders as object;
        // SS totalRecords: string => typecast: number...
        const totalRecords: number = response.totalRecords as number;
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
    const search = useSearch({ from: '/orders' });

    const { page, count } = OrderSearchSchema.parse(search);

    const [pageIndex, setPageIndex] = React.useState(page);
    const [pageSize, setPageSize] = React.useState(count);

    const { data, isLoading, error } = useQuery<
        {
            orders: Order[];
            totalRecords: number;
        },
        Error
    >({
        queryKey: ['orders', pageIndex, pageSize],
        queryFn: () => getSellerOrders(pageIndex, pageSize), // Fetch with pagination
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error instanceof Error) {
        return <div>{error.message}</div>;
    }

    return (
        <div className="flex">
            <DataTable
                columns={columns}
                data={data?.orders ?? []}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
                totalRecords={data?.totalRecords ?? 0}
            />
        </div>
    );
}
