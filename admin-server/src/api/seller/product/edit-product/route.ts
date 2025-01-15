import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/product/edit-product',
        ['id', 'store_id']
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('store_id')) {
            return;
        }
        if (!handler.requireParam('id')) {
            return;
        }

        const storeId = handler.inputParams.store_id;

        const id = handler.inputParams.id;

        const products = await productService.querySellerProductById(
            id,
            storeId
        );

        return handler.returnStatus(200, products);
    });
};

export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'PATCH',
        '/seller/product/edit-product',
        ['id', 'store_id']
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('store_id')) {
            return;
        }
        if (!handler.requireParam('id')) {
            return;
        }

        const updates = req.body;

        const storeId = handler.inputParams.store_id;

        const id = handler.inputParams.id;

        const products = await productService.querySellerProductByIdForEdit(
            id,
            storeId,
            updates
        );

        return handler.returnStatus(200, products);
    });
};
