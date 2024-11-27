export enum OrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    ARCHIVED = 'archived',
    CANCELED = 'canceled',
    REQUIRES_ACTION = 'requires_action',
}

export enum FulfillmentStatus {
    NOT_FULFILLED = 'not_fulfilled',
    PARTIALLY_FULFILLED = 'partially_fulfilled',
    FULFILLED = 'fulfilled',
    PARTIALLY_SHIPPED = 'partially_shipped',
    SHIPPED = 'shipped',
    PARTIALLY_RETURNED = 'partially_returned',
    RETURNED = 'returned',
    CANCELED = 'canceled',
    REQUIRES_ACTION = 'requires_action',
}

export enum PaymentStatus {
    NOT_PAID = 'not_paid',
    AWAITING = 'awaiting',
    CAPTURED = 'captured',
    PARTIALLY_REFUNDED = 'partially_refunded',
    REFUNDED = 'refunded',
    CANCELED = 'canceled',
    REQUIRES_ACTION = 'requires_action',
}
