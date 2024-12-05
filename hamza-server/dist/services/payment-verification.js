"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const medusa_1 = require("@medusajs/medusa");
const logger_1 = require("../utils/logging/logger");
const web3_1 = require("../web3");
const currency_config_1 = require("../currency.config");
class PaymentVerificationService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
        this.orderService_ = container.orderService;
        this.logger = (0, logger_1.createLogger)(container, 'PaymentVerificationService');
    }
    async verifyPayments(order_id = null) {
        let output = [];
        let orders = await this.orderService_.getOrdersWithUnverifiedPayments();
        console.log(orders.map(o => o.id));
        if (!(orders === null || orders === void 0 ? void 0 : orders.length)) {
            this.logger.info('No orders with unverified payments were found');
        }
        if (order_id)
            orders = orders.filter(o => o.id == order_id);
        for (let order of orders) {
            this.logger.info(`verifying payment for ${order.id}`);
            output = output.concat(await this.verifyPayment(order));
        }
        return output;
    }
    async verifyPayment(order) {
        var _a, _b, _c;
        let output = [];
        let allPaid = true;
        const payments = order.payments;
        try {
            if (order.payment_status === medusa_1.PaymentStatus.CAPTURED) {
                this.logger.info(`Order ${order.id} payment status ${order.payment_status} is in the wrong state to be verified`);
                return output;
            }
            //verify each payment of order
            let total_paid = BigInt(0);
            let total_expected = BigInt(0);
            for (let payment of payments) {
                this.logger.info(`verifying payment ${payment.id} for order ${order.id}`);
                const chainId = (_b = (_a = payment.blockchain_data) === null || _a === void 0 ? void 0 : _a.chain_id) !== null && _b !== void 0 ? _b : 0;
                const transactionId = (_c = payment.blockchain_data) === null || _c === void 0 ? void 0 : _c.transaction_id;
                //compare amount paid to amount expected 
                total_paid += await (0, web3_1.getAmountPaidForOrder)(chainId, transactionId, order.id, payment.amount);
                const currencyCode = payment.currency_code;
                this.logger.info(`Total paid for ${payment.id} of order ${order.id} is ${total_paid}`);
                //convert to correct number of decimals
                const precision = (0, currency_config_1.getCurrencyPrecision)(currencyCode, chainId);
                total_expected += BigInt(payment.amount * Math.pow(10, precision.native - precision.db));
                //TODO: timezones
                payment.captured_at = new Date();
            }
            this.logger.debug(`expected:, ${total_expected.toString()}`);
            this.logger.debug(`paid:', ${total_paid.toString()}`);
            //update payment_status of order based on paid or not
            allPaid = true; //total_paid >= total_expected;
            const paymentStatus = allPaid ? medusa_1.PaymentStatus.CAPTURED : medusa_1.PaymentStatus.NOT_PAID;
            //save the order
            this.logger.info(`updating order ${order.id}, setting to ${paymentStatus}`);
            order = await this.orderService_.setOrderStatus(order, null, null, paymentStatus, {
                total_expected: total_expected.toString(),
                total_paid: total_paid.toString()
            });
            //TODO: set the payments status to captured
            //TODO: set the payments status to captured
            for (let p of order.payments) {
                output.push({ order: order, payment: p });
            }
        }
        catch (e) {
            this.logger.error(`Error verifying order ${order.id}`, e);
        }
        return output;
    }
}
PaymentVerificationService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = PaymentVerificationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC12ZXJpZmljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvcGF5bWVudC12ZXJpZmljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBa0M7QUFDbEMsNkNBRzBCO0FBQzFCLG9EQUFnRTtBQUtoRSxrQ0FBdUU7QUFDdkUsd0RBQTBEO0FBRTFELE1BQXFCLDBCQUEyQixTQUFRLCtCQUFzQjtJQU0xRSxZQUFZLFNBQVM7UUFDakIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDO1FBQ2xELElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztRQUM1QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxXQUFtQixJQUFJO1FBQ3hDLElBQUksTUFBTSxHQUF5QyxFQUFFLENBQUM7UUFDdEQsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLCtCQUErQixFQUFFLENBQUM7UUFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLE1BQU0sQ0FBQSxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBRUQsSUFBSSxRQUFRO1lBQ1IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENB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