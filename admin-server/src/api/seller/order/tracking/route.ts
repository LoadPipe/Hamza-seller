import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreOrderService from '../../../../services/store-order';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(
        req,
        res,
        'PUT',
        '/seller/order/tracking',
        ['order_id', 'tracking_number']
    );

    await handler.handle(async () => {
        return handler.returnStatus(200, { hello: 'hi' });
    });
};
