"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = exports.GET = void 0;
const route_handler_1 = require("../../../../route-handler");
const GET = async (req, res) => {
    const buckydropService = req.scope.resolve('buckydropService');
    const handler = new route_handler_1.RouteHandler(req, res, 'GET', '/admin/custom/bucky/orders');
    await handler.handle(async () => {
        const orders = await buckydropService.getOrdersToProcess();
        return handler.returnStatus(200, { orders });
    });
};
exports.GET = GET;
const PUT = async (req, res) => {
    const buckydropService = req.scope.resolve('buckydropService');
    const handler = new route_handler_1.RouteHandler(req, res, 'PUT', '/admin/custom/bucky/orders', ['order_id']);
    await handler.handle(async () => {
        let orderId;
        if (handler.hasParam('order_id'))
            orderId = handler.inputParams.order_id;
        let orders = await buckydropService.getOrdersToProcess();
        if (orderId) {
            orders = orders.filter(o => o.id === orderId);
        }
        if (!(orders === null || orders === void 0 ? void 0 : orders.length)) {
            if (orderId)
                res.status(400).json({ message: `Order ${orderId} isn't valid or isn't a buckydrop pending order` });
            else
                res.status(400).json({ message: `No pending buckydrop orders found` });
        }
        //process all selected orders 
        //const promises: Promise<Order>[] = [];
        const output = [];
        for (let order of orders) {
            //promises.push(new Promise(async (resolve, reject) => {
            //    handler.logger.debug(`Processing order ${orderId}`);
            //     resolve(await buckydropService.processPendingOrder(order.id));
            //}))
            handler.logger.debug(`Processing order ${orderId}`);
            output.push(await buckydropService.processPendingOrder(order.id));
        }
        //orders = await Promise.all(promises);
        return handler.returnStatus(200, { orders: output });
    });
};
exports.PUT = PUT;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9idWNreS9vcmRlcnMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkRBQXlEO0FBR2xELE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNqRSxNQUFNLGdCQUFnQixHQUFxQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRWpGLE1BQU0sT0FBTyxHQUFpQixJQUFJLDRCQUFZLENBQzFDLEdBQUcsRUFDSCxHQUFHLEVBQ0gsS0FBSyxFQUNMLDRCQUE0QixDQUMvQixDQUFDO0lBRUYsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQzVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUUzRCxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQWZXLFFBQUEsR0FBRyxPQWVkO0FBRUssTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ2pFLE1BQU0sZ0JBQWdCLEdBQXFCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFFakYsTUFBTSxPQUFPLEdBQWlCLElBQUksNEJBQVksQ0FDMUMsR0FBRyxFQUNILEdBQUcsRUFDSCxLQUFLLEVBQ0wsNEJBQTRCLEVBQzVCLENBQUMsVUFBVSxDQUFDLENBQ2YsQ0FBQztJQUVGLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRTtRQUM1QixJQUFJLE9BQWUsQ0FBQztRQUNwQixJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1lBQzVCLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUUzQyxJQUFJLE1BQU0sR0FBRyxNQUFNLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDekQsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNWLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBRUQsSUFBSSxDQUFDLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLE1BQU0sQ0FBQSxFQUFFLENBQUM7WUFDbEIsSUFBSSxPQUFPO2dCQUNQLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsT0FBTyxpREFBaUQsRUFBRSxDQUFDLENBQUM7O2dCQUVyRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUVELDhCQUE4QjtRQUM5Qix3Q0FBd0M7UUFDeEMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWxCLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFLENBQUM7WUFDdkIsd0RBQXdEO1lBQ3hELDBEQUEwRDtZQUMxRCxxRUFBcUU7WUFDckUsS0FBSztZQUNMLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBQ0QsdUNBQXVDO1FBRXZDLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQTVDVyxRQUFBLEdBQUcsT0E0Q2QifQ==