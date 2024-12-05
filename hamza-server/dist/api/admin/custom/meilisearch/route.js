"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const route_handler_1 = require("../../../route-handler");
const GET = async (req, res) => {
    let productService = req.scope.resolve('productService');
    const handler = new route_handler_1.RouteHandler(req, res, 'GET', '/admin/custom/meilisearch');
    await handler.handle(async () => {
        const product = await productService.reindexProducts();
        if (product === null)
            return handler.returnStatusWithMessage(404, `Product not found`);
        return handler.returnStatus(200, product);
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9tZWlsaXNlYXJjaC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwwREFBc0Q7QUFHL0MsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ2pFLElBQUksY0FBYyxHQUFtQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBRXpFLE1BQU0sT0FBTyxHQUFHLElBQUksNEJBQVksQ0FDNUIsR0FBRyxFQUNILEdBQUcsRUFDSCxLQUFLLEVBQ0wsMkJBQTJCLENBQzlCLENBQUM7SUFFRixNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDNUIsTUFBTSxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkQsSUFBSSxPQUFPLEtBQUssSUFBSTtZQUNoQixPQUFPLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUVyRSxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBakJXLFFBQUEsR0FBRyxPQWlCZCJ9