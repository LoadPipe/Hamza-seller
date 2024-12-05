"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const notification_data_handler_1 = __importDefault(require("./notification-data-handler"));
const smtp_mail_1 = __importDefault(require("./smtp-mail"));
const order_data_handler_1 = __importDefault(require("../utils/notification/order-data-handler"));
const logger_1 = require("../utils/logging/logger");
class SmtpNotificationService extends medusa_1.AbstractNotificationService {
    constructor(container) {
        super(container);
        this.notificationDataService = new notification_data_handler_1.default(container);
        this.customerNotificationService_ =
            container.customerNotificationService;
        this.cartService_ = container.cartService;
        this.smtpMailService = new smtp_mail_1.default();
        this.logger = (0, logger_1.createLogger)(container, 'SmtpNotificationService');
        this.orderService_ = container.orderService;
    }
    async sendNotification(event, data, attachmentGenerator) {
        var _a, _b;
        switch (event) {
            case 'order.placed':
                const customerId = data.customerId;
                if (!this.customerNotificationService_.hasNotifications(customerId, ['email', 'orderStatusChanged'])) {
                    return;
                }
                this.logger.info(`sending email to ${JSON.stringify(data)}`);
                let ordersData = await Promise.all(data.orderIds.map(async (orderId) => {
                    return await this.orderService_.retrieve(orderId, {
                        select: [
                            'shipping_total',
                            'discount_total',
                            'tax_total',
                            'refunded_total',
                            'gift_card_total',
                            'subtotal',
                            'total',
                        ],
                        relations: [
                            'customer',
                            'billing_address',
                            'shipping_address',
                            'discounts',
                            'discounts.rule',
                            'shipping_methods',
                            'shipping_methods.shipping_option',
                            'payments',
                            'fulfillments',
                            'returns',
                            'gift_cards',
                            'gift_card_transactions',
                            'store',
                            'items',
                            'cart.items',
                            'cart.items.variant',
                            'cart.items.variant.product',
                        ],
                    });
                }));
                let parsedOrdersData = (0, order_data_handler_1.default)(ordersData);
                const customer = (_a = ordersData[0]) === null || _a === void 0 ? void 0 : _a.customer;
                const cart = await this.cartService_.retrieve((_b = ordersData[0]) === null || _b === void 0 ? void 0 : _b.cart_id);
                const toEmail = (customer === null || customer === void 0 ? void 0 : customer.is_verified)
                    ? customer.email
                    : cart === null || cart === void 0 ? void 0 : cart.email;
                this.logger.info(`sending email to recipient ${toEmail}`);
                if (toEmail) {
                    await this.smtpMailService.sendMail({
                        from: process.env.SMTP_FROM,
                        subject: 'Order Placed on Hamza.market',
                        mailData: parsedOrdersData,
                        to: toEmail,
                        templateName: 'order-placed',
                    });
                    return {
                        to: toEmail,
                        status: 'success',
                        data: data,
                    };
                }
                return null;
            default:
                return null;
        }
    }
    resendNotification(notification, config, attachmentGenerator) {
        throw new Error('Method not implemented.');
    }
}
SmtpNotificationService.identifier = 'smtp-notification';
exports.default = SmtpNotificationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic210cC1ub3RpZmljYXRpb24tcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvc210cC1ub3RpZmljYXRpb24tcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2Q0FLMEI7QUFDMUIsNEZBQWtFO0FBQ2xFLDREQUEwQztBQUMxQyxrR0FBd0U7QUFDeEUsb0RBQWdFO0FBR2hFLE1BQU0sdUJBQXdCLFNBQVEsb0NBQTJCO0lBUzdELFlBQVksU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksbUNBQXVCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLDRCQUE0QjtZQUM3QixTQUFTLENBQUMsMkJBQTJCLENBQUM7UUFDMUMsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQzFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxtQkFBZSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsU0FBUyxFQUFFLHlCQUF5QixDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDO0lBQ2hELENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQ2xCLEtBQWEsRUFDYixJQUFTLEVBQ1QsbUJBQTRCOztRQU01QixRQUFRLEtBQUssRUFBRSxDQUFDO1lBQ1osS0FBSyxjQUFjO2dCQUNmLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ25DLElBQ0ksQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsZ0JBQWdCLENBQy9DLFVBQVUsRUFDVixDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUNsQyxFQUNILENBQUM7b0JBQ0MsT0FBTztnQkFDWCxDQUFDO2dCQUVE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