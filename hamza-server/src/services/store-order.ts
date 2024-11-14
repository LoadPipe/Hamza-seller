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

const DEFAULT_PAGE_COUNT = 30;

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
        filter: any,
        sort: any,
        page: number,
        count: number
    ): Promise<{ orders: Order[], totalRecords: number }> {
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
            take: count ?? DEFAULT_PAGE_COUNT,
            skip: page * count,
            order: sort ?? undefined,
            relations: ['customer']
            // relations: ['customer', 'items.variant.product']
        };

        // Get total count of matching record
        const totalRecords = await this.orderRepository_.count({ where });


        //get orders
        const orders = await this.orderRepository_.find(params);

        return { orders, totalRecords };
    }
}
