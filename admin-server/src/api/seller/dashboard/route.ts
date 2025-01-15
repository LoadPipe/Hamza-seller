import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';

import StoreOrderService from 'src/services/store-order';
import UserRepository from '../../../repositories/user';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeOrderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(req, res, 'GET', '/seller/store/name', [
        'store_id',
        'wallet_address',
    ]);

    await handler.handle(async () => {
        const { store_id, wallet_address } = handler.inputParams;

        if (!store_id) {
            return handler.returnStatus(400, {
                error: "Missing 'store_id' parameter",
            });
        }

        if (!wallet_address) {
            return handler.returnStatus(400, {
                error: "Missing 'wallet_address' parameter",
            });
        }

        handler.logger.debug('finding user...');
        let storeUser = await UserRepository.findOne({
            where: { wallet_address },
        });
        handler.logger.debug('found user ' + storeUser?.id);

        const orderCategoryCounts = await storeOrderService.dashboardDTO(
            handler.inputParams.store_id
        );

        const response = {
            name: `${storeUser.first_name} ${storeUser.last_name}`.trim(),
            ...orderCategoryCounts,
        };

        handler.returnStatus(200, response);
    });
};
