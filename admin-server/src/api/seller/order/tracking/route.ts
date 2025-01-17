import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreOrderService from '../../../../services/store-order';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeOrderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/seller/order/tracking',
        ['order_id', 'tracking_number']
    );

    await handler.handle(async () => {
        //validate parameters
        if (!handler.requireParams(['order_id', 'tracking_number'])) return;

        //get the parameter values
        const orderId = handler.inputParams.order_id;
        const trackingNumber = handler.inputParams.tracking_number;

        //pass to storeOrderService
        await storeOrderService.setOrderTracking(orderId, trackingNumber);

        return handler.returnStatus(200, { hello: 'hi' });
    });
};
