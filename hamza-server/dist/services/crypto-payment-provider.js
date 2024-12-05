"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa"); //TODO: need?
const logger_1 = require("../utils/logging/logger");
/**
 * @description This is being used as a test right now for payment processing using
 * crypto wallets; if used it will be changed alot. Right now only a test.
 * @author John R. Kosinski
 */
class CryptoPaymentService extends medusa_1.AbstractPaymentProcessor {
    constructor(container, config) {
        //this.logger.debug(config);
        super(container, config);
        this.cartService = container.cartService;
        this.logger = (0, logger_1.createLogger)(container, 'CryptoPaymentService');
        this.logger.debug('CryptoPaymentService::config');
    }
    async capturePayment(paymentSessionData) {
        this.logger.debug('CryptoPaymentService: capturePayment');
        //this.logger.debug(paymentSessionData);
        return {
            session_data: paymentSessionData,
        };
    }
    async authorizePayment(paymentSessionData, context) {
        this.logger.debug('CryptoPaymentService: authorizePayment');
        //this.logger.debug(paymentSessionData);
        let payment_status = paymentSessionData.payment_status;
        if (!payment_status)
            payment_status = 'ok';
        return {
            status: payment_status == 'ok'
                ? medusa_1.PaymentSessionStatus.AUTHORIZED
                : medusa_1.PaymentSessionStatus.ERROR,
            data: {
                session_data: paymentSessionData,
            },
        };
    }
    async cancelPayment(paymentSessionData) {
        this.logger.debug('CryptoPaymentService: cancelPayment');
        return {
            session_data: paymentSessionData,
        };
    }
    async initiatePayment(context) {
        var _a;
        this.logger.debug('CryptoPaymentService: initiatePayment');
        //this.logger.debug(context);
        //get the store id
        let walletAddresses = [];
        if (context.resource_id ||
            !((_a = context.paymentSessionData) === null || _a === void 0 ? void 0 : _a.wallet_address) ||
            !context.paymentSessionData.wallet_address.toString().length) {
            walletAddresses = await this.getCartWalletAddresses(context.resource_id.toString());
        }
        const { email, currency_code, amount, resource_id, customer } = context;
        const session_data = {
            amount: Math.round(100),
            currency: 'USD',
            notes: { resource_id },
            wallet_addresses: walletAddresses.join(','),
            payment: {
                capture: 'manual',
                payment_status: 'ok',
                capture_options: {
                    refund_speed: 'normal',
                    automatic_expiry_period: 5,
                    manual_expiry_period: 10,
                },
            },
        };
        return {
            session_data: session_data,
        };
    }
    async deletePayment(paymentSessionData) {
        this.logger.debug('CryptoPaymentService: deletePayment');
        //this.logger.debug(paymentSessionData);
        return {
            session_data: paymentSessionData,
        };
    }
    async getPaymentStatus(paymentSessionData) {
        var _a, _b, _c;
        this.logger.debug('CryptoPaymentService: getPaymentStatus');
        //this.logger.debug(paymentSessionData);
        try {
            const payment_status = (_c = (_b = (_a = paymentSessionData.session_data['session_data']) === null || _a === void 0 ? void 0 : _a.payment) === null || _b === void 0 ? void 0 : _b.payment_status) !== null && _c !== void 0 ? _c : '';
            this.logger.debug(payment_status);
            return payment_status === 'failed'
                ? medusa_1.PaymentSessionStatus.ERROR
                : medusa_1.PaymentSessionStatus.AUTHORIZED;
        }
        catch (e) {
            this.logger.error(e);
        }
        return medusa_1.PaymentSessionStatus.AUTHORIZED;
    }
    async refundPayment(paymentSessionData, refundAmount) {
        this.logger.debug('CryptoPaymentService: refundPayment');
        //this.logger.debug(paymentSessionData);
        return {
            session_data: paymentSessionData,
        };
    }
    async retrievePayment(paymentSessionData) {
        this.logger.debug('CryptoPaymentService: retrievePayment');
        //this.logger.debug(paymentSessionData);
        return {
            session_data: paymentSessionData,
        };
    }
    async updatePayment(context) {
        this.logger.debug('CryptoPaymentService: updatePayment');
        //this.logger.debug(context);
        return this.initiatePayment(context);
    }
    async updatePaymentData(sessionId, data) {
        this.logger.debug('CryptoPaymentService: updatePaymentData');
        return {
            session_data: {
                method: 'updatePaymentData',
                actor: 'stephen chow',
                sessionId: sessionId,
            },
        };
    }
    async getCartWalletAddresses(cartId) {
        const output = [];
        try {
            //get cart; cart has items, items have variants, variants have products,
            // products have stores, stores have owners, owners have wallets
            const cart = await this.cartService.retrieve(cartId, {
                relations: ['items.variant.product.store.owner'],
            });
            //add unique wallet addresses to output
            if (cart && cart.items) {
                cart.items.forEach((i) => {
                    var _a, _b, _c, _d;
                    const wallet = (_d = (_c = (_b = (_a = i.variant) === null || _a === void 0 ? void 0 : _a.product) === null || _b === void 0 ? void 0 : _b.store) === null || _c === void 0 ? void 0 : _c.owner) === null || _d === void 0 ? void 0 : _d.wallet_address;
                    if (wallet && output.findIndex((s) => s === wallet) < 0) {
                        output.push(wallet);
                    }
                });
            }
        }
        catch (e) {
            this.logger.error(e);
        }
        return output;
    }
}
CryptoPaymentService.identifier = 'crypto';
exports.default = CryptoPaymentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5cHRvLXBheW1lbnQtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvY3J5cHRvLXBheW1lbnQtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FTMEIsQ0FBQyxhQUFhO0FBQ3hDLG9EQUFnRTtBQUVoRTs7OztHQUlHO0FBQ0gsTUFBTSxvQkFBcUIsU0FBUSxpQ0FBd0I7SUFLdkQsWUFBWSxTQUFTLEVBQUUsTUFBTTtRQUN6Qiw0QkFBNEI7UUFDNUIsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FDaEIsa0JBQTJDO1FBSTNDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDMUQsd0NBQXdDO1FBQ3hDLE9BQU87WUFDSCxZQUFZLEVBQUUsa0JBQWtCO1NBQ25DLENBQUM7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLGdCQUFnQixDQUNsQixrQkFBMkMsRUFDM0MsT0FBZ0M7UUFRaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUM1RCx3Q0FBd0M7UUFDeEMsSUFBSSxjQUFjLEdBQUcsa0JBQWtCLENBQUMsY0FBYyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxjQUFjO1lBQUUsY0FBYyxHQUFHLElBQUksQ0FBQztRQUUzQyxPQUFPO1lBQ0gsTUFBTSxFQUNGLGNBQWMsSUFBSSxJQUFJO2dCQUNsQixDQUFDLENBQUMs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