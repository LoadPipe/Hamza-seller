import { OrderSchema, columns } from '@/components/orders/columns';
import { DataTable } from '@/components/table/data-table.tsx';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import React from 'react';
import { useSearch } from '@tanstack/react-router';
import { OrderSearchSchema } from '@/routes.tsx';
import { getJwtField } from '@/utils/authentication';
import { postSecure } from '@/utils/api-calls';
import { SortingState } from '@tanstack/react-table';

type Order = z.infer<typeof OrderSchema>;

async function getSellerOrders(
    pageIndex = 0,
    pageSize = 10,
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
            store_id: getJwtField('store_id'),
            page: pageIndex,
            count: pageSize,
            sort: sort,
        });
        console.log(`STORE_ID ${response.store_id}`);

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

    // data table hooks
    const [pageIndex, setPageIndex] = React.useState(page);
    const [pageSize, setPageSize] = React.useState(count);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const { data, isLoading, error } = useQuery<
        {
            orders: Order[];
            totalRecords: number;
        },
        Error
    >({
        queryKey: ['orders', pageIndex, pageSize, sorting],
        queryFn: () => getSellerOrders(pageIndex, pageSize, sorting), // Fetch with pagination
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                totalRecords={data?.totalRecords ?? 0}
                sorting={sorting}
                setSorting={setSorting}
            />
        </>
    );
}
