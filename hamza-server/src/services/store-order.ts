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
import { In, Not } from 'typeorm';
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
    ): Promise<Order[]> {
        const where: { store_id?: string } = { store_id: storeId };

        const orders = await this.orderRepository_.find({
            where,
            take: count ?? DEFAULT_PAGE_COUNT,
            skip: page * count,
        });

        return orders;
    }
}
