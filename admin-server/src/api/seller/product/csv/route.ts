import {
    MedusaRequest,
    MedusaResponse,
} from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService, {
} from '../../../../services/product';
import ProductCsvService, {
    csvProductData,
    requiredCsvHeadersForProduct,
    requiredCsvHeadersForVariant,
    requiredCsvHeadersForVariantUpdate,
    requiredCsvHeadersForProductUpdate
} from '../../../../services/product-csv';
import StoreService from '../../../../services/store';
import { Product } from '../../../../models/product';
import multer from 'multer';

interface FileRequest extends MedusaRequest {
    file?: any;
}

/**
 * @swagger
 * /seller/product/csv/import:
 *   post:
 *     summary: Import products from CSV
 *     description: Imports products to a specific store from a CSV file.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file to be uploaded.
 *               store_id:
 *                 type: string
 *                 description: The ID of the store where products will be imported.
 *               collection_id:
 *                 type: string
 *                 description: The ID of the collection to which products belong.
 *               sales_channel_id:
 *                 type: string
 *                 description: The ID of the sales channel for the products.
 *               base_image_url:
 *                 type: string
 *                 description: (Optional) The base URL for product images.
 *     responses:
 *       200:
 *         description: Products imported successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Products imported successfully
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 invalidProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error importing products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error importing products: [error message]
 *     requiredCsvHeaders:
 *       description: The required headers and required fields for the CSV file.
 *       product:
 *         type: array
 *         items:
 *           type: string
 *         example: ['category', 'images', 'title', 'subtitle', 'description', 'status', 'thumbnail', 'weight', 'discountable', 'handle', 'variant', 'variant_price', 'variant_inventory_quantity', 'variant_allow_backorder', 'variant_manage_inventory']
 *       variant:
 *         type: array
 *         items:
 *           type: string
 *         example: ['handle', 'variant', 'variant_price', 'variant_inventory_quantity', 'variant_allow_backorder', 'variant_manage_inventory']
 */

const upload = multer({ dest: 'uploads/csvs/' });

export const POST = async (req: FileRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');
    const storeService: StoreService = req.scope.resolve('storeService');
    const productCsvService: ProductCsvService = req.scope.resolve('productCsvService');

    /**
     * Handles the file upload and processing for CSV product data.
     *
     * Potential JSON Responses:
     *
     * 1. File upload error:
     *    Status: 400
     *    Response: { type: 'fileValidationError', message: 'No file uploaded' }
     *
     * 2. Missing store_id:
     *    Status: 400
     *    Response: { type: 'paramValidationError', message: 'store_id is required' }
     *
     * 3. Missing collection_id:
     *    Status: 400
     *    Response: { type: 'paramValidationError', message: 'collection_id is required' }
     *
     * 4. Missing sales_channel_id:
     *    Status: 400
     *    Response: { type: 'paramValidationError', message: 'sales_channel_id is required' }
     *
     * 5. No file uploaded:
     *    Status: 400
     *    Response: { type: 'fileValidationError', message: 'No file uploaded' }
     *
     * 6. CSV column validation error:
     *    Status: 400
     *    Response: { type: 'csvColumnValidationError', message: <validation error message> }
     *
     * 7. CSV data validation error:
     *    Status: 400
     *    Response: {
     *      type: 'csvDataValidationError',
     *      createMessage: <create error message>,
     *      createInvalidData: <invalid create data>,
     *      updateMessage: <update error message>,
     *      updateInvalidData: <invalid update data>
     *    }
     *
     * 8. Create products error:
     *    Status: 400
     *    Response: { type: 'createProductsError', message: <create error message> }
     *
     * 9. Update products error:
     *    Status: 400
     *    Response: { type: 'updateProductsError', message: <update error message> }
     *
     * 10. Successful response:
     *     Status: 200
     *     Response: {
     *       type: 'csvDataResponse',
     *       createSuccess: <boolean>,
     *       createMessage: <create message>,
     *       createdProducts: <created products>,
     *       invalidCreatedProducts: <invalid created products>,
     *       updateSuccess: <boolean>,
     *       updateMessage: <update message>,
     *       updatedProducts: <updated products>,
     *       invalidUpdatedProducts: <invalid updated products>
     *     }
     */
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: 'File upload failed' });
        }

        const handler = new RouteHandler(
            req,
            res,
            'POST',
            '/seller/product/csv',
            [
                'store_id',
                'file',
                'collection_id',
                'sales_channel_id',
                'base_image_url',
            ]
        );

        await handler.handle(async () => {
            try {
                const {
                    store_id,
                    param_collection_id,
                    param_sales_channel_id,
                    base_image_url,
                } = handler.inputParams;

                if (!store_id) {
                    return handler.returnStatus(400, {
                        type: 'paramValidationError',
                        message: 'store_id is required',
                    });
                }

                let collection_id = param_collection_id
                    ? param_collection_id
                    : null;
                let sales_channel_id = param_sales_channel_id
                    ? param_sales_channel_id
                    : null;
                
                if (!collection_id || !sales_channel_id) {
                    const { salesChannelId, collectionId } =
                        await productService.getProductCollectionAndSalesChannelIds();

                    collection_id = collection_id
                        ? collection_id
                        : collectionId
                          ? collectionId
                          : null;

                    sales_channel_id = sales_channel_id
                        ? sales_channel_id
                        : salesChannelId
                          ? salesChannelId
                          : null;
                }

                if (!collection_id) {
                    return handler.returnStatus(400, {
                        type: 'paramValidationError',
                        message: 'collection_id is required',
                    }); 
                }

                if (!sales_channel_id) {
                    return handler.returnStatus(400, {
                        type: 'paramValidationError',
                        message: 'sales_channel_id is required',
                    }); 
                }

                const baseImageUrl = base_image_url
                    ? base_image_url
                    : 'https://static.hamza.market/stores/';

                const file = req.file;
                if (!file) {
                    return handler.returnStatus(400, {
                        type: 'fileValidationError',
                        message: 'No file uploaded',
                    });
                }

                // validation for store_id.  Methods throws error if store not found.
                const store = await storeService.getStoreById(store_id);

                // TODO: validate collection_id
                // TODO: validate sales_channel_id

                // console.log('POSTCheck1');

                const validateCsvOutput: { success: boolean; message: string } =
                    await productCsvService.validateCsv(
                        file.path,
                        requiredCsvHeadersForProduct
                    );

                if (!validateCsvOutput.success) {
                    return handler.returnStatus(400, {
                        type: 'csvColumnValidationError',
                        message: validateCsvOutput.message,
                    });
                }

                const fileData: Array<any> = await productCsvService.parseCsvFile(
                    file.path
                );

                // console.log('POSTCheck2');

                const validateCsvDataOutput: {
                    createSuccess: boolean;
                    createMessage: string;
                    createValidData: csvProductData[];
                    createInvalidData: csvProductData[];
                    updateSuccess: boolean;
                    updateMessage: string;
                    updateValidData: csvProductData[];
                    updateInvalidData: csvProductData[];
                } = await productCsvService.validateCsvData(
                    fileData,
                    requiredCsvHeadersForProduct,
                    requiredCsvHeadersForVariant,
                    requiredCsvHeadersForVariantUpdate,
                    requiredCsvHeadersForProductUpdate
                );

                console.log(
                    'validateCsvDataOutput: ' +
                        JSON.stringify(validateCsvDataOutput)
                );
                // console.log('POSTCheck3');

                if (
                    !validateCsvDataOutput.createSuccess &&
                    !validateCsvDataOutput.updateSuccess
                ) {
                    return handler.returnStatus(400, {
                        type: 'csvDataValidationError',
                        createMessage: validateCsvDataOutput.createMessage,
                        createInvalidData:
                            validateCsvDataOutput.createInvalidData,
                        updateMessage: validateCsvDataOutput.updateMessage,
                        updateInvalidData:
                            validateCsvDataOutput.updateInvalidData,
                    });
                }
                // console.log('validateCsvDataOutput: ' + JSON.stringify(validateCsvDataOutput));

                //create product code
                let createProductsOutput: {
                    success: boolean;
                    message: string;
                    products?: Product[];
                } = {
                    success: validateCsvDataOutput.createSuccess,
                    message: validateCsvDataOutput.createMessage,
                    products: [],
                };

                if (validateCsvDataOutput.createSuccess) {
                    createProductsOutput = await productCsvService.createProducts(
                        store,
                        collection_id,
                        sales_channel_id,
                        baseImageUrl,
                        validateCsvDataOutput.createValidData
                    );

                    if (!createProductsOutput.success) {
                        return handler.returnStatus(400, {
                            type: 'createProductsError',
                            message: createProductsOutput.message,
                        });
                    }
                }

                // console.log('POSTCheck4');

                //update product code
                let updateProductsOutput: {
                    success: boolean;
                    message: string;
                    products?: Product[];
                } = {
                    success: validateCsvDataOutput.updateSuccess,
                    message: validateCsvDataOutput.updateMessage,
                    products: [],
                };

                if (validateCsvDataOutput.updateSuccess) {
                    updateProductsOutput = await productCsvService.updateProducts(
                        store,
                        collection_id,
                        sales_channel_id,
                        baseImageUrl,
                        validateCsvDataOutput.updateValidData
                    );

                    if (!updateProductsOutput.success) {
                        return handler.returnStatus(400, {
                            type: 'updateProductsError',
                            message: updateProductsOutput.message,
                        });
                    }
                }

                // console.log('POSTCheck5');

                const responsePayload = {
                    type: 'csvDataResponse',
                    createSuccess: createProductsOutput.success,
                    createMessage: createProductsOutput.message,
                    createdProducts: createProductsOutput.products,
                    invalidCreatedProducts:
                        validateCsvDataOutput.createInvalidData,
                    updateSuccess: updateProductsOutput.success,
                    updateMessage: updateProductsOutput.message,
                    updatedProducts: updateProductsOutput.products,
                    invalidUpdatedProducts:
                        validateCsvDataOutput.updateInvalidData,
                };

                // console.log('responsePayload: ' + JSON.stringify(responsePayload));
                res.status(200).json(responsePayload);
            } catch (error) {
                return handler.returnStatus(400, {
                    message: 'Error importing products: ' + error,
                });
            }
        });
    });
};
