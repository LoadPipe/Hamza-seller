type FulfillmentStatusType =
    | 'not_fulfilled'
    | 'partially_fulfilled'
    | 'fulfilled'
    | 'partially_shipped'
    | 'shipped'
    | 'partially_returned'
    | 'returned'
    | 'canceled'
    | 'requires_action';

type PaymentStatusType =
    | 'not_paid'
    | 'awaiting'
    | 'captured'
    | 'partially_refunded'
    | 'refunded'
    | 'canceled'
    | 'requires_action';

type OrderStatusType =
    | 'pending'
    | 'completed'
    | 'archived'
    | 'canceled'
    | 'requires_action';

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

    if (orderStatus === 'canceled' && fulfillmentStatus === 'canceled') {
        return 'Cancelled';
    }

    if (fulfillmentStatus === 'fulfilled' && orderStatus === 'completed') {
        return 'Delivered';
    }

    if (paymentStatus === 'refunded') {
        return 'Refunded';
    }

    // Default case
    return 'unknown';
}
