import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/seller/product/seller-products',
        ['store_id', 'page', 'count', 'sort', 'filter']
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

        console.log('Filter:', filter); // Log filter parameters
        console.log('Page:', handler.inputParams.page); // Log pagination values
        console.log('Products Per Page:', handler.inputParams.count); // Log

        const page: number = handler.hasParam('page')
            ? parseInt(handler.inputParams.page.toString(), 10)
            : 0;
        const count: number = handler.hasParam('count')
            ? parseInt(handler.inputParams.count.toString(), 10)
            : 20; // Default value

        const products = await productService.querySellerAllProducts(
            storeId,
            filter,
            sort,
            page,
            count
        );

        return handler.returnStatus(200, products);
    });
};
