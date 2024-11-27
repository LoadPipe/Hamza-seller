import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import ProductService from '../../../services/product';

/**
 * Retrieves a list of products belonging to a store
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
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(req, res, 'GET', '/seller/product', [
        'store_id',
        'recordsPerPage',
        'page',
        'sort',
        'filter',
    ]);

    await handler.handle(async () => {
        return handler.returnStatus(200, []);
    });
};
