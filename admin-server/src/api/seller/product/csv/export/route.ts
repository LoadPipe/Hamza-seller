import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import ProductService from '../../../../../services/product';
import StoreService from '../../../../../services/store';

type SimplifiedCategory = { name: string; handle: string };

/**
 * TODO: 
 * 1. handle multiple categories
 * 2. handle multiple images
 * 3. handle multiple variants
 * 4. handle multiple prices
 * 5. handle multiple inventory levels
 * 6. handle multiple options
 * 7. handle multiple tags
 * 8. handle multiple tax rates
 * 9. handle multiple shipping profiles
 * 10. handle multiple collections
 * 
 * @swagger
 * /seller/product/csv/export:
 *   get:
 *     summary: Export products to CSV
 *     description: Exports products from a specific store to a CSV file.
 *     parameters:
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the store to export products from.
 *     responses:
 *       200:
 *         description: A CSV file containing the exported products.
 *       400:
 *         description: No products found for the given store.
 *       500:
 *         description: Internal server error.
 */
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
            const products = await productService.getProductsFromStoreWithPrices(store.id);
            for (const product of products) {
                const categories = await productService.getCategoriesByStoreId(store.id);
                (product as any).categories = categories
                    .filter(category => category.products.some(p => p.id === product.id))
                    .map((category: SimplifiedCategory) => ({ name: category.name, handle: category.handle }));
            }

            if (products.length === 0) {
                return handler.returnStatus(400, {
                    message: 'No products found for the given store',
                });
            }
            //console.log('products: ' + JSON.stringify(products[0]));

            const headers = 'category,images,title,subtitle,description,status,thumbnail,weight,discountable,store_default_currency_code,handle,variant,variant_price,variant_inventory_quantity,variant_allow_backorder,variant_manage_inventory,variant_sku,variant_barcode,variant_ean,variant_upc,variant_hs_code,variant_origin_country,variant_mid_code,variant_material,variant_weight,variant_length,variant_height,variant_width\n'; 
            let csvContent = headers; 

            const handleCommas = (field) => {
                if (field.includes(',')) {
                    return `"${field}"`;
                }
                return field;
            };
            
            const handleNulls = (field) => {
                if (field === null) {
                    return '';
                }
                return field;
            };

            const handleBoolean = (field) => {
                if (field === true) {
                    return 1;
                }
                return 0;
            };

            // TODO: how to handle: multiple categories
            products.forEach((product) => {
                product.variants.forEach((variant, index) => {
                    const variantPrice = variant.prices.find(price => price.currency_code === store.default_currency_code)?.amount || 0;
                    if (index === 0) {
                        csvContent += `${product.categories[0].handle},,${handleNulls(product.title)},${handleNulls(product.subtitle)},${handleCommas(product.description)},${product.status},${handleNulls(product.thumbnail)},${handleNulls(product.weight)},${handleBoolean(product.discountable)},${store.default_currency_code},${handleNulls(product.handle)},${variant.title},${variantPrice},${variant.inventory_quantity},${handleBoolean(variant.allow_backorder)},${handleBoolean(variant.manage_inventory)},${handleNulls(variant.sku)},${handleNulls(variant.barcode)},${handleNulls(variant.ean)},${handleNulls(variant.upc)},${handleNulls(variant.hs_code)},${handleNulls(variant.origin_country)},${handleNulls(variant.mid_code)},${handleNulls(variant.material)},${handleNulls(variant.weight)},${handleNulls(variant.length)},${handleNulls(variant.height)},${handleNulls(variant.width)}\n`;
                    } else {
                        csvContent += `,,,,,,,,,,${handleNulls(product.handle)},${variant.title},${variantPrice},${variant.inventory_quantity},${handleBoolean(variant.allow_backorder)},${handleBoolean(variant.manage_inventory)},${handleNulls(variant.sku)},${handleNulls(variant.barcode)},${handleNulls(variant.ean)},${handleNulls(variant.upc)},${handleNulls(variant.hs_code)},${handleNulls(variant.origin_country)},${handleNulls(variant.mid_code)},${handleNulls(variant.material)},${handleNulls(variant.weight)},${handleNulls(variant.length)},${handleNulls(variant.height)},${handleNulls(variant.width)}\n`;
                    }
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

