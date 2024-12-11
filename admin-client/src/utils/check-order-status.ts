type FulfillmentStatusType = 'not_fulfilled' | 'shipped' | 'fulfilled';
type OrderStatusType = 'pending' | 'completed' | 'canceled';
type PaymentStatusType = 'refunded';

export function getOrderStatusName(
    fulfillmentStatus: FulfillmentStatusType,
    orderStatus: OrderStatusType,
    paymentStatus: PaymentStatusType | undefined
): string {
    if (fulfillmentStatus === 'not_fulfilled' && orderStatus === 'pending') {
        return 'Processing';
    }

    if (fulfillmentStatus === 'shipped') {
        return 'Shipped';
    }

    if (fulfillmentStatus === 'fulfilled' && orderStatus === 'completed') {
        return 'Delivered';
    }

    if (orderStatus === 'canceled') {
        return 'Cancelled';
    }

    if (paymentStatus === 'refunded') {
        return 'Refunded';
    }

    // Default case
    return 'unknown';
}
