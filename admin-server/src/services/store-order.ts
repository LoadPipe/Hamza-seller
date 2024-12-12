import { Payment, Store, TransactionBaseService } from '@medusajs/medusa';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { ProductVariantRepository } from '../repositories/product-variant';
import StoreRepository from '../repositories/store';
import { Order } from '../models/order';
import { Lifetime } from 'awilix';
import {
    In,
    Not,
    MoreThan,
    LessThan,
    MoreThanOrEqual,
    LessThanOrEqual,
    Between,
} from 'typeorm';
import { createLogger, ILogger } from '../utils/logging/logger';
import OrderHistoryService from './order-history';
import StoreOrderRepository from '../repositories/order';
import {
    OrderStatus,
    FulfillmentStatus,
    PaymentStatus,
} from '@medusajs/medusa';

const DEFAULT_PAGE_COUNT = 10;

interface FilterOrders {
    orderStatus?: OrderStatus;
    fulfillmentStatus?: FulfillmentStatus;
    paymentStatus?: PaymentStatus;
    price?: {
        ne?: number;
        eq?: number;
        lt?: number;
        gt?: number;
        lte?: number;
        gte?: number;
    }; // range filtering
    created_at?: {
        gte?: string; // ISO 8601 timestamp
        lte?: string; // ISO 8601 timestamp
    };
}

export interface StoreOrdersDTO {
    pageIndex: number;
    pageCount: number;
    rowsPerPage: number;
    sortedBy: any;
    sortDirection: string;
    filtering: FilterOrders;
    orders: any[]; //TODO: actually should be type Order[]
    totalRecords: number;
    statusCount: {};
}

export default class StoreOrderService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SINGLETON;

    protected orderRepository_: typeof StoreOrderRepository;
    protected paymentRepository_: typeof PaymentRepository;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected orderHistoryService_: OrderHistoryService;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
        this.storeRepository_ = container.storeRepository;
        this.paymentRepository_ = container.paymentRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.orderHistoryService_ = container.orderHistoryService;
        this.logger = createLogger(container, 'StoreOrderService');
    }

    async getOrdersForStore(
        storeId: string,
        filter: FilterOrders,
        sort: any,
        page: number,
        ordersPerPage: number
    ): Promise<StoreOrdersDTO> {
        //basic query is store id
        const where = { store_id: storeId };

        //apply filter if any
        if (filter) {
            for (let prop in filter) {
                if (filter[prop].in) {
                    where[prop] = In(filter[prop].in);
                } else if (filter[prop].ne) {
                    where[prop] = Not(filter[prop].ne);
                } else if (filter[prop].eq) {
                    where[prop] = filter[prop].eq;
                } else if (filter[prop].lt) {
                    where[prop] = LessThan(filter[prop].lt);
                } else if (filter[prop].gt) {
                    where[prop] = MoreThan(filter[prop].gt);
                } else if (filter[prop].lte) {
                    where[prop] = LessThanOrEqual(filter[prop].lte);
                } else if (filter[prop].gte) {
                    where[prop] = MoreThanOrEqual(filter[prop].gte);
                } else {
                    where[prop] = filter[prop];
                }
            }
            if (filter.created_at) {
                if (filter.created_at.gte && filter.created_at.lte) {
                    where['created_at'] = Between(
                        new Date(filter.created_at.gte),
                        new Date(filter.created_at.lte)
                    );
                } else if (filter.created_at.gte) {
                    where['created_at'] = MoreThanOrEqual(
                        new Date(filter.created_at.gte)
                    );
                } else if (filter.created_at.lte) {
                    where['created_at'] = LessThanOrEqual(
                        new Date(filter.created_at.lte)
                    );
                }
            }
        }

        const totalRecords = await this.orderRepository_.count({
            where: { store_id: storeId },
        });

        // Calculate counts for each status
        const statusCounts = {
            all: totalRecords,
            processing: await this.orderRepository_.count({
                where: {
                    store_id: storeId,
                    fulfillment_status: FulfillmentStatus.NOT_FULFILLED, // Correct casing
                    status: OrderStatus.PENDING, // Correct casing
                },
            }),
            shipped: await this.orderRepository_.count({
                where: {
                    store_id: storeId,
                    fulfillment_status: FulfillmentStatus.SHIPPED,
                    payment_status: PaymentStatus.CAPTURED,
                },
            }),
            delivered: await this.orderRepository_.count({
                where: {
                    store_id: storeId,
                    fulfillment_status: FulfillmentStatus.FULFILLED,
                    status: OrderStatus.COMPLETED,
                },
            }),
            cancelled: await this.orderRepository_.count({
                where: {
                    store_id: storeId,
                    status: OrderStatus.CANCELED,
                    fulfillment_status: FulfillmentStatus.CANCELED,
                },
            }),
            refunded: await this.orderRepository_.count({
                where: {
                    store_id: storeId,
                    payment_status: PaymentStatus.REFUNDED,
                    fulfillment_status: FulfillmentStatus.CANCELED,
                },
            }),
        };

        const params = {
            where,
            take: ordersPerPage ?? DEFAULT_PAGE_COUNT,
            skip: page * ordersPerPage,
            order:
                sort?.field &&
                sort.field !== 'customer' &&
                sort.field !== 'payments'
                    ? {
                          [sort.field]: sort.direction, // Sort directly if not 'customer' or 'price'
                      }
                    : undefined,
            relations: ['customer', 'payments'], // Fetch related payments and customers
        };

        const allOrders = await this.orderRepository_.find(params);

        const orders = await Promise.all(
            allOrders.map(async (order) => {
                const payments = await this.orderRepository_.findOne({
                    where: { id: order.id },
                    relations: ['payments'],
                });
                return { ...order, payments: payments?.payments || [] };
            })
        );

        if (sort?.field === 'customer') {
            orders.sort((a, b) => {
                const nameA = a.customer?.last_name?.toLowerCase();
                const nameB = b.customer?.last_name?.toLowerCase();

                if (sort.direction === 'ASC') {
                    return nameA.localeCompare(nameB);
                } else if (sort.direction === 'DESC') {
                    return nameB.localeCompare(nameA);
                }
            });
        }

        if (sort?.field === 'payments') {
            orders.sort((a, b) => {
                const amountA = a.payments?.[0]?.amount || 0; // Fallback to 0 if no payment
                const amountB = b.payments?.[0]?.amount || 0;

                if (sort.direction === 'ASC') {
                    return amountA - amountB;
                } else if (sort.direction === 'DESC') {
                    return amountB - amountA;
                }

                return 0;
            });
        }

        return {
            pageIndex: page,
            pageCount: Math.ceil(totalRecords / ordersPerPage),
            rowsPerPage: ordersPerPage,
            sortedBy: sort?.field ?? null,
            sortDirection: sort?.direction ?? 'ASC',
            filtering: filter,
            orders,
            totalRecords,
            statusCount: statusCounts,
        };
    }

    async changeOrderStatus(
        orderId: string,
        newStatus: string,
        note?: Record<string, any>
    ) {
        try {
            const validStatuses = [
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'refunded',
            ];

            if (!validStatuses.includes(newStatus)) {
                throw new Error(`Invalid order status: ${newStatus}`);
            }

            const order = await this.orderRepository_.findOne({
                where: { id: orderId },
            });

            if (!order) {
                throw new Error(`Order with id ${orderId} not found`);
            }

            switch (newStatus) {
                case 'processing':
                    order.fulfillment_status = FulfillmentStatus.NOT_FULFILLED;
                    order.status = OrderStatus.PENDING;
                    break;

                case 'shipped':
                    order.fulfillment_status = FulfillmentStatus.SHIPPED;
                    order.payment_status = PaymentStatus.CAPTURED;
                    break;

                case 'delivered':
                    order.fulfillment_status = FulfillmentStatus.FULFILLED;
                    order.status = OrderStatus.COMPLETED;
                    break;

                case 'cancelled':
                    order.status = OrderStatus.CANCELED;
                    order.fulfillment_status = FulfillmentStatus.CANCELED;
                    break;

                case 'refunded':
                    order.payment_status = PaymentStatus.REFUNDED;
                    // either canceled or returned...
                    order.fulfillment_status = FulfillmentStatus.CANCELED;
                    // order.status = OrderStatus.RETURNED;
                    break;

                default:
                    throw new Error(`Unsupported status: ${newStatus}`);
            }

            // Update metadata if a note is provided
            if (note) {
                order.metadata = note;
            }

            // Save the updated order
            await this.orderRepository_.save(order);

            return order;
        } catch (error) {
            this.logger.error(
                `Failed to update order status for order ${orderId}: ${error.message}`
            );
            throw error;
        }
    }

    async getOrderDetails(orderId: string) {
        try {
            // Fetch the order with the specific relation
            const order = await this.orderRepository_.findOne({
                where: { id: orderId },
                relations: [
                    'items',
                    'items.variant',
                    'items.variant.product',
                    'customer.walletAddresses',
                    'shipping_address',
                    'payments',
                ],
            });

            if (!order) {
                throw new Error(`Order with id ${orderId} not found`);
            }

            return order;
        } catch (error) {
            this.logger.error(
                `Failed to fetch order details for order ${orderId}: ${error.message}`
            );
            throw error;
        }
    }
}
