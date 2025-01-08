import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/seller/product/seller-products',
        ['store_id', 'productsPerPage', 'page', 'sort', 'filter']
    );

    await handler.handle(async () => {
        // Ensure required parameters are provided
        if (!handler.requireParam('store_id')) {
            return;
        }

        const storeId = handler.inputParams.store_id;
        const filter: any = handler.hasParam('filter')
            ? handler.inputParams.filter
            : {};
        const sort: any = handler.hasParam('sort')
            ? handler.inputParams.sort
            : null;
        const page: number = handler.hasParam('page')
            ? parseInt(handler.inputParams.page.toString(), 10)
            : 0;
        const productsPerPage: number = handler.hasParam('productsPerPage')
            ? parseInt(handler.inputParams.productsPerPage.toString(), 10)
            : 20; // Default value

        const products = await productService.querySellerAllProducts(
            storeId,
            filter,
            sort,
            page,
            productsPerPage
        );

        return handler.returnStatus(200, products);
    });
};
