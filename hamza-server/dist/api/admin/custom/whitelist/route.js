"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const route_handler_1 = require("../../../route-handler");
const GET = async (req, res) => {
    const storeService = req.scope.resolve('storeService');
    const whitelistService = req.scope.resolve('whitelistService');
    const setUpWhitelist = async (storeName) => {
        const store = await storeService.getStoreByName(storeName);
        const whitelistAddresses = [
            '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A',
        ];
        console.log(store.id);
        if (store) {
            await Promise.all(whitelistAddresses.map(a => {
                return whitelistService.create(store.id, a);
            }));
        }
    };
    const handler = new route_handler_1.RouteHandler(req, res, 'GET', '/admin/custom/whitelist');
    await handler.handle(async () => {
        var _a;
        await setUpWhitelist((_a = handler.inputParams.store) !== null && _a !== void 0 ? _a : '');
        res.json({});
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS93aGl0ZWxpc3Qvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMERBQXNEO0FBSS9DLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNqRSxNQUFNLFlBQVksR0FBaUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDckUsTUFBTSxnQkFBZ0IsR0FBcUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUVqRixNQUFNLGNBQWMsR0FBRyxLQUFLLEVBQUUsU0FBaUIsRUFBRSxFQUFFO1FBQy9DLE1BQU0sS0FBSyxHQUFHLE1BQU0sWUFBWSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzRCxNQUFNLGtCQUFrQixHQUFHO1lBQ3ZCLDRDQUE0QztTQUMvQyxDQUFDO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFdEIsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3pDLE9BQU8sZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDL0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUM7SUFDTCxDQUFDLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBaUIsSUFBSSw0QkFBWSxDQUMxQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSx5QkFBeUIsQ0FDN0MsQ0FBQztJQUVGLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRTs7UUFDNUIsTUFBTSxjQUFjLENBQUMsTUFBQSxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssbUNBQUksRUFBRSxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQTNCVyxRQUFBLEdBQUcsT0EyQmQifQ==