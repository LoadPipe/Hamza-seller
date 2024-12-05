"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const medusa_1 = require("@medusajs/medusa");
const route_handler_1 = require("../../../route-handler");
const POST = async (req, res) => {
    const shippingOptionRepository = req.scope.resolve('shippingOptionRepository');
    const countryRepository = req.scope.resolve('countryRepository');
    const regionRepository = req.scope.resolve('regionRepository');
    const fulfillmentRepository = req.scope.resolve('fulfillmentProviderRepository');
    const handler = new route_handler_1.RouteHandler(req, res, 'GET', '/admin/custom/setup');
    await handler.handle(async () => {
        //get default region 
        console.log('getting region');
        const region = await regionRepository.findOne({ where: { name: 'NA' } });
        //add new country code 
        try {
            const existingCountry = await countryRepository.findOne({ where: { iso_2: 'en' } });
            if (!existingCountry) {
                const newCountry = countryRepository.create({
                    id: 1066,
                    num_code: 1066,
                    iso_2: 'en',
                    iso_3: 'eng',
                    name: 'EN',
                    display_name: 'Numenor',
                    region_id: region.id
                });
                await countryRepository.save(newCountry);
            }
        }
        catch (e) {
            handler.logger.error('Error adding country for EN', e);
        }
        //modify existing shipping option
        try {
            const shippingOption = await shippingOptionRepository.findOne({ where: { name: 'Provider Calculated' } });
            shippingOption.price_type = medusa_1.ShippingOptionPriceType.CALCULATED;
            shippingOption.provider_id = 'bucky-fulfillment';
            await shippingOptionRepository.save(shippingOption);
        }
        catch (e) {
            handler.logger.error('Error adding shipping option', e);
        }
        //sort out region fulfillment providers 
        try {
            const fulfillmentProvider = await fulfillmentRepository.findOne({ where: { id: 'bucky-fulfillment' } });
            if (fulfillmentProvider) {
                region.fulfillment_providers = [fulfillmentProvider];
                await regionRepository.save(region);
            }
        }
        catch (e) {
            handler.logger.error('Error adding fulfillment provider to region', e);
        }
        return handler.returnStatusWithMessage(200, 'ok');
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2N1c3RvbS9zZXR1cC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMkc7QUFDM0csMERBQXNEO0FBTS9DLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNsRSxNQUFNLHdCQUF3QixHQUFvQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBQ2hILE1BQU0saUJBQWlCLEdBQTZCLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDM0YsTUFBTSxnQkFBZ0IsR0FBNEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN4RixNQUFNLHFCQUFxQixHQUF5QyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBRXZILE1BQU0sT0FBTyxHQUFpQixJQUFJLDRCQUFZLENBQzFDLEdBQUcsRUFDSCxHQUFHLEVBQ0gsS0FBSyxFQUNMLHFCQUFxQixDQUN4QixDQUFDO0lBR0YsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBRTVCLHFCQUFxQjtRQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXpFLHVCQUF1QjtRQUN2QixJQUFJLENBQUM7WUFDRCxNQUFNLGVBQWUsR0FBRyxNQUFNLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFcEYsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUNuQixNQUFNLFVBQVUsR0FBWSxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7b0JBQ2pELEVBQUUsRUFBRSxJQUFJO29CQUNSLFFBQVEsRUFBRSxJQUFJO29CQUNkLEtBQUssRUFBRSxJQUFJO29CQUNYLEtBQUssRUFBRSxLQUFLO29CQUNaLElBQUksRUFBRSxJQUFJO29CQUNWLFlBQVksRUFBRSxTQUFTO29CQUN2QixTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUU7aUJBQ3ZCLENBQUMsQ0FBQztnQkFFSCxNQUFNLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM3QyxDQUFDO1FBQ0wsQ0FBQztRQUNELE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDUCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBR0QsaUNBQWlDO1FBQ2pDLElBQUksQ0FBQztZQUNELE1BQU0sY0FBYyxHQUFHLE1BQU0sd0JBQXdCLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFHLGNBQWMsQ0FBQyxVQUFVLEdBQUcsZ0NBQXVCLENBQUMsVUFBVSxDQUFDO1lBQy9ELGNBQWMsQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLENBQUM7WUFFakQsTUFBTSx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDUCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBR0Qsd0NBQXdDO1FBQ3hDLElBQUksQ0FBQztZQUNELE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDeEcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO2dCQUN0QixNQUFNLENBQUMscUJBQXFCLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNyRCxNQUFNLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QyxDQUFDO1FBQ0wsQ0FBQztRQUNELE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDUCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw2Q0FBNkMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRSxDQUFDO1FBRUQsT0FBTyxPQUFPLENBQUMsdUJBQXVCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBdEVXLFFBQUEsSUFBSSxRQXNFZiJ9