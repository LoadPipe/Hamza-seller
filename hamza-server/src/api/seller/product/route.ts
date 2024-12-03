import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import ProductService from '../../../services/product';
import StoreService from '../../../services/store';

/**
 * Retrieves a list of products belonging to a store
 *
 * INPUTS:
 * store_id: string
 * store_name: string
 * filter: {
 *      { property: value, property: { not|eq|lt|gt|lte|gte: value } }
 * }
 * sort: { col: string, direction: asc | desc}
 * page: number
 * recordsPerPage: number
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(req, res, 'GET', '/seller/product', [
        'store_id',
        'store_name',
        'filter',
        'sort',
        'page',
        'recordsPerPage',
    ]);

    await handler.handle(async () => {
        try {
            if (handler.hasParam('store_id')) {
                const storeId = handler.inputParams.store_id;
                const store = await storeService.getStoreById(storeId);
                const products = await productService.getProductsFromStore(
                    store.id
                );
                return res.json(products);
            } else if (handler.hasParam('store_name')) {
                const storeName = handler.inputParams.store_name;
                const store = await storeService.getStoreByName(storeName);
                let list_products = [];
                list_products =
                    await productService.getProductsFromStoreWithPrices(
                        store.id
                    );

                return res.json(list_products);
            } else {
                throw new Error(`No store_id or store_name provided`);
            }
        } catch (error) {
            return handler.returnStatusWithMessage(400, error.message);
        }
    });
};
