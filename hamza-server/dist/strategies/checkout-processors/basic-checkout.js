"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicCheckoutProcessor = void 0;
const logger_1 = require("../../utils/logging/logger");
/**
 * Does basic checkout; can be used as a base class or by itself.
 */
class BasicCheckoutProcessor {
    constructor(container) {
        this.cart = null;
        this.cartId = '';
        this.payments = [];
        this.paymentGroups = [];
        this.orders = [];
        this.idempotencyKeyService = container.idempotencyKeyService;
        this.cartService = container.cartService;
        this.paymentService = container.paymentService;
        this.productService = container.productService;
        this.orderService = container.orderService;
        this.buckydropService = container.buckydropService;
        this.paymentRepository = container.paymentRepository;
        this.orderRepository = container.orderRepository;
        this.lineItemRepository = container.lineItemRepository;
        this.whitelistService = container.whitelistService;
        this.storeRepository = container.storeRepository;
        this.logger = (0, logger_1.createLogger)(container, 'BasicCheckoutProcessor');
    }
    /**
     * @description
     * - breaks up the cart into groups based on store id and currency.
     * - each item group is a unique pairing of store id and currency.
     * - a payment is created for each item group, to pay for that group of items.
     * - an order is created for each payment.
     *
     * @param cartId
     * @returns CartCompletionResponse
     */
    async complete(cartId) {
        try {
            this.cartId = cartId;
            this.logger.debug(`CheckoutProcessor: cart id is ${this.cartId}`);
            await this.doCheckoutSteps();
            //create & return the response
            const response = this.getSuccessResponse();
            return response;
        }
        catch (e) {
            this.logger.error(e);
            const response = {
                response_code: (e === null || e === void 0 ? void 0 : e.code) ? e.code : 500,
                response_body: {
                    payment_count: 0,
                    message: e.toString(),
                    payments: [],
                    cart_id: cartId,
                },
            };
            //return an error response
            this.logger.debug(`checkout response is ${JSON.stringify(response)}`);
            return response;
        }
    }
    /**
     * Override this to change the steps or the order of the steps.
     */
    async doCheckoutSteps() {
        //get the cart
        await this.doRetrieveCart();
        //restrict by whitelist 
        if (await this.customerRestrictedByWhitelist()) {
            throw { code: 401, message: 'Customer not whitelisted' };
        }
        //group payments by store
        await this.doCreateGroups();
        //create payments; one per group
        await this.doCreatePayments();
        //create orders; one per payment
        await this.doCreateOrders();
        //safety check: there should be the same number of orders as groups
        if (this.orders.length != this.paymentGroups.length)
            throw new Error('inconsistency between payment groups and orders');
        //save/update payments with order ids
        await this.updatePaymentFromOrder(this.payments, this.orders);
    }
    /**
     * Override this to change how the cart gets retrieved.
     */
    async doRetrieveCart() {
        this.logger.debug(`CheckoutProcessor: retrieving cart ${this.cartId}`);
        this.cart = await this.cartService.retrieve(this.cartId, {
            relations: [
                'items.variant.product.store',
                'items.variant.prices', //TODO: we need prices?
                'customer'
            ],
        }, null, true);
    }
    /**
     * Override this to change how whitelist restriction is done.
     */
    //TODO: currently checks for one store, but should check ALL stores
    async customerRestrictedByWhitelist() {
        this.logger.debug(`CheckoutProcessor: customerRestrictedByWhitelist ${this.cartId}`);
        if (process.env.RESTRICT_WHITELIST_CHECKOUT) {
            const store = await this.getStore();
            //check whitelist 
            const whitelist = await this.whitelistService.getByCustomerId(store.id, this.cart.customer.id);
            return (whitelist === null || whitelist === void 0 ? void 0 : whitelist.length) == 0;
        }
        return false;
    }
    /**
     * Override this to change how payments get grouped.
     */
    async doCreateGroups() {
        this.logger.debug(`CheckoutProcessor: creating payment groups`);
        this.paymentGroups = this.groupByStore(this.cart);
    }
    /**
     * Override this to change how payments get created.
     */
    async doCreatePayments() {
        this.logger.debug(`CheckoutProcessor: creating payments`);
        this.payments = await this.createCartPayments(this.cart, this.paymentGroups);
    }
    /**
     * Override this to change how orders get created.
     */
    async doCreateOrders() {
        this.logger.debug(`CheckoutProcessor: creating orders`);
        this.orders = await this.createOrdersForPayments(this.cart, this.payments, this.paymentGroups);
    }
    /**
     * Override this to change how a successful response is constructed.
     */
    getSuccessResponse() {
        const response = {
            response_code: 200,
            response_body: {
                payment_count: this.payments.length,
                message: 'payment successful',
                payments: this.payments,
                orders: this.orders,
                cart_id: this.cartId,
            },
        };
        this.logger.debug(`CheckoutProcessor: returning response ${JSON.stringify(response)}`);
        return response;
    }
    createPaymentInput(cart, storeGroup) {
        //divide the cart items
        const itemsFromStore = cart.items.filter((i) => i.currency_code === storeGroup.currency_code);
        //get total amount for the items
        let amount = itemsFromStore.reduce((a, i) => a + i.unit_price * i.quantity, 0);
        //create payment input
        const output = {
            currency_code: storeGroup.currency_code,
            provider_id: 'crypto',
            amount,
            data: {},
        };
        return output;
    }
    //TODO: should get ALL stores 
    async getStore() {
        var _a, _b, _c, _d;
        const storeId = (_d = (_c = (_b = (_a = this.cart.items[0]) === null || _a === void 0 ? void 0 : _a.variant) === null || _b === void 0 ? void 0 : _b.product) === null || _c === void 0 ? void 0 : _c.store) === null || _d === void 0 ? void 0 : _d.id;
        if (storeId) {
            return this.storeRepository.findOne({ where: { id: storeId }, relations: ['owner'] });
        }
        return null;
    }
    groupByStore(cart) {
        //temp holding for groups
        const storeGroups = {};
        if (cart && cart.items) {
            cart.items.forEach(async (i) => {
                var _a, _b;
                //create key from unique store/currency pair
                const currency = i.currency_code;
                const store = (_b = (_a = i.variant) === null || _a === void 0 ? void 0 : _a.product) === null || _b === void 0 ? void 0 : _b.store;
                const key = store.id;
                //create new group, or add item id to existing group
                if (!storeGroups[key]) {
                    storeGroups[key] = {
                        items: [],
                        total: BigInt(0),
                        currency_code: currency,
                        store: store,
                    };
                }
                storeGroups[key].items.push(i);
                storeGroups[key].total += BigInt(i.unit_price * i.quantity);
            });
        }
        return Object.keys(storeGroups).map((key) => storeGroups[key]);
    }
    async createCartPayments(cart, paymentGroups) {
        //calculate shipping cost
        const shippingCost = await this.buckydropService.calculateShippingPriceForCart(cart.id);
        //for each unique group, make payment input to create a payment
        const paymentInputs = [];
        paymentGroups.forEach((group) => {
            const input = this.createPaymentInput(cart, group);
            input.amount += shippingCost;
            paymentInputs.push(input);
        });
        //create the payments
        const promises = [];
        for (let i = 0; i < paymentInputs.length; i++) {
            promises.push(this.paymentService.create(paymentInputs[i]));
        }
        const payments = await Promise.all(promises);
        return payments;
    }
    async createOrdersForPayments(cart, payments, paymentGroups) {
        var _a;
        const promises = [];
        for (let i = 0; i < payments.length; i++) {
            promises.push(this.orderService.createFromPayment(cart, payments[i], (_a = paymentGroups[i].store) === null || _a === void 0 ? void 0 : _a.id));
        }
        const orders = await Promise.all(promises);
        return orders;
    }
    async updatePaymentFromOrder(payments, orders) {
        const promises = [];
        //function to update a single payment
        const updatePayment = async (payment, order) => {
            var _a, _b, _c;
            const fullOrder = await this.orderService.getOrderWithStore(order.id);
            payment.order_id = order.id;
            payment.cart_id = order.cart_id;
            if (payment.blockchain_data) {
                payment.blockchain_data.receiver_address =
                    (_c = (_b = (_a = fullOrder.store) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.wallet_address) !== null && _c !== void 0 ? _c : 'NA';
            }
            return await this.paymentRepository.save(payment);
        };
        //update each payment
        for (let n = 0; n < payments.length; n++) {
            if (orders.length > n) {
                promises.push(updatePayment(payments[n], orders[n]));
            }
        }
        await Promise.all(promises);
    }
}
exports.BasicCheckoutProcessor = BasicCheckoutProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtY2hlY2tvdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3RyYXRlZ2llcy9jaGVja291dC1wcm9jZXNzb3JzL2Jhc2ljLWNoZWNrb3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXNCQSx1REFBbUU7QUFVbkU7O0dBRUc7QUFDSCxNQUFhLHNCQUFzQjtJQW1CL0IsWUFBWSxTQUFTO1FBTlgsU0FBSSxHQUFTLElBQUksQ0FBQztRQUNsQixXQUFNLEdBQVcsRUFBRSxDQUFDO1FBQ3BCLGFBQVEsR0FBYyxFQUFFLENBQUM7UUFDekIsa0JBQWEsR0FBd0IsRUFBRSxDQUFDO1FBQ3hDLFdBQU0sR0FBWSxFQUFFLENBQUM7UUFHM0IsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQztRQUM3RCxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDekMsSUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDO1FBQy9DLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQztRQUMvQyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUM7UUFDM0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNuRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDO1FBQ3JELElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztRQUNqRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDO1FBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUM7UUFDbkQsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLEdBQUcs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