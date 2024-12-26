import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreService from 'src/services/store';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/store/default-currency',
        ['store_id']
    );

    await handler.handle(async () => {
        if (!handler.inputParams.store_id) {
            return handler.returnStatus(400, {
                error: "Missing 'store_id' parameter",
            });
        }

        const stores = await storeService.getStoreCurrencyById(
            handler.inputParams.store_id
        );

        console.log('store currency', stores);
        handler.returnStatus(200, stores);
    });
};
