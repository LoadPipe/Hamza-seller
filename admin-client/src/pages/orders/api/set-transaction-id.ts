import { postSecure } from '@/utils/api-calls.ts';

// Union type check
type transactionType = "refund" | "release"

export const setTransactionId = async (order_id: string, transaction_id: string | undefined, transaction_type: transactionType): Promise<boolean> => {
    try {
        const response = await postSecure('/seller/order/history/set-transaction-id', {
            order_id: order_id,
            transaction_id: transaction_id,
            type: transaction_type
        });
        console.log(`SET TRANSACTION: ${response}`)
        return response;
    } catch (e) {
        console.error('Failed to set transaction_id in order-history');
        throw new Error('Failed to set transaction_id in order history');
    }
};
