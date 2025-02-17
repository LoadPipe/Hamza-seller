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
        '/seller/product/validate-sku',
        ['sku', 'variant_id']
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('sku')) {
            return;
        }

        if (!handler.requireParam('variant_id')) {
            return;
        }

        const sku = handler.inputParams.sku;
        if (isNaN(Number(sku))) {
            return handler.returnStatus(400, {
                message: 'SKU must be a valid number.',
            });
        }

        const variant_id = handler.inputParams.variant_id;

        const products = await storeProductService.validateUniqueSKU(
            sku,
            variant_id
        );

        return handler.returnStatus(200, products);
    });
};
