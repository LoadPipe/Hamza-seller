import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import ProductService from '../../../../../services/product';
import StoreService from '../../../../../services/store';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');
    const storeService: StoreService = req.scope.resolve('storeService');

    const handler = new RouteHandler(req, res, 'GET', '/seller/product/csv/export', [
        'store_id',
    ]);

    await handler.handle(async () => {
        try {
            if (!handler.hasParam('store_id')) {
                throw new Error('store_id is required');
            }

            const storeId = handler.inputParams.store_id;
            const store = await storeService.getStoreById(storeId);
            const products = await productService.getProductsFromStore(store.id);

            if (products.length === 0) {
                return handler.returnStatus(400, {
                    message: 'No products found for the given store',
                });
            }
            console.log('products: ' + JSON.stringify(products));
            const headers = 'category,images,title,subtitle,description,status,thumbnail,weight,discountable,handle,variant,variant_price,variant_inventory_quantity,variant_allow_backorder,variant_manage_inventory,variant_sku,variant_barcode,variant_ean,variant_upc,variant_hs_code,variant_origin_country,variant_mid_code,variant_material,variant_weight,variant_length,variant_height,variant_width\n'; 
            let csvContent = headers; 

            const handleCommas = (field) => {
                if (field.includes(',')) {
                    return `"${field}"`;
                }
                return field;
            };

            products.forEach((product) => {
                product.variants.forEach((variant) => {
                    csvContent += `,,${product.title},${product.subtitle},${handleCommas(product.description)},${product.status},${product.thumbnail},${product.weight},${product.discountable},${product.handle},${variant.title},,${variant.inventory_quantity},${variant.allow_backorder},${variant.manage_inventory},${variant.sku},${variant.barcode},${variant.ean},${variant.upc},${variant.hs_code},${variant.origin_country},${variant.mid_code},${variant.material},${variant.weight},${variant.length},${variant.height},${variant.width}\n`;
                });
            }); 
            res.setHeader('Content-disposition', 'attachment; filename=products.csv');
            res.setHeader('Content-Type', 'text/csv');
            res.send(csvContent);
        } catch (error) {
            return handler.returnStatus(400, {
                message: 'Error exporting products: ' + error.message,
            });
        }
    });
};

