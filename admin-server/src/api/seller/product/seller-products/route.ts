import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/product/seller-products'
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('store_id')) {
            return;
        }

        // Return the updated order details in the response
        return handler.returnStatus(
            200,
            await productService.getProductsForAdmin(
                handler.inputParams.store_id
            )
        );
    });
};
