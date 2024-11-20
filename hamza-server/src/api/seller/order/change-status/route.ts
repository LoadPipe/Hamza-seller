import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreOrderService from '../../../../services/store-order';

/**
 * Updates the statuses of a specific order (status, fulfillment, payment) and optionally adds a note.
 *
 * INPUTS:
 * - order_id: string
 * - status: string (order status)
 * - fulfillment_status: string (fulfillment status)
 * - payment_status: string (payment status)
 * - note: optional JSON object
 */
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(
        req,
        res,
        'PUT',
        '/seller/order/change-status',
        ['order_id', 'status', 'note']
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (
            !handler.requireParam('order_id') ||
            !handler.requireParam('status')
        ) {
            return;
        }

        const { order_id, status, note } = handler.inputParams;

        // Call the service to update the order statuses
        const updatedOrder = await orderService.changeOrderStatus(
            order_id,
            status,
            note
        );

        // Return the updated order details in the response
        return handler.returnStatus(200, updatedOrder);
    });
};
