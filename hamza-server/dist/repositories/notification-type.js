"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTypeRepository = void 0;
const notification_type_1 = require("../models/notification-type");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
exports.NotificationTypeRepository = database_1.dataSource
    .getRepository(notification_type_1.NotificationType)
    .extend({
    ...Object.assign(notification_type_1.NotificationType, {
        target: notification_type_1.NotificationType,
    }),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLXR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL25vdGlmaWNhdGlvbi10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1FQUErRDtBQUMvRCxxRUFBb0U7QUFFdkQsUUFBQSwwQkFBMEIsR0FBRyxxQkFBVTtLQUMvQyxhQUFhLENBQUMsb0NBQWdCLENBQUM7S0FDL0IsTUFBTSxDQUFDO0lBQ0osR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLG9DQUFnQixFQUFFO1FBQy9CLE1BQU0sRUFBRSxvQ0FBZ0I7S0FDM0IsQ0FBQztDQUNMLENBQUMsQ0FBQyJ9