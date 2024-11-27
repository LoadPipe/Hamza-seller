import { TransactionBaseService } from '@medusajs/medusa';
import { BuckyLogRepository } from '../repositories/bucky-log';
import LineItemRepository from '@medusajs/medusa/dist/repositories/line-item';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { ProductVariantRepository } from '../repositories/product-variant';
import StoreRepository from '../repositories/store';
import CustomerRepository from '../repositories/customer';
import { LineItemService } from '@medusajs/medusa';
import { Order } from '../models/order';
import { Lifetime } from 'awilix';
import {
    In,
    Not,
    MoreThan,
    LessThan,
    MoreThanOrEqual,
    LessThanOrEqual,
} from 'typeorm';
import { BuckyClient } from '../buckydrop/bucky-client';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { createLogger, ILogger } from '../utils/logging/logger';
import SmtpMailService from './smtp-mail';
import CustomerNotificationService from './customer-notification';
import OrderHistoryService from './order-history';
import StoreOrderRepository from '../repositories/order';
import {
    OrderStatus,
    FulfillmentStatus,
    PaymentStatus,
} from '@medusajs/medusa';

const DEFAULT_PAGE_COUNT = 10;

interface filterOrders {
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
}

export interface StoreOrdersDTO {
    pageIndex: number;
    pageCount: number;
    rowsPerPage: number;
    sortedBy: any;
    sortDirection: string;
    filtering: filterOrders;
    orders: Order[];
    totalRecords: number;
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

    private readonly fulfillmentStatusOrder = {
        canceled: 1,
        shipped: 2,
        fulfilled: 3,
        partially_fulfilled: 4,
        not_fulfilled: 5,
        partially_shipped: 6,
        returned: 7,
        partially_returned: 8,
        requires_action: 9,
    };

    async getOrdersForStore(
        storeId: string,
        filter: filterOrders,
        sort: any,
        page: number,
        ordersPerPage: number
    ): Promise<StoreOrdersDTO> {
        //basic query is store id
        const where = { store_id: storeId };

        //apply filter if any
        if (filter) {
            for (let prop in filter) {
                if (filter[prop].ne) {
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
        }

        const params = {
            where,
            take: ordersPerPage ?? DEFAULT_PAGE_COUNT,
            skip: page * ordersPerPage,
            order:
                sort && sort.field !== 'customer'
                    ? {
                          [sort.field]: sort.direction, // e.g., ASC or DESC
                      }
                    : undefined,
            relations: ['customer'],
            // relations: ['customer', 'items.variant.product']
        };

        // Get total count of matching record
        const totalRecords = await this.orderRepository_.count({ where });

        //get orders
        const orders = await this.orderRepository_.find(params);

        if (sort?.field === 'customer') {
            orders.sort((a, b) => {
                const nameA = a.customer?.first_name?.toLowerCase() || '';
                const nameB = b.customer?.first_name?.toLowerCase() || '';

                if (sort.direction === 'asc') {
                    return nameA.localeCompare(nameB);
                } else if (sort.direction === 'desc') {
                    return nameB.localeCompare(nameA);
                }
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
        };
    }

    async changeOrderStatus(
        orderId: string,
        newStatus: string,
        note?: Record<string, any>
    ) {
        try {
            const order = await this.orderRepository_.findOne({
                where: { id: orderId },
            });

            if (!order) {
                throw new Error(`Order with id ${orderId} not found`);
            }

            const mappedStatus = Object.values(OrderStatus).find(
                (status) => status === newStatus
            );

            if (!mappedStatus) {
                throw new Error(`Invalid order status: ${newStatus}`);
            }

            order.status = mappedStatus;

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
