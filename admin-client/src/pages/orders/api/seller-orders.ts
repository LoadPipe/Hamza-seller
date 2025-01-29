import { z } from 'zod';
import { OrderSchema } from '@/pages/orders/product-columns.tsx';
import { SortingState } from '@tanstack/react-table';
import { postSecure } from '@/utils/api-calls.ts';
import { getJwtStoreId } from '@/utils/authentication';
import {
    saveStatusCountToStorage,
    updateStatusCount,
} from '@/stores/order-filter/order-filter-store.ts';

type Order = z.infer<typeof OrderSchema>;

export async function getSellerOrders(
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
            : { field: 'created_at', direction: 'DESC' };

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
