import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import StoreOrderService from '../../../services/store-order';

/**
 * Retrieves a list of orders belonging to a store
 *
 * INPUTS:
 * store_id: string
 * filter: {
 *      { property: value, property: { not|eq|lt|gt|lte|gte: value } }
 * }
 * sort: { col: string, direction: asc | desc}
 * page: number
 * count: number
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(req, res, 'POST', '/seller/order', [
        'store_id',
        'ordersPerPage',
        'page',
        'sort',
        'filter',
    ]);

    await handler.handle(async () => {
        if (!handler.requireParam('store_id')) return;

        const filter: any = handler.inputParams.filter;

        const sortParam = handler.hasParam('sort')
            ? handler.inputParams.sort
            : null;
        const sort: { field: string; direction: 'ASC' | 'DESC' } | null =
            sortParam
                ? (() => {
                      const [field, direction] = sortParam.split(':');
                      console.log('Sort Field:', field); // Log sort field
                      console.log('Sort Direction:', direction); // Log sort direction
                      return {
                          field,
                          direction: direction?.toUpperCase() as 'ASC' | 'DESC',
                      };
                  })()
                : null;
        const page: number = handler.hasParam('page')
            ? parseInt(handler.inputParams.page.toString())
            : 0;
        const ordersPerPage: number = handler.hasParam('ordersPerPage')
            ? parseInt(handler.inputParams.ordersPerPage.toString())
            : 0;

        console.log('Filter:', filter); // Log filter parameters
        console.log('Page:', handler.inputParams.page); // Log pagination values
        console.log('Products Per Page:', handler.inputParams.count); // Log

        const orders = await orderService.getOrdersForStore(
            handler.inputParams.store_id,
            filter,
            sort,
            page,
            ordersPerPage
        );

        return handler.returnStatus(200, orders, 100);
    });
};
