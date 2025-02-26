import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import StoreProductService from '../../../../../services/store-product';

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeProductService: StoreProductService = req.scope.resolve(
        'storeProductService'
    );

    const handler = new RouteHandler(
        req,
        res,
        'DELETE',
        '/seller/product/edit-product/delete-image',
        ['image_id']
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('image_id')) {
            return;
        }

        const image_id = handler.inputParams.image_id;

        const products = await storeProductService.deleteGalleryImage(image_id);

        return handler.returnStatus(200, products);
    });
};
