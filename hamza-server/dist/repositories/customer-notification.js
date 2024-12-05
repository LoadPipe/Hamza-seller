"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerNotificationRepository = void 0;
const customer_notification_1 = require("../models/customer-notification");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
exports.CustomerNotificationRepository = database_1.dataSource
    .getRepository(customer_notification_1.CustomerNotification)
    .extend({
    ...Object.assign(customer_notification_1.CustomerNotification, {
        target: customer_notification_1.CustomerNotification,
    }),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItbm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9jdXN0b21lci1ub3RpZmljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkVBQXVFO0FBQ3ZFLHFFQUFvRTtBQUV2RCxRQUFBLDhCQUE4QixHQUFHLHFCQUFVO0tBQ25ELGFBQWEsQ0FBQyw0Q0FBb0IsQ0FBQztLQUNuQyxNQUFNLENBQUM7SUFDSixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsNENBQW9CLEVBQUU7UUFDbkMsTUFBTSxFQUFFLDRDQUFvQjtLQUMvQixDQUFDO0NBQ0wsQ0FBQyxDQUFDIn0=