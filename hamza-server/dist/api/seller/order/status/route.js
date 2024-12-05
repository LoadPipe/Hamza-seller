"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = void 0;
const route_handler_1 = require("../../../route-handler");
/**
 * Updates the statuses of a specific order (status, fulfillment, payment) and optionally adds a note.
 *
 * INPUTS:
 * - order_id: string
 * - status: string (order status)
 * - fulfillment_status: string (fulfillment status)
 * - payment_status: string (payment status)
 * - note: optional JSON object
 */
const PUT = async (req, res) => {
    const orderService = req.scope.resolve('storeOrderService');
    const handler = new route_handler_1.RouteHandler(req, res, 'PUT', '/seller/order/status', [
        'order_id',
        'status',
        'note',
    ]);
    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('order_id') ||
            !handler.requireParam('status')) {
            return;
        }
        const { order_id, status, note } = handler.inputParams;
        // Call the service to update the order statuses
        const updatedOrder = await orderService.changeOrderStatus(order_id, status, note);
        // Return the updated order details in the response
        return handler.returnStatus(200, updatedOrder);
    });
};
exports.PUT = PUT;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3NlbGxlci9vcmRlci9zdGF0dXMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMERBQXNEO0FBR3REOzs7Ozs7Ozs7R0FTRztBQUNJLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNqRSxNQUFNLFlBQVksR0FDZCxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBRTNDLE1BQU0sT0FBTyxHQUFHLElBQUksNEJBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRTtRQUN0RSxVQUFVO1FBQ1YsUUFBUTtRQUNSLE1BQU07S0FDVCxDQUFDLENBQUM7SUFFSCxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDNUIsMENBQTBDO1FBQzFDLElBQ0ksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztZQUNqQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQ2pDLENBQUM7WUFDQyxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFFdkQsZ0RBQWdEO1FBQ2hELE1BQU0sWUFBWSxHQUFHLE1BQU0sWUFBWSxDQUFDLGlCQUFpQixDQUNyRCxRQUFRLEVBQ1IsTUFBTSxFQUNOLElBQUksQ0FDUCxDQUFDO1FBRUYsbURBQW1EO1FBQ25ELE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUEvQlcsUUFBQSxHQUFHLE9BK0JkIn0=