import { type MedusaRequest, type MedusaResponse, type Logger, OrderStatus } from '@medusajs/medusa';
import OrderService from '../../../services/order';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');

    const handler = new RouteHandler(req, res, 'GET', '/custom/sharty', [
        'cart_id',
    ]);

    await handler.handle(async () => {
        const orderId = 'order_01JBGDC00CSK25HWG3CS5P4V2P';

        const order = await orderService.retrieve(orderId);

        await orderService.setOrderStatus(order, OrderStatus.COMPLETED, null, null, { 'zert': 21 });

        handler.returnStatus(200, order);
    });
};
