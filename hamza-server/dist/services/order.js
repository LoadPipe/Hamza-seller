"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBucketType = void 0;
const medusa_1 = require("@medusajs/medusa");
const order_1 = require("../models/order");
const awilix_1 = require("awilix");
const typeorm_1 = require("typeorm");
const bucky_client_1 = require("../buckydrop/bucky-client");
const logger_1 = require("../utils/logging/logger");
const smtp_mail_1 = __importDefault(require("./smtp-mail"));
const price_formatter_1 = require("../utils/price-formatter");
// Since {TO_PAY, TO_SHIP} are under the umbrella name {Processing} in FE, not sure if we should modify atm
// In medusa we have these 5 DEFAULT order.STATUS's {PENDING, COMPLETED, ARCHIVED, CANCELED, REQUIRES_ACTION}
// In this case PENDING will be {PROCESSING}
// REFACTOR {TO_PAY, TO_SHIP} is now under {PROCESSING} umbrella
var OrderBucketType;
(function (OrderBucketType) {
    OrderBucketType[OrderBucketType["PROCESSING"] = 1] = "PROCESSING";
    OrderBucketType[OrderBucketType["SHIPPED"] = 2] = "SHIPPED";
    OrderBucketType[OrderBucketType["DELIVERED"] = 3] = "DELIVERED";
    OrderBucketType[OrderBucketType["CANCELLED"] = 4] = "CANCELLED";
    OrderBucketType[OrderBucketType["REFUNDED"] = 5] = "REFUNDED";
})(OrderBucketType || (exports.OrderBucketType = OrderBucketType = {}));
class OrderService extends medusa_1.OrderService {
    constructor(container) {
        super(container);
        this.smtpMailService_ = new smtp_mail_1.default();
        this.orderRepository_ = container.orderRepository;
        this.customerRepository_ = container.customerRepository;
        this.storeRepository_ = container.storeRepository;
        this.lineItemRepository_ = container.lineItemRepository;
        this.paymentRepository_ = container.paymentRepository;
        this.productRepository_ = container.productRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.customerNotificationService_ =
            container.customerNotificationService;
        this.orderHistoryService_ = container.orderHistoryService;
        this.logger = (0, logger_1.createLogger)(container, 'OrderService');
        this.buckyLogRepository_ = container.buckyLogRepository;
        this.buckyClient = new bucky_client_1.BuckyClient(container.buckyLogRepository);
    }
    async createFromPayment(cart, payment, storeId) {
        this.logger.info(`creating Order with input ${JSON.stringify(payment)}`);
        try {
            //create the order
            let order = new order_1.Order();
            order.billing_address_id = cart.billing_address_id;
            order.cart_id = cart.id;
            order.created_at = payment.created_at;
            order.currency_code = payment.currency_code;
            order.customer_id = cart.customer_id;
            order.discount_total = 0; //TODO: get proper discount
            order.store_id = storeId;
            order.email = cart.email;
            order.payment_status = medusa_1.PaymentStatus.NOT_PAID;
            order.shipping_address_id = cart.shipping_address_id;
            order.paid_total = payment.amount;
            order.region_id = cart.region_id;
            order.sales_channel_id = cart.sales_channel_id;
            order.total = payment.amount;
            order.updated_at = payment.updated_at;
            order.status = medusa_1.OrderStatus.REQUIRES_ACTION;
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
        }
        catch (e) {
            this.logger.error(`Error creating order: ${e}`);
        }
        return null;
    }
    async getOrdersForCheckout(cartId) {
        return this.orderRepository_.find({
            where: { cart_id: cartId, status: medusa_1.OrderStatus.REQUIRES_ACTION },
            relations: ['store.owner', 'payments'],
            skip: 0,
            take: 1,
            order: { created_at: 'DESC' },
        });
    }
    async getOrderWithStore(orderId) {
        return this.orderRepository_.findOne({
            where: { id: orderId },
            relations: ['store.owner'],
        });
    }
    async getOrderWithStoreAndItems(orderId) {
        return this.orderRepository_.findOne({
            where: { id: orderId },
            relations: ['store.owner', 'items'],
        });
    }
    async updateInventory(variantOrVariantId, quantityToDeduct) {
        try {
            const productVariant = await this.productVariantRepository_.findOne({
                where: { id: variantOrVariantId },
            });
            if (productVariant.inventory_quantity >= quantityToDeduct) {
                productVariant.inventory_quantity -= quantityToDeduct;
                await this.productVariantRepository_.save(productVariant);
                this.logger.debug(`Inventory updated for variant ${productVariant.id}, new inventory count: ${productVariant.inventory_quantity}`);
                return productVariant;
            }
            else if (productVariant.allow_backorder) {
                this.logger.debug('Inventory below requested deduction but backorders are allowed.');
            }
            else {
                this.logger.debug('Not enough inventory to deduct the requested quantity.');
            }
        }
        catch (e) {
            this.logger.error(`Error updating inventory for variant ${variantOrVariantId}: ${e}`);
        }
    }
    async finalizeCheckout(cartId, transactionId, payerAddress, receiverAddress, escrowContractAddress, chainId) {
        //get orders & order ids
        const orders = await this.orderRepository_.find({
            where: {
                cart_id: cartId,
                status: medusa_1.OrderStatus.REQUIRES_ACTION,
            },
            take: 1,
            skip: 0,
            order: { created_at: 'DESC' },
        });
        const orderIds = orders.map((order) => order.id);
        //get payments associated with orders
        const payments = await this.paymentRepository_.find({
            where: { order_id: (0, typeorm_1.In)(orderIds) },
        });
        //do buckydrop order creation
        if (process.env.BUCKY_ENABLE_PURCHASE)
            await this.processBuckydropOrders(cartId, orders);
        //calls to update inventory
        //const inventoryPromises =
        //    this.getPostCheckoutUpdateInventoryPromises(cartProductsJson);
        //calls to update payments
        const paymentPromises = this.getPostCheckoutUpdatePaymentPromises(payments, transactionId, payerAddress, receiverAddress, escrowContractAddress, chainId);
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
        }
        catch (e) {
            this.logger.error(`Error updating orders/payments: ${e}`);
        }
        return orders;
    }
    async cancelOrder(orderId, cancel_reason) {
        //get order
        let order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });
        //set order status
        if (order.status === medusa_1.OrderStatus.PENDING ||
            order.status === medusa_1.OrderStatus.REQUIRES_ACTION) {
            order.status = medusa_1.OrderStatus.CANCELED;
            order.canceled_at = new Date();
            order.metadata = { cancel_reason: cancel_reason };
            await this.orderRepository_.save(order);
        }
        return order;
    }
    async changeFulfillmentStatus(orderId, status) {
        const order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });
        order.fulfillment_status = status;
        await this.orderRepository_.save(order);
        return order;
    }
    async cancelOrderFromCart(cart_id) {
        await this.orderRepository_.update({ status: medusa_1.OrderStatus.REQUIRES_ACTION, cart: { id: cart_id } }, { status: medusa_1.OrderStatus.ARCHIVED });
    }
    async getVendorFromOrder(orderId) {
        try {
            const order = (await this.orderRepository_.findOne({
                where: { id: orderId },
                relations: ['store'],
            }));
            const store_id = order.store_id;
            const storeRepo = this.manager_.withRepository(this.storeRepository_);
            const store = await storeRepo.findOneBy({ id: store_id });
            return store.name;
        }
        catch (e) {
            this.logger.error(`Error fetching store from order: ${e}`);
        }
    }
    async getCustomerOrders(customerId) {
        return this.orderRepository_.find({
            where: {
                customer_id: customerId,
                status: (0, typeorm_1.Not)((0, typeorm_1.In)([medusa_1.OrderStatus.ARCHIVED, medusa_1.OrderStatus.REQUIRES_ACTION])),
            },
            relations: ['cart.items', 'cart', 'cart.items.variant.product'],
        });
    }
    async getCustomerOrderBuckets(customerId) {
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
    async checkCustomerOrderBucket(customerId) {
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
    async getCustomerOrderBucket(customerId, bucketType) {
        switch (bucketType) {
            case OrderBucketType.PROCESSING:
                return this.getCustomerOrdersByStatus(customerId, {
                    fulfillmentStatus: medusa_1.FulfillmentStatus.NOT_FULFILLED,
                    orderStatus: medusa_1.OrderStatus.PENDING,
                });
            case OrderBucketType.SHIPPED:
                return this.getCustomerOrdersByStatus(customerId, {
                    fulfillmentStatus: medusa_1.FulfillmentStatus.SHIPPED,
                });
            case OrderBucketType.DELIVERED:
                return this.getCustomerOrdersByStatus(customerId, {
                    orderStatus: medusa_1.OrderStatus.COMPLETED,
                    fulfillmentStatus: medusa_1.FulfillmentStatus.FULFILLED,
                });
            case OrderBucketType.CANCELLED:
                return this.getCustomerOrdersByStatus(customerId, {
                    orderStatus: medusa_1.OrderStatus.CANCELED,
                });
            case OrderBucketType.REFUNDED:
                return this.getCustomerOrdersByStatus(customerId, {
                    paymentStatus: medusa_1.PaymentStatus.REFUNDED,
                });
        }
        return [];
    }
    //TODO: the return type of this is hard to work with
    async orderSummary(cartId) {
        const orders = (await this.orderRepository_.find({
            where: {
                cart_id: cartId,
                status: (0, typeorm_1.Not)((0, typeorm_1.In)([medusa_1.OrderStatus.ARCHIVED, medusa_1.OrderStatus.REQUIRES_ACTION])),
            },
            relations: ['cart.items.variant.product', 'store.owner'],
        }));
        const products = [];
        let cart = null;
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
    async getNotReviewedOrders(customer_id) {
        const orderRepository = this.activeManager_.getRepository(order_1.Order);
        const notReviewedOrders = await orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.products', 'product')
            .leftJoinAndSelect('order.store', 'store')
            .leftJoin('order.reviews', 'review', 'review.customer_id = :customer_id', { customer_id })
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
    async listCustomerOrders(customerId) {
        const orders = await this.orderRepository_.find({
            where: {
                customer_id: customerId,
                status: (0, typeorm_1.Not)((0, typeorm_1.In)([medusa_1.OrderStatus.ARCHIVED, medusa_1.OrderStatus.REQUIRES_ACTION])),
            },
            select: ['id', 'cart_id'], // Select id and cart_id
            // relations: ['cart.items', 'cart.items.variant'],
        });
        const cartCount = orders.length;
        let newOrderList = await this.getOrdersWithItems(orders);
        // return { orders: orders, array: newOrderList };
        return { orders: newOrderList, cartCount: cartCount };
    }
    async getOrderDetails(cartId) {
        const orderHandle = await this.orderRepository_.findOne({
            where: {
                cart_id: cartId,
                status: (0, typeorm_1.Not)((0, typeorm_1.In)([medusa_1.OrderStatus.ARCHIVED, medusa_1.OrderStatus.REQUIRES_ACTION])),
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
    async listCollection(cartId) {
        try {
            const lineItems = await this.lineItemService.list({
                cart_id: cartId,
            });
            return lineItems;
        }
        catch (e) {
            this.logger.error('Error retrieving order', e);
            throw new Error('Failed to retrieve order');
        }
    }
    async getOrdersWithItems(orders) {
        let output = [];
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
    async getBuckyProductVariantsFromOrder(order) {
        const orders = await this.getOrdersWithItems([order]);
        const relevantItems = orders[0].cart.items.filter((i) => i.variant.product.bucky_metadata);
        return (relevantItems === null || relevantItems === void 0 ? void 0 : relevantItems.length)
            ? {
                variants: relevantItems.map((i) => i.variant),
                quantities: relevantItems.map((i) => i.quantity),
            }
            : { variants: [], quantities: [] };
    }
    async getOrdersWithUnverifiedPayments() {
        return this.orderRepository_.find({
            where: {
                status: (0, typeorm_1.Not)((0, typeorm_1.In)([
                    medusa_1.OrderStatus.ARCHIVED,
                    medusa_1.OrderStatus.REQUIRES_ACTION,
                    medusa_1.OrderStatus.CANCELED,
                    medusa_1.OrderStatus.COMPLETED,
                ])),
                payment_status: medusa_1.PaymentStatus.AWAITING,
            },
            relations: ['payments'],
        });
    }
    async sendShippedEmail(order) {
        return this.sendOrderEmail(order, 'orderShipped', 'order-shipped', 'shipped');
    }
    async sendDeliveredEmail(order) {
        return this.sendOrderEmail(order, 'orderStatusChanged', 'order-delivered', 'delivered');
    }
    async sendCancelledEmail(order) {
        return this.sendOrderEmail(order, 'orderStatusChanged', 'order-cancelled', 'cancelled');
    }
    async setOrderStatus(order, status, fulfillmentStatus, paymentStatus, metadata) {
        if ((status && order.status != status) ||
            (fulfillmentStatus &&
                order.fulfillment_status != fulfillmentStatus) ||
            (paymentStatus && order.payment_status != paymentStatus)) {
            //get values to add to history
            const to_status = status && order.status != status ? status : null;
            const to_payment_status = paymentStatus && order.payment_status != paymentStatus
                ? paymentStatus
                : null;
            const to_fulfillment_status = fulfillmentStatus &&
                order.fulfillment_status != fulfillmentStatus
                ? fulfillmentStatus
                : null;
            if (status) {
                order.status = status;
                if (order.fulfillment_status == medusa_1.FulfillmentStatus.FULFILLED) {
                    this.sendDeliveredEmail(order);
                }
            }
            if (fulfillmentStatus) {
                order.fulfillment_status = fulfillmentStatus;
                if (order.fulfillment_status == medusa_1.FulfillmentStatus.SHIPPED) {
                    this.sendShippedEmail(order);
                }
            }
            if (paymentStatus) {
                order.payment_status = paymentStatus;
                if (order.status == medusa_1.OrderStatus.CANCELED) {
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
    async getOrderHistory(orderId) {
        return this.orderHistoryService_.retrieve(orderId);
    }
    async sendOrderEmail(order, requiredNotification, templateName, emailType) {
        var _a;
        try {
            const hasNotification = await this.customerNotificationService_.hasNotification(order.customer_id, requiredNotification);
            if (hasNotification) {
                //get customer & cart
                const customer = await this.customerRepository_.findOne({
                    where: { id: order.customer_id },
                });
                const cart = await this.cartService_.retrieve(order.cart_id);
                //send the mail
                this.smtpMailService_.sendMail({
                    from: (_a = process.env.SMTP_HAMZA_FROM) !== null && _a !== void 0 ? _a : 'support@hamzamarket.com',
                    mailData: {
                        orderId: order.id,
                        orderAmount: (0, price_formatter_1.formatCryptoPrice)(order.total, order.currency_code),
                        orderDate: order.created_at,
                        items: order.items.map((i) => {
                            return {
                                title: i.title,
                                unit_price: (0, price_formatter_1.formatCryptoPrice)(i.unit_price, i.currency_code),
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
        }
        catch (e) {
            this.logger.error(`Error sending ${emailType} email for order ${order.id}`);
        }
    }
    async updatePaymentAfterTransaction(paymentId, update) {
        const result = await this.paymentRepository_.save({
            id: paymentId,
            ...update,
        });
        return result;
    }
    async processBuckydropOrders(cartId, orders) {
        try {
            for (const order of orders) {
                const { variants, quantities } = await this.getBuckyProductVariantsFromOrder(order);
                if (variants === null || variants === void 0 ? void 0 : variants.length) {
                    order.bucky_metadata = { status: 'pending' };
                    await this.orderRepository_.save(order);
                    this.logger.debug('BUCKY CREATED ORDER');
                }
            }
        }
        catch (e) {
            this.logger.error(`Failed to create buckydrop order for ${cartId}`);
        }
    }
    async getCustomerOrdersByStatus(customerId, statusParams) {
        const where = {
            customer_id: customerId,
            status: (0, typeorm_1.Not)((0, typeorm_1.In)([medusa_1.OrderStatus.ARCHIVED, medusa_1.OrderStatus.REQUIRES_ACTION])),
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
        if (orders)
            orders = orders.filter((o) => { var _a; return ((_a = o.items) === null || _a === void 0 ? void 0 : _a.length) > 0; });
        return orders;
    }
    getPostCheckoutUpdatePaymentPromises(payments, transactionId, payerAddress, receiverAddress, escrowAddress, chainId) {
        const promises = [];
        //update payments with transaction info
        payments.forEach((p, i) => {
            promises.push(this.updatePaymentAfterTransaction(p.id, {
                blockchain_data: {
                    transaction_id: transactionId,
                    payer_address: payerAddress,
                    escrow_address: escrowAddress,
                    receiver_address: receiverAddress,
                    chain_id: chainId,
                },
            }));
        });
        return promises;
    }
    getPostCheckoutUpdateOrderPromises(orders) {
        return orders.map((o) => {
            return this.orderRepository_.save({
                id: o.id,
                status: medusa_1.OrderStatus.PENDING,
                payment_status: medusa_1.PaymentStatus.AWAITING,
            });
        });
    }
}
OrderService.LIFE_TIME = awilix_1.Lifetime.SINGLETON; // default, but just to show how to change it
exports.default = OrderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvb3JkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkNBVTBCO0FBUzFCLDJDQUF3QztBQUd4QyxtQ0FBa0M7QUFDbEMscUNBQWtDO0FBQ2xDLDREQUF3RDtBQUV4RCxvREFBZ0U7QUFDaEUsNERBQTBDO0FBRTFDLDhEQUE2RDtBQUk3RCwyR0FBMkc7QUFDM0csNkdBQTZHO0FBQzdHLDRDQUE0QztBQUM1QyxnRUFBZ0U7QUFDaEUsSUFBWSxlQU1YO0FBTkQsV0FBWSxlQUFlO0lBQ3ZCLGlFQUFjLENBQUE7SUFDZCwyREFBVyxDQUFBO0lBQ1gsK0RBQWEsQ0FBQTtJQUNiLCtEQUFhLENBQUE7SUFDYiw2REFBWSxDQUFBO0FBQ2hCLENBQUMsRUFOVyxlQUFlLCtCQUFmLGVBQWUsUUFNMUI7QUFTRCxNQUFxQixZQUFhLFNBQVEscUJBQWtCO0lBa0J4RCxZQUFZLFNBQVM7UUFDakIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBTlgscUJBQWdCLEdBQW9CLElBQUksbUJBQWUsRUFBRSxDQUFDO1FBT2hFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDO1FBQ2xELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUM7UUFDeEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUM7UUFDbEQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQztRQUN4RCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDO1FBQ3RELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUMsaUJBQWlCLENBQUM7UUFDdEQsSUFBSSxDQUFDLHlCQUF5QixHQUFHLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQztRQUNwRSxJQUFJLENBQUMs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