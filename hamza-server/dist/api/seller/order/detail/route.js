"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const route_handler_1 = require("../../../route-handler");
/**
 * Retrieves detailed information about a specific order
 *
 * INPUTS:
 * order_id: string
 */
const GET = async (req, res) => {
    const orderService = req.scope.resolve('storeOrderService');
    const handler = new route_handler_1.RouteHandler(req, res, 'GET', '/seller/order/details', ['order_id']);
    await handler.handle(async () => {
        // Ensure order_id is provided
        if (!handler.requireParam('order_id'))
            return;
        const orderId = handler.inputParams.order_id;
        // Call the service to fetch order details
        const orderDetails = await orderService.getOrderDetails(orderId);
        // Return the order details in the response
        return handler.returnStatus(200, orderDetails);
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3NlbGxlci9vcmRlci9kZXRhaWwvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMERBQXNEO0FBR3REOzs7OztHQUtHO0FBQ0ksTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ2pFLE1BQU0sWUFBWSxHQUFzQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBRS9FLE1BQU0sT0FBTyxHQUFHLElBQUksNEJBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSx1QkFBdUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFFekYsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQzVCLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7WUFBRSxPQUFPO1FBRTlDLE1BQU0sT0FBTyxHQUFXLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBRXJELDBDQUEwQztRQUMxQyxNQUFNLFlBQVksR0FBRyxNQUFNLFlBQVksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakUsMkNBQTJDO1FBQzNDLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFqQlcsUUFBQSxHQUFHLE9BaUJkIn0=