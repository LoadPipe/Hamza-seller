"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const medusa_1 = require("@medusajs/medusa");
const logger_1 = require("../utils/logging/logger");
//TODO: get this enum to work
//export declare enum NotificationType {
//    OrderShipped = 'orderShipped',
//    OrderStatusChanged = 'orderStatusChanged',
//    Email = 'email'
//}
class CustomerNotificationService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.logger = (0, logger_1.createLogger)(container, 'CustomerNotificationSerivce');
        this.customerNotificationRepository =
            container.customerNotificationRepository;
        this.notificationTypeRepository = container.notificationTypeRepository;
    }
    async getNotificationTypes(customerId) {
        try {
            const notification = await this.customerNotificationRepository.findOne({
                where: { customer_id: customerId },
            });
            if (notification && notification.notification_type) {
                return notification.notification_type
                    .split(',')
                    .map((type) => type.trim());
            }
            else {
                return [];
            }
        }
        catch (e) {
            this.logger.error(`Error getting notification: ${e}`);
            throw e;
        }
    }
    async addOrUpdateNotification(customerId, notificationType //TODO should be an array
    ) {
        try {
            const existingNotification = await this.customerNotificationRepository.findOne({
                where: { customer_id: customerId },
            });
            if (existingNotification) {
                // Update the existing notification
                existingNotification.updated_at = new Date();
                existingNotification.notification_type = notificationType;
                const updatedNotification = await this.customerNotificationRepository.save(existingNotification);
                return updatedNotification;
            }
            else {
                // Create a new notification
                const notification = this.customerNotificationRepository.create({
                    customer_id: customerId,
                    notification_type: notificationType,
                });
                const newNotification = await this.customerNotificationRepository.save(notification);
                return newNotification;
            }
        }
        catch (e) {
            this.logger.error(`Error adding or updating notification: ${e}`);
            throw e;
        }
    }
    async removeNotification(customerId) {
        try {
            const existingNotification = await this.customerNotificationRepository.findOne({
                where: { customer_id: customerId },
            });
            if (existingNotification) {
                existingNotification.notification_type = '';
                await this.customerNotificationRepository.save(existingNotification);
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            this.logger.error(`Error removing notification: ${e}`);
            throw e;
        }
    }
    async hasNotification(customerId, notificationType) {
        return this.hasNotifications(customerId, [notificationType]);
    }
    async hasNotifications(customerId, notificationTypes) {
        const notifications = await this.getNotificationTypes(customerId);
        for (let nt of notificationTypes) {
            if (!notifications.includes(nt))
                return false;
        }
        return true;
    }
    async setDefaultNotifications(customerId) {
        await this.addOrUpdateNotification(customerId, 'email,orderShipped,orderStatusChanged');
    }
}
CustomerNotificationService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = CustomerNotificationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItbm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2N1c3RvbWVyLW5vdGlmaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFrQztBQUNsQyw2Q0FBMEQ7QUFHMUQsb0RBQWdFO0FBR2hFLDZCQUE2QjtBQUM3Qix3Q0FBd0M7QUFDeEMsb0NBQW9DO0FBQ3BDLGdEQUFnRDtBQUNoRCxxQkFBcUI7QUFDckIsR0FBRztBQUVILE1BQU0sMkJBQTRCLFNBQVEsK0JBQXNCO0lBTTVELFlBQVksU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsU0FBUyxFQUFFLDZCQUE2QixDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLDhCQUE4QjtZQUMvQixTQUFTLENBQUMsOEJBQThCLENBQUM7UUFDN0MsSUFBSSxDQUFDLDBCQUEwQixHQUFHLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQztJQUMzRSxDQUFDO0lBRUQsS0FBSyxDQUFDLG9CQUFvQixDQUFDLFVBQWtCO1FBQ3pDLElBQUksQ0FBQztZQUNELE1BQU0sWUFBWSxHQUNkLE1BQU0sSUFBSSxDQUFDLDhCQUE4QixDQUFDLE9BQU8sQ0FBQztnQkFDOUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRTthQUNyQyxDQUFDLENBQUM7WUFFUCxJQUFJLFlBQVksSUFBSSxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDakQsT0FBTyxZQUFZLENBQUMsaUJBQWlCO3FCQUNoQyxLQUFLLENBQUMsR0FBRyxDQUFDO3FCQUNWLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDcEMsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLE9BQU8sRUFBRSxDQUFDO1lB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