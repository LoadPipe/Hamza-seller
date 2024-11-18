import { OrderSchema, columns } from "@/components/orders/columns";
import { DataTable } from "@/components/table/data-table.tsx";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { z } from 'zod';
import React from 'react';
import { useSearch } from '@tanstack/react-router';
import { OrderSearchSchema } from '@/routes.tsx';

type Order = z.infer<typeof OrderSchema>;


async function getSellerOrders(pageIndex = 0, pageSize = 10): Promise<{ orders: Order[]; totalRecords: number}> {
    try {
        const response = await axios.post("http://localhost:9000/seller/order", {
            store_id: "store_01JCG0V7CDSB1QWV7111KJ1DDY",
            page: pageIndex,
            count: pageSize,
            sort: { created_at: "ASC" },
            filter: { status: { eq: "pending" } },
        }, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        });

        // SS orders: object => typecast: object ...
        const data: object = response.data.orders as object;
        // SS totalRecords: string => typecast: number...
        const totalRecords: number = response.data.totalRecords as number;
        return {
            orders: OrderSchema.array().parse(data), // Validate using Zod
            totalRecords,
        };
    } catch (error) {
        console.error("Failed to fetch seller orders:", error);
        throw new Error("Failed to fetch seller orders");
    }
}

export default function OrdersPage() {

    const search = useSearch({ from: '/orders' });

    const { page, count } = OrderSearchSchema.parse(search);

    const [pageIndex, setPageIndex] = React.useState(page);
    const [pageSize, setPageSize] = React.useState(count);

    const { data, isLoading, error } = useQuery<{
        orders: Order[];
        totalRecords: number;
    }, Error>({
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
        <div className="container mx-auto py-10">
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
