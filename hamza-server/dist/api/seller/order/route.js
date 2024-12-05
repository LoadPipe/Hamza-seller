"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const route_handler_1 = require("../../route-handler");
/**
 * Retrieves a list of orders belonging to a store
 *
 * INPUTS:
 * store_id: string
 * filter: {
 *      { property: value, property: { not|eq|lt|gt|lte|gte: value } }
 * }
 * sort: { col: string, direction: asc | desc}
 * page: number
 * count: number
 */
const POST = async (req, res) => {
    const orderService = req.scope.resolve('storeOrderService');
    const handler = new route_handler_1.RouteHandler(req, res, 'POST', '/seller/order', [
        'store_id',
        'ordersPerPage',
        'page',
        'sort',
        'filter',
    ]);
    await handler.handle(async () => {
        if (!handler.requireParam('store_id'))
            return;
        const filter = handler.inputParams.filter;
        const sort = handler.hasParam('sort')
            ? handler.inputParams.sort
            : null;
        const page = handler.hasParam('page')
            ? parseInt(handler.inputParams.page.toString())
            : 0;
        const ordersPerPage = handler.hasParam('ordersPerPage')
            ? parseInt(handler.inputParams.ordersPerPage.toString())
            : 0;
        const store_id = handler.inputParams.store_id;
        const orders = await orderService.getOrdersForStore(handler.inputParams.store_id, filter, sort, page, ordersPerPage);
        return handler.returnStatus(200, orders);
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL3NlbGxlci9vcmRlci9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1REFBbUQ7QUFHbkQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSSxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbEUsTUFBTSxZQUFZLEdBQ2QsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUUzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLDRCQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFO1FBQ2hFLFVBQVU7UUFDVixlQUFlO1FBQ2YsTUFBTTtRQUNOLE1BQU07UUFDTixRQUFRO0tBQ1gsQ0FBQyxDQUFDO0lBRUgsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztZQUFFLE9BQU87UUFFOUMsTUFBTSxNQUFNLEdBQVEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDL0MsTUFBTSxJQUFJLEdBQVEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDdEMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSTtZQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1gsTUFBTSxJQUFJLEdBQVcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDekMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1IsTUFBTSxhQUFhLEdBQVcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7WUFDM0QsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN4RCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7UUFFOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLENBQUMsaUJBQWlCLENBQy9DLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUM1QixNQUFNLEVBQ04sSUFBSSxFQUNKLElBQUksRUFDSixhQUFhLENBQ2hCLENBQUM7UUFFRixPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBdENXLFFBQUEsSUFBSSxRQXNDZiJ9