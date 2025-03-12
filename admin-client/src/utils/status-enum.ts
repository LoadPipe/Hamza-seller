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

export enum DateOptions {
    WEEK = 'Last 7 days',
    TWO_WEEKS = 'Last 14 days',
    MONTH = 'This Month',
    LAST_MONTH = 'Last Month',
    YEAR = 'This Year',
    LAST_YEAR = 'Last Year',
    CUSTOM_DATE_RANGE = 'Custom Date Range',
}

// TODO: Not sure if this should be an enum or I should be mapping it from products.categoryMap
export enum ProductCategory {
    BOARD_GAMES = 'Board Games',
    GAMING = 'Gaming',
    FITNESS = 'Fitness',
    GADGETS = 'Gadgets',
    HOBBIES = 'Hobbies',
    ELECTRONICS = 'Electronics',
    HOME = 'Home',
    FEATURED = 'Featured',
    FASHION = 'Fashion',
    TOYS = 'Toys',
    BEAUTY = 'Beauty',
    SPORTS_OUTDOORS = 'Sports & Outdoors',
    HEALTH = 'Health',
    AUTOMOTIVE = 'Automotive',
    BOOKS = 'Books',
    OFFICE = 'Office',
    PETS = 'Pets',
    GIFT_CARDS = 'Gift Cards',
}


export enum ProductStatus {
    /**
     * The product is a draft. It's not viewable by customers.
     */
    DRAFT = "draft",
    /**
     * The product is proposed, but not yet published.
     */
    PROPOSED = "proposed",
    /**
     * The product is published.
     */
    PUBLISHED = "published",
    /**
     * The product is rejected. It's not viewable by customers.
     */
    REJECTED = "rejected"
}
