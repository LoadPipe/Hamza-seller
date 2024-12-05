"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = void 0;
const route_handler_1 = require("../../../../route-handler");
const PUT = async (req, res) => {
    const orderService = req.scope.resolve('orderService');
    const buckyService = req.scope.resolve('buckydropService');
    const handler = new route_handler_1.RouteHandler(req, res, 'PUT', '/admin/custom/bucky/track', ['order_id']);
    await handler.handle(async () => {
        let output = { count: 0, orders: [] };
        let orders = [];
        if (handler.hasParam('order_id')) {
            output.count = 1;
            output.orders.push(await buckyService.reconcileOrderStatus(handler.inputParams.order_id));
        }
        else {
            orders = await buckyService.getOrdersToTrack();
            output.count = orders.length;
            for (let order of orders) {
                output.orders.push(await buckyService.reconcileOrderStatus(order.id));
            }
        }
        return handler.returnStatus(201, { output });
    });
};
exports.PUT = PUT;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9idWNreS90cmFjay9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2REFBeUQ7QUFHbEQsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ2pFLE1BQU0sWUFBWSxHQUFpQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyRSxNQUFNLFlBQVksR0FDZCxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRTFDLE1BQU0sT0FBTyxHQUFpQixJQUFJLDRCQUFZLENBQzFDLEdBQUcsRUFDSCxHQUFHLEVBQ0gsS0FBSyxFQUNMLDJCQUEyQixFQUMzQixDQUFDLFVBQVUsQ0FBQyxDQUNmLENBQUM7SUFFRixNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDNUIsSUFBSSxNQUFNLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUN0QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDL0IsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxZQUFZLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzlGLENBQUM7YUFDSSxDQUFDO1lBQ0YsTUFBTSxHQUFHLE1BQU0sWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFFL0MsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzdCLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sWUFBWSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFFLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFoQ1csUUFBQSxHQUFHLE9BZ0NkIn0=