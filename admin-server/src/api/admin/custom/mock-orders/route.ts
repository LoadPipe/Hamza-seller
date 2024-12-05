import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import OrderService from '../../../../services/order';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/admin/custom/mock-orders', ['count', 'date', 'store_id']
    );


    await handler.handle(async () => {
        const { count, date, store_id } = handler.inputParams;

        // Validate input parameters
        if (!count || isNaN(parseInt(count, 10)) || parseInt(count, 10) <= 0) {
            return handler.returnStatusWithMessage(400, 'Invalid count');
        }
        if (!date || isNaN(Date.parse(date))) {
            return handler.returnStatusWithMessage(400, 'Invalid date');
        }
        if (!store_id) {
            return handler.returnStatusWithMessage(400, 'Invalid store_id');
        }

        const order = await orderService.createMockOrders(count, date, store_id);
        if (order === null)
            return handler.returnStatusWithMessage(
                404,
                `FAILED TO CREATE MOCK ORDER`
            );

        return handler.returnStatus(200, order);
    });
};
