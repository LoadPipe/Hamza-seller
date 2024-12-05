"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const medusa_1 = require("@medusajs/medusa");
const route_handler_1 = require("../../../../route-handler");
const GET = async (req, res) => {
    const shippingOptionRepository = req.scope.resolve('shippingOptionRepository');
    const handler = new route_handler_1.RouteHandler(req, res, 'GET', '/admin/custom/bucky/setup');
    await handler.handle(async () => {
        const shippingOption = await shippingOptionRepository.findOne({
            where: { data: { id: 'bucky-fulfillment' } },
        });
        shippingOption.provider_id = 'bucky-fulfillment';
        shippingOption.price_type = medusa_1.ShippingOptionPriceType.CALCULATED;
        const output = await shippingOptionRepository.save(shippingOption);
        return handler.returnStatus(201, { output });
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9idWNreS9zZXR1cC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FJMEI7QUFDMUIsNkRBQXlEO0FBR2xELE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNqRSxNQUFNLHdCQUF3QixHQUMxQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBRWxELE1BQU0sT0FBTyxHQUFpQixJQUFJLDRCQUFZLENBQzFDLEdBQUcsRUFDSCxHQUFHLEVBQ0gsS0FBSyxFQUNMLDJCQUEyQixDQUM5QixDQUFDO0lBRUYsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQzVCLE1BQU0sY0FBYyxHQUFHLE1BQU0sd0JBQXdCLENBQUMsT0FBTyxDQUFDO1lBQzFELEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxFQUFFO1NBQy9DLENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLENBQUM7UUFDakQsY0FBYyxDQUFDLFVBQVUsR0FBRyxnQ0FBdUIsQ0FBQyxVQUFVLENBQUM7UUFFL0QsTUFBTSxNQUFNLEdBQUcsTUFBTSx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkUsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUF2QlcsUUFBQSxHQUFHLE9BdUJkIn0=