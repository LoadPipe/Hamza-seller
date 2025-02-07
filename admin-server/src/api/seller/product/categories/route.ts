import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreProductService from '../../../../services/store-product';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeProductService: StoreProductService = req.scope.resolve(
        'storeProductService'
    );
    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/product/categories'
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided

        const queryProductCategories =
            await storeProductService.queryAllCategories();

        return handler.returnStatus(200, queryProductCategories);
    });
};
