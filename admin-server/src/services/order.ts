import {
    Cart,
    FulfillmentStatus,
    OrderService as MedusaOrderService,
    OrderStatus,
    PaymentStatus,
    Logger,
    IdempotencyKeyService,
    ProductVariant,
    LineItem,
} from '@medusajs/medusa';
import { BuckyLogRepository } from '../repositories/bucky-log';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import LineItemRepository from '@medusajs/medusa/dist/repositories/line-item';
import SalesChannelRepository from '@medusajs/medusa/dist/repositories/sales-channel';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { ProductVariantRepository } from '../repositories/product-variant';
import { RefundRepository } from '../repositories/refund';
import StoreRepository from '../repositories/store';
import CustomerRepository from '../repositories/customer';
import { LineItemService } from '@medusajs/medusa';
import { Order } from '../models/order';
import { Customer } from '../models/customer';
import { Payment } from '../models/payment';
import { Lifetime } from 'awilix';
import { In, Not } from 'typeorm';
import { BuckyClient } from '../buckydrop/bucky-client';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { createLogger, ILogger } from '../utils/logging/logger';
import SmtpMailService from './smtp-mail';
import CustomerNotificationService from './customer-notification';
import { formatCryptoPrice } from '../utils/price-formatter';
import OrderHistoryService from './order-history';
import { OrderHistory } from 'src/models/order-history';
import CartRepository from '@medusajs/medusa/dist/repositories/cart';
import RegionRepository from '@medusajs/medusa/dist/repositories/region';
import { randomInt, randomUUID } from 'crypto';

// Since {TO_PAY, TO_SHIP} are under the umbrella name {Processing} in FE, not sure if we should modify atm
// In medusa we have these 5 DEFAULT order.STATUS's {PENDING, COMPLETED, ARCHIVED, CANCELED, REQUIRES_ACTION}
// In this case PENDING will be {PROCESSING}
// REFACTOR {TO_PAY, TO_SHIP} is now under {PROCESSING} umbrella
export enum OrderBucketType {
    PROCESSING = 1,
    SHIPPED = 2,
    DELIVERED = 3,
    CANCELLED = 4,
    REFUNDED = 5,
}

type InjectDependencies = {
    idempotencyKeyService: IdempotencyKeyService;
    lineItemService: LineItemService;
};

type OrderBucketList = { [key: string]: Order[] };

export default class OrderService extends MedusaOrderService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected lineItemService: LineItemService;
    protected refundRepository_: typeof RefundRepository;
    protected customerRepository_: typeof CustomerRepository;
    protected orderRepository_: typeof OrderRepository;
    protected lineItemRepository_: typeof LineItemRepository;
    protected productRepository_: typeof ProductRepository;
    protected paymentRepository_: typeof PaymentRepository;
    protected cartRepository_: typeof CartRepository;
    protected regionRepository_: typeof RegionRepository;
    protected salesChannelRepository_: typeof SalesChannelRepository;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly buckyLogRepository_: typeof BuckyLogRepository;
    protected customerNotificationService_: CustomerNotificationService;
    protected smtpMailService_: SmtpMailService = new SmtpMailService();
    protected orderHistoryService_: OrderHistoryService;
    protected readonly logger: ILogger;
    protected buckyClient: BuckyClient;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
        this.customerRepository_ = container.customerRepository;
        this.refundRepository_ = container.refundRepository;
        this.storeRepository_ = container.storeRepository;
        this.regionRepository_ = container.regionRepository;
        this.cartRepository_ = container.cartRepository;
        this.salesChannelRepository_ = container.salesChannelRepository;
        this.lineItemRepository_ = container.lineItemRepository;
        this.paymentRepository_ = container.paymentRepository;
        this.productRepository_ = container.productRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.customerNotificationService_ =
            container.customerNotificationService;
        this.orderHistoryService_ = container.orderHistoryService;
        this.logger = createLogger(container, 'OrderService');
        this.buckyLogRepository_ = container.buckyLogRepository;
        this.buckyClient = new BuckyClient(container.buckyLogRepository);
    }

    async createFromPayment(
        cart: Cart,
        payment: Payment,
        storeId: string
    ): Promise<Order> {
        this.logger.info(
            `creating Order with input ${JSON.stringify(payment)}`
        );
        try {
            //create the order
            let order: Order = new Order();
            order.billing_address_id = cart.billing_address_id;
            order.cart_id = cart.id;
            order.created_at = payment.created_at;
            order.currency_code = payment.currency_code;
            order.customer_id = cart.customer_id;
            order.discount_total = 0; //TODO: get proper discount
            order.store_id = storeId;
            order.email = cart.email;
            order.payment_status = PaymentStatus.NOT_PAID;
            order.shipping_address_id = cart.shipping_address_id;
            order.paid_total = payment.amount;
            order.region_id = cart.region_id;
            order.sales_channel_id = cart.sales_channel_id;
            order.total = payment.amount;
            order.updated_at = payment.updated_at;
            order.status = OrderStatus.REQUIRES_ACTION;

            //save the order
            order = await this.orderRepository_.save(order);

            order.items = cart.items;

            const lineItemPromise = cart.items.map((item) => {
                item.order_id = order.id;
                return this.lineItemRepository_.save(item);
            });

            await Promise.all([...lineItemPromise]);

            //update the cart
            cart.completed_at = new Date();
            // await this.cartService_.update(cart.id, cart);

            return order;
        } catch (e) {
            this.logger.error(`Error creating order: ${e}`);
        }
        return null;
    }

    async getOrdersForCheckout(cartId: string): Promise<Order[]> {
        return this.orderRepository_.find({
            where: { cart_id: cartId, status: OrderStatus.REQUIRES_ACTION },
            relations: ['store.owner', 'payments'],
            skip: 0,
            take: 1,
            order: { created_at: 'DESC' },
        });
    }

    async getOrderWithStore(orderId: string): Promise<Order> {
        return this.orderRepository_.findOne({
            where: { id: orderId },
            relations: ['store.owner'],
        });
    }

    async getOrderWithStoreAndItems(orderId: string): Promise<Order> {
        return this.orderRepository_.findOne({
            where: { id: orderId },
            relations: ['store.owner', 'items'],
        });
    }

    async updateInventory(
        variantOrVariantId: string,
        quantityToDeduct: number
    ) {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { id: variantOrVariantId },
                }
            );

            if (productVariant.inventory_quantity >= quantityToDeduct) {
                productVariant.inventory_quantity -= quantityToDeduct;
                await this.productVariantRepository_.save(productVariant);
                this.logger.debug(
                    `Inventory updated for variant ${productVariant.id}, new inventory count: ${productVariant.inventory_quantity}`
                );
                return productVariant;
            } else if (productVariant.allow_backorder) {
                this.logger.debug(
                    'Inventory below requested deduction but backorders are allowed.'
                );
            } else {
                this.logger.debug(
                    'Not enough inventory to deduct the requested quantity.'
                );
            }
        } catch (e) {
            this.logger.error(
                `Error updating inventory for variant ${variantOrVariantId}: ${e}`
            );
        }
    }

    async finalizeCheckout(
        cartId: string,
        transactionId: string,
        payerAddress: string,
        receiverAddress: string,
        escrowContractAddress: string,
        chainId: number
    ): Promise<Order[]> {
        //get orders & order ids
        const orders: Order[] = await this.orderRepository_.find({
            where: {
                cart_id: cartId,
                status: OrderStatus.REQUIRES_ACTION,
            },
            take: 1,
            skip: 0,
            order: { created_at: 'DESC' },
        });
        const orderIds = orders.map((order) => order.id);

        //get payments associated with orders
        const payments: Payment[] = await this.paymentRepository_.find({
            where: { order_id: In(orderIds) },
        });

        //do buckydrop order creation
        if (process.env.BUCKY_ENABLE_PURCHASE)
            await this.processBuckydropOrders(cartId, orders);

        //calls to update inventory
        //const inventoryPromises =
        //    this.getPostCheckoutUpdateInventoryPromises(cartProductsJson);

        //calls to update payments
        const paymentPromises = this.getPostCheckoutUpdatePaymentPromises(
            payments,
            transactionId,
            payerAddress,
            receiverAddress,
            escrowContractAddress,
            chainId
        );

        //calls to update orders
        const orderPromises = this.getPostCheckoutUpdateOrderPromises(orders);

        await this.eventBus_.emit('order.placed', {
            customerId: orders[0].customer_id,
            orderIds: orderIds,
            orderId: orderIds[0],
            ...orders[0],
        });

        //execute all promises
        try {
            await Promise.all([
                //...inventoryPromises,
                ...paymentPromises,
                ...orderPromises,
            ]);
        } catch (e) {
            this.logger.error(`Error updating orders/payments: ${e}`);
        }

        return orders;
    }

    async cancelOrder(orderId: string, cancel_reason: string) {
        //get order
        let order: Order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });

        //set order status
        if (
            order.status === OrderStatus.PENDING ||
            order.status === OrderStatus.REQUIRES_ACTION
        ) {
            order.status = OrderStatus.CANCELED;
            order.canceled_at = new Date();
            order.metadata = { cancel_reason: cancel_reason };

            await this.orderRepository_.save(order);
        }

        return order;
    }

    async changeFulfillmentStatus(orderId: string, status: FulfillmentStatus) {
        const order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });
        order.fulfillment_status = status;
        await this.orderRepository_.save(order);
        return order;
    }

    async cancelOrderFromCart(cart_id: string) {
        await this.orderRepository_.update(
            { status: OrderStatus.REQUIRES_ACTION, cart: { id: cart_id } },
            { status: OrderStatus.ARCHIVED }
        );
    }

    async getVendorFromOrder(orderId: string) {
        try {
            const order = (await this.orderRepository_.findOne({
                where: { id: orderId },
                relations: ['store'],
            })) as Order;
            const store_id = order.store_id;
            const storeRepo = this.manager_.withRepository(
                this.storeRepository_
            );
            const store = await storeRepo.findOneBy({ id: store_id });
            return store.name;
        } catch (e) {
            this.logger.error(`Error fetching store from order: ${e}`);
        }
    }

    async getCustomerOrders(customerId: string): Promise<Order[]> {
        return this.orderRepository_.find({
            where: {
                customer_id: customerId,
                status: Not(
                    In([OrderStatus.ARCHIVED, OrderStatus.REQUIRES_ACTION])
                ),
            },
            relations: ['cart.items', 'cart', 'cart.items.variant.product'],
        });
    }

    async getCustomerOrderBuckets(
        customerId: string
    ): Promise<OrderBucketList> {
        const buckets = await Promise.all([
            this.getCustomerOrderBucket(customerId, OrderBucketType.PROCESSING),
            this.getCustomerOrderBucket(customerId, OrderBucketType.SHIPPED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.DELIVERED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.CANCELLED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.REFUNDED),
        ]);

        const output = {
            Processing: buckets[0],
            Shipped: buckets[1],
            Delivered: buckets[2],
            Cancelled: buckets[3],
            Refunded: buckets[4],
        };

        return output;
    }

    // Just checking if we have orders and returning a boolean
    async checkCustomerOrderBucket(customerId: string): Promise<boolean> {
        const buckets = await Promise.all([
            this.getCustomerOrderBucket(customerId, OrderBucketType.PROCESSING),
            this.getCustomerOrderBucket(customerId, OrderBucketType.SHIPPED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.DELIVERED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.CANCELLED),
            this.getCustomerOrderBucket(customerId, OrderBucketType.REFUNDED),
        ]);

        // Check if any of the order buckets have orders and return true if so
        return buckets.some((bucket) => bucket.length > 0);
    }

    async getCustomerOrderBucket(
        customerId: string,
        bucketType: OrderBucketType
    ): Promise<Order[]> {
        switch (bucketType) {
            case OrderBucketType.PROCESSING:
                return this.getCustomerOrdersByStatus(customerId, {
                    fulfillmentStatus: FulfillmentStatus.NOT_FULFILLED,
                    orderStatus: OrderStatus.PENDING,
                });
            case OrderBucketType.SHIPPED:
                return this.getCustomerOrdersByStatus(customerId, {
                    fulfillmentStatus: FulfillmentStatus.SHIPPED,
                });
            case OrderBucketType.DELIVERED:
                return this.getCustomerOrdersByStatus(customerId, {
                    orderStatus: OrderStatus.COMPLETED,
                    fulfillmentStatus: FulfillmentStatus.FULFILLED,
                });
            case OrderBucketType.CANCELLED:
                return this.getCustomerOrdersByStatus(customerId, {
                    orderStatus: OrderStatus.CANCELED,
                });
            case OrderBucketType.REFUNDED:
                return this.getCustomerOrdersByStatus(customerId, {
                    paymentStatus: PaymentStatus.REFUNDED,
                });
        }

        return [];
    }

    //TODO: the return type of this is hard to work with
    async orderSummary(cartId: string): Promise<{
        cart: Cart;
        items: any[];
    }> {
        const orders = (await this.orderRepository_.find({
            where: {
                cart_id: cartId,
                status: Not(
                    In([OrderStatus.ARCHIVED, OrderStatus.REQUIRES_ACTION])
                ),
            },
            relations: ['cart.items.variant.product', 'store.owner'],
        })) as Order[];

        const products = [];
        let cart: Cart = null;

        orders.forEach((order) => {
            cart = order.cart;
            order.cart.items.forEach((item) => {
                const product = {
                    ...item.variant.product,
                    order_id: order.id,
                    store_name: order.store.name, // Add store.name to the product
                    currency_code: item.currency_code,
                    unit_price: item.unit_price,
                };
                products.push(product);
            });
        });

        const seen = new Set();
        const items = [];

        for (const item of products) {
            if (!seen.has(item.id)) {
                seen.add(item.id);
                items.push(item);
            }
        }

        return {
            cart,
            items,
        };
    }

    async getNotReviewedOrders(customer_id: string) {
        const orderRepository = this.activeManager_.getRepository(Order);
        const notReviewedOrders = await orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.products', 'product')
            .leftJoinAndSelect('order.store', 'store')
            .leftJoin(
                'order.reviews',
                'review',
                'review.customer_id = :customer_id',
                { customer_id }
            )
            .select([
                'order.id',
                'order.status',
                'product.thumbnail',
                // 'store.icon',
            ])
            .where('order.customer_id = :customer_id', { customer_id })
            .andWhere('review.id IS NULL') // Ensures that the order has no reviews
            .andWhere('order.status != :status', { status: 'archived' })
            .getMany();

        if (!notReviewedOrders || notReviewedOrders.length === 0) {
            throw new Error('No unreviewed orders found');
        }

        return notReviewedOrders.map((order) => ({
            order_id: order.id,
            status: order.status,
            // store_logo: order.store.icon,
            // thumbnails: order.products.map((product) => product.thumbnail), // Assuming multiple products can be in one order
        }));
    }

    async listCustomerOrders(
        customerId: string
    ): Promise<{ orders: any[]; cartCount: number }> {
        const orders = await this.orderRepository_.find({
            where: {
                customer_id: customerId,
                status: Not(
                    In([OrderStatus.ARCHIVED, OrderStatus.REQUIRES_ACTION])
                ),
            },
            select: ['id', 'cart_id'], // Select id and cart_id
            // relations: ['cart.items', 'cart.items.variant'],
        });

        const cartCount = orders.length;

        let newOrderList: Order[] = await this.getOrdersWithItems(orders);

        // return { orders: orders, array: newOrderList };
        return { orders: newOrderList, cartCount: cartCount };
    }

    async getOrderDetails(cartId: string) {
        const orderHandle = await this.orderRepository_.findOne({
            where: {
                cart_id: cartId,
                status: Not(
                    In([OrderStatus.ARCHIVED, OrderStatus.REQUIRES_ACTION])
                ),
            },
            relations: ['cart.items', 'cart.items.variant.product', 'cart'],
        });
        let product_handles = [];
        orderHandle.cart.items.forEach((item) => {
            product_handles.push(item.variant.product.handle);
        });
        return product_handles;
    }

    // Ok now lets list all orders via lineItemService and return when the relation to cart_id matches..
    async listCollection(cartId: string) {
        try {
            const lineItems = await this.lineItemService.list({
                cart_id: cartId,
            });
            return lineItems;
        } catch (e) {
            this.logger.error('Error retrieving order', e);
            throw new Error('Failed to retrieve order');
        }
    }

    async getOrdersWithItems(orders: Order[]): Promise<Order[]> {
        let output: Order[] = [];
        for (const order of orders) {
            //TODO: do this with promises
            const orderWithItems = await this.orderRepository_.findOne({
                where: {
                    id: order.id,
                },
                relations: ['cart.items', 'cart.items.variant.product'],
            });
            output.push(orderWithItems);
        }
        return output;
    }

    async getBuckyProductVariantsFromOrder(
        order: Order
    ): Promise<{ variants: ProductVariant[]; quantities: number[] }> {
        const orders: Order[] = await this.getOrdersWithItems([order]);
        const relevantItems: LineItem[] = orders[0].cart.items.filter(
            (i) => i.variant.product.bucky_metadata
        );

        return relevantItems?.length
            ? {
                  variants: relevantItems.map((i) => i.variant),
                  quantities: relevantItems.map((i) => i.quantity),
              }
            : { variants: [], quantities: [] };
    }

    async getOrdersWithUnverifiedPayments() {
        return this.orderRepository_.find({
            where: {
                status: Not(
                    In([
                        OrderStatus.ARCHIVED,
                        OrderStatus.REQUIRES_ACTION,
                        OrderStatus.CANCELED,
                        OrderStatus.COMPLETED,
                    ])
                ),
                payment_status: PaymentStatus.AWAITING,
            },
            relations: ['payments'],
        });
    }

    async sendShippedEmail(order: Order): Promise<void> {
        return this.sendOrderEmail(
            order,
            'orderShipped',
            'order-shipped',
            'shipped'
        );
    }

    async sendDeliveredEmail(order: Order): Promise<void> {
        return this.sendOrderEmail(
            order,
            'orderStatusChanged',
            'order-delivered',
            'delivered'
        );
    }

    async sendCancelledEmail(order: Order): Promise<void> {
        return this.sendOrderEmail(
            order,
            'orderStatusChanged',
            'order-cancelled',
            'cancelled'
        );
    }

    async setOrderStatus(
        order: Order,
        status?: OrderStatus,
        fulfillmentStatus?: FulfillmentStatus,
        paymentStatus?: PaymentStatus,
        metadata?: Record<string, unknown>
    ): Promise<Order> {
        if (
            (status && order.status != status) ||
            (fulfillmentStatus &&
                order.fulfillment_status != fulfillmentStatus) ||
            (paymentStatus && order.payment_status != paymentStatus)
        ) {
            //get values to add to history
            const to_status: OrderStatus | null =
                status && order.status != status ? status : null;
            const to_payment_status: PaymentStatus | null =
                paymentStatus && order.payment_status != paymentStatus
                    ? paymentStatus
                    : null;
            const to_fulfillment_status: FulfillmentStatus | null =
                fulfillmentStatus &&
                order.fulfillment_status != fulfillmentStatus
                    ? fulfillmentStatus
                    : null;

            if (status) {
                order.status = status;
                if (order.fulfillment_status == FulfillmentStatus.FULFILLED) {
                    this.sendDeliveredEmail(order);
                }
            }
            if (fulfillmentStatus) {
                order.fulfillment_status = fulfillmentStatus;
                if (order.fulfillment_status == FulfillmentStatus.SHIPPED) {
                    this.sendShippedEmail(order);
                }
            }
            if (paymentStatus) {
                order.payment_status = paymentStatus;
                if (order.status == OrderStatus.CANCELED) {
                    this.sendCancelledEmail(order);
                }
            }

            //send emails
            //TODO: this should follow medusa events

            //save the order
            await this.orderRepository_.save(order);
            await this.orderHistoryService_.create(order, {
                to_status,
                to_payment_status,
                to_fulfillment_status,
                metadata,
            });
        }

        return order;
    }

    async getOrderHistory(orderId: string): Promise<OrderHistory[]> {
        return this.orderHistoryService_.retrieve(orderId);
    }

    private async sendOrderEmail(
        order: Order,
        requiredNotification: string,
        templateName: string,
        emailType: string
    ): Promise<void> {
        try {
            const hasNotification =
                await this.customerNotificationService_.hasNotification(
                    order.customer_id,
                    requiredNotification
                );

            if (hasNotification) {
                //get customer & cart
                const customer: Customer =
                    await this.customerRepository_.findOne({
                        where: { id: order.customer_id },
                    });
                const cart: Cart = await this.cartService_.retrieve(
                    order.cart_id
                );

                //send the mail
                this.smtpMailService_.sendMail({
                    from:
                        process.env.SMTP_HAMZA_FROM ??
                        'support@hamzamarket.com',
                    mailData: {
                        orderId: order.id,
                        orderAmount: formatCryptoPrice(
                            order.total,
                            order.currency_code
                        ),
                        orderDate: order.created_at,
                        items: order.items.map((i) => {
                            return {
                                title: i.title,
                                unit_price: formatCryptoPrice(
                                    i.unit_price,
                                    i.currency_code
                                ),
                                quantity: i.quantity,
                                thumbnail: i.thumbnail,
                            };
                        }),
                    },
                    to: customer.is_verified ? customer.email : cart.email,
                    templateName,
                    subject: `Your order has been from Hamza.market ${emailType}`,
                });
            }
        } catch (e: any) {
            this.logger.error(
                `Error sending ${emailType} email for order ${order.id}`
            );
        }
    }

    private async updatePaymentAfterTransaction(
        paymentId: string,
        update: Partial<Payment>
    ): Promise<Payment> {
        const result = await this.paymentRepository_.save({
            id: paymentId,
            ...update,
        });
        return result;
    }

    private async processBuckydropOrders(
        cartId: string,
        orders: Order[]
    ): Promise<void> {
        try {
            for (const order of orders) {
                const { variants, quantities } =
                    await this.getBuckyProductVariantsFromOrder(order);
                if (variants?.length) {
                    order.bucky_metadata = { status: 'pending' };
                    await this.orderRepository_.save(order);

                    this.logger.debug('BUCKY CREATED ORDER');
                }
            }
        } catch (e) {
            this.logger.error(`Failed to create buckydrop order for ${cartId}`);
        }
    }

    private async getCustomerOrdersByStatus(
        customerId: string,
        statusParams: {
            orderStatus?: OrderStatus;
            paymentStatus?: PaymentStatus;
            fulfillmentStatus?: FulfillmentStatus;
        }
    ): Promise<Order[]> {
        const where: {
            customer_id: string;
            status?: any;
            payment_status?: any;
            fulfillment_status?: any;
        } = {
            customer_id: customerId,
            status: Not(
                In([OrderStatus.ARCHIVED, OrderStatus.REQUIRES_ACTION])
            ),
        };

        if (statusParams.orderStatus) {
            where.status = statusParams.orderStatus;
        }

        if (statusParams.paymentStatus) {
            where.payment_status = statusParams.paymentStatus;
        }

        if (statusParams.fulfillmentStatus) {
            where.fulfillment_status = statusParams.fulfillmentStatus;
        }

        let orders = await this.orderRepository_.find({
            where,
            relations: [
                'items',
                'store',
                'shipping_address',
                'customer',
                'items.variant.product',
            ],
            order: { created_at: 'DESC' },
        });

        if (orders) orders = orders.filter((o) => o.items?.length > 0);

        return orders;
    }

    private getPostCheckoutUpdatePaymentPromises(
        payments: Payment[],
        transactionId: string,
        payerAddress: string,
        receiverAddress: string,
        escrowAddress: string,
        chainId: number
    ): Promise<Order | Payment>[] {
        const promises: Promise<Order | Payment>[] = [];

        //update payments with transaction info
        payments.forEach((p, i) => {
            promises.push(
                this.updatePaymentAfterTransaction(p.id, {
                    blockchain_data: {
                        transaction_id: transactionId,
                        payer_address: payerAddress,
                        escrow_address: escrowAddress,
                        receiver_address: receiverAddress,
                        chain_id: chainId,
                    },
                })
            );
        });

        return promises;
    }

    private getPostCheckoutUpdateOrderPromises(
        orders: Order[]
    ): Promise<Order>[] {
        return orders.map((o) => {
            return this.orderRepository_.save({
                id: o.id,
                status: OrderStatus.PENDING,
                payment_status: PaymentStatus.AWAITING,
            });
        });
    }

    async createRefund(
        orderId: string,
        refundAmount: number,
        reason: string,
        note?: string
    ): Promise<Order> {
        try {
            // Fetch order details
            const order = await this.orderRepository_.findOne({
                where: { id: orderId },
                relations: ['items'], // Ensure line items are fetched
            });

            if (!order) {
                throw new Error(`Order with ID ${orderId} not found.`);
            }

            // Calculate total order amount
            const totalOrderAmount = order.items.reduce(
                (sum, item) => sum + item.unit_price * item.quantity,
                0
            );

            // Calculate refunded amount
            const refundedResult = await this.refundRepository_.find({
                where: { order_id: orderId },
            });

            const alreadyRefunded = refundedResult.reduce(
                (sum, refund) => sum + refund.amount,
                0
            );

            const refundableAmount = totalOrderAmount - alreadyRefunded;

            // console.log(`$$$$$$$$ ALREADY ${alreadyRefunded} REFUNDABLE ${refundableAmount} $$$$$$$$$`);

            // Validate the refund amount
            if (refundAmount <= 0) {
                throw new Error(`Refund amount must be greater than 0.`);
            }

            if (refundAmount > refundableAmount) {
                throw new Error(
                    `Refund amount exceeds the refundable amount. Maximum refundable amount is ${refundableAmount}.`
                );
            }

            // Check for an existing unconfirmed refund
            let refund = await this.refundRepository_.findOne({
                where: { order_id: orderId, confirmed: false },
            });

            // Create a refund entity
            if (refund) {
                // Update the existing refund
                console.log(
                    `Updating existing unconfirmed refund for Order ID: ${orderId}`
                );
                refund.amount = refundAmount;
                refund.reason = reason;
                refund.note = note || refund.note;
            } else {
                // Create a new refund entity
                console.log(`Creating a new refund for Order ID: ${orderId}`);
                refund = this.refundRepository_.create({
                    order_id: orderId,
                    amount: refundAmount,
                    reason,
                    note,
                    confirmed: false,
                    created_at: new Date(),
                });
            }

            await this.refundRepository_.save(refund);

            // Optionally add notes or metadata to the order
            order.metadata = {
                ...order.metadata,
                refund_note: note || '',
            };

            // Update order's payment status if all refundable amount is refunded
            const isFullyRefunded = refundableAmount === refundAmount;
            if (isFullyRefunded) {
                order.payment_status = PaymentStatus.REFUNDED;
            }

            // Save the updated order
            const updatedOrder = await this.orderRepository_.save(order);

            // Return the updated order
            return updatedOrder;
        } catch (error) {
            this.logger.error(`Error creating refund: ${error.message}`);
            throw error; // Let the caller handle errors
        }
    }

    async confirmRefund(refundId: string) {
        try {
            const refund = await this.refundRepository_.findOne({
                where: { id: refundId },
            });

            if (!refund) {
                throw new Error(`Refund with ID ${refundId} not found.`);
            }

            refund.confirmed = true;

            const updatedRefund = await this.refundRepository_.save(refund);

            return updatedRefund;
        } catch (error) {
            this.logger.error(`Error updating refund: ${error.message}`);
            throw error; // Let the caller handle errors
        }
    }

    async createMockOrders(
        count: number,
        date: string = new Date().toDateString(),
        store_id: string = null
    ): Promise<Order[]> {
        console.log(
            `Parameters - count: ${count}, date: ${date}, store_id: ${store_id}`
        );
        if (!count || count <= 0) {
            count = 1;
        }
        const orders: Order[] = []; // To store all created orders

        //if no specified store, do random stores
        let allStores = [];
        const randomStores = !store_id;
        if (randomStores) {
            console.log('doing random stores');
            allStores = await this.storeRepository_.find({});
            console.log('got', allStores.length, 'stores');
        }

        //get all customers
        const allCustomers = await this.customerRepository_.find({});

        //create a customer if none exists
        if (!allCustomers.length) {
            const customer = this.customerRepository_.create({
                first_name: `Reynaldo`, // Unique for each order
                last_name: `Mocktavish`,
                email: `customer${randomUUID()}@example.com`,
                created_at: new Date(),
            });

            await this.customerRepository_.save(customer);
            allCustomers.push(customer);
            console.log('New customer created:', customer);
        }

        try {
            console.log('Starting mock order creation...');

            let actualOrderCount = 0;
            for (let i = 0; i < count; i++) {
                console.log(`Creating mock order ${i + 1} of ${count}...`);

                // Step 1: Get the first customer
                const customer = allCustomers[randomInt(allCustomers.length)];

                if (!customer) {
                    throw new Error('No customers found.');
                }
                console.log('Customer found:', customer);

                // Step 2: Get the first region
                const region = await this.regionRepository_
                    .createQueryBuilder('region')
                    .where('LOWER(region.name) = :name', { name: 'na' })
                    .getOne();

                if (!region) {
                    throw new Error('No regions found.');
                }
                console.log('Region found:', region);

                //get random store if necessary
                if (randomStores) {
                    console.log(
                        'getting random store from',
                        allStores.length,
                        'stores'
                    );
                    store_id = allStores[randomInt(allStores.length)].id;
                }
                console.log('store_id is', store_id);

                // Step 3: Get random products
                const randomCount = randomInt(10) + 1; // Random between 1 and 10

                console.log('getting products');
                const products = await this.productRepository_.query(
                    `SELECT *
                     FROM product
                     WHERE store_id='${store_id}'
                     ORDER BY RANDOM()
                     LIMIT ${randomCount}`
                );

                console.log(
                    `Retrieved ${products.length} random products`,
                    products
                );

                if (products.length) {
                    console.log('Products found:', products);

                    const variants = await Promise.all(
                        products.map((product) =>
                            this.productVariantRepository_.findOne({
                                where: { product_id: product.id },
                                order: { created_at: 'ASC' }, // Choose the first variant if multiple exist
                            })
                        )
                    );

                    // Validate that each product has at least one variant
                    variants.forEach((variant, index) => {
                        if (!variant) {
                            throw new Error(
                                `No variant found for product ${products[index].id}`
                            );
                        }
                    });

                    console.log('Variants found:', variants);

                    // Step 4: Store Id from params
                    const storeId = store_id;

                    // Grab the default sales channel... the first one
                    const salesChannel =
                        await this.salesChannelRepository_.findOne({
                            where: {}, // Empty where clause to find any sales channel
                            order: { created_at: 'ASC' }, // Sort by creation time, oldest first
                        });

                    if (!salesChannel) {
                        throw new Error('No sales channels found.');
                    }

                    const sales_channel_id = salesChannel.id;
                    console.log('Sales Channel ID:', sales_channel_id);

                    console.log('Creating cart with:', {
                        customer_id: customer.id,
                        email: customer.email,
                        region_id: region.id,
                    });
                    // Step 5: Create a cart for the customer
                    const cart = await this.cartRepository_.save(
                        this.cartRepository_.create({
                            customer_id: customer.id,
                            email: customer.email,
                            region_id: region.id,
                            sales_channel_id: sales_channel_id,
                            created_at: new Date(),
                            updated_at: new Date(),
                        })
                    );
                    console.log('Cart created:', cart);

                    // Step 6: Add line items to the cart
                    const lineItems = [];
                    for (let i = 0; i < products.length; i++) {
                        const product = products[i];
                        const variant = variants[i];

                        const lineItem = this.lineItemRepository_.create({
                            cart_id: cart.id,
                            title: product.title,
                            description: product.description,
                            thumbnail: product.thumbnail,
                            unit_price: variant.prices?.[0]?.amount || 1000,
                            quantity: Math.floor(Math.random() * 5) + 1,
                            currency_code: region.currency_code,
                            variant_id: variant.id, // Add variant_id here
                            created_at: new Date(),
                            updated_at: new Date(),
                        });
                        const savedLineItem =
                            await this.lineItemRepository_.save(lineItem);
                        lineItems.push(savedLineItem);
                    }
                    cart.items = lineItems;
                    console.log('Line items added to cart:', cart.items);

                    // Step 7: Create an order using the cart and product's store_id
                    let order: Order = new Order();
                    order.status = OrderStatus.PENDING;
                    order.store_id = storeId; // Use store_id directly from the product
                    order.fulfillment_status = FulfillmentStatus.NOT_FULFILLED;
                    order.payment_status = PaymentStatus.AWAITING;
                    order.sales_channel_id = sales_channel_id;
                    order.customer_id = customer.id;
                    order.email = customer.email;
                    order.cart_id = cart.id;
                    order.region_id = cart.region_id;
                    order.currency_code = 'usdt';
                    order.created_at = new Date(date);

                    order = await this.orderRepository_.save(order);
                    console.log('Order created successfully:', order);

                    // Step 8: Link line items to the order
                    order.items = cart.items;
                    const lineItemPromises = cart.items.map((item) => {
                        item.order_id = order.id;
                        return this.lineItemRepository_.save(item);
                    });

                    await Promise.all(lineItemPromises);
                    actualOrderCount++;

                    console.log('Line items linked to order:', order.items);

                    orders.push(order); // Add the order to the array

                    console.log(`Order ${i + 1} created successfully:`, order);
                }
            }

            console.log(
                `${actualOrderCount} mock orders created successfully.`
            );
            return orders; // Return all created orders
        } catch (error) {
            console.error('Error during mock order creation:', error.message);
            this.logger.error(`Error creating mock order: ${error.message}`);
            throw error;
        }
    }
}
