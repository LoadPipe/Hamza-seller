import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreService from 'src/services/store';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(req, res, 'GET', '/seller/store/name', [
        'wallet_address',
    ]);

    await handler.handle(async () => {
        if (!handler.inputParams.owner_id) {
            return handler.returnStatus(400, {
                error: "Missing 'owner_id' parameter",
            });
        }

        const stores = await storeService.getStoreNamesByOwnerId(
            handler.inputParams.wallet_address
        );
        handler.returnStatus(200, stores);
    });
};
