import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/product/categories'
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided

        const queryProductCategories =
            await productService.queryAllCategories();

        return handler.returnStatus(200, queryProductCategories);
    });
};
