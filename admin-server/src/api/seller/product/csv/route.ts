import { MedusaRequest, MedusaResponse, ProductStatus, Store } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService, { csvProductData, UpdateProductProductVariantDTO } from '../../../../services/product';
import StoreService from '../../../../services/store';
import { Product } from '../../../../models/product';
import {
    CreateProductProductOption,
    CreateProductProductVariantInput,
    CreateProductInput as MedusaCreateProductInput,
    UpdateProductInput as MedusaUpdateProductInput,
} from '@medusajs/medusa/dist/types/product';
import multer from 'multer';
import { json } from 'body-parser';

type CreateProductInput = MedusaCreateProductInput & {
    id?: string;
    store_id: string;
};

type UpdateProductInput = MedusaUpdateProductInput & {
    id?: string;
};

type CreateProductProductOption_ = CreateProductProductOption & {
    values: string[];
};

type ProductDetails = {
    productInfo: {
        productId?: string;
        name?: string;
        baseCurrency?: string;
    };
    variants: csvProductData[];
};

interface FileRequest extends MedusaRequest {
    file?: any;
}

const upload = multer({ dest: 'uploads/csvs/' });

const requiredCsvHeadersForProduct = [
    'category',
    'title',
    'subtitle',
    'description',
    'status',
    'thumbnail',
    'weight',
    'discountable',
    'handle',
    'variant',
    'variant_price',
    'variant_inventory_quantity',
    'variant_allow_backorder',
    'variant_manage_inventory',
];

const requiredCsvHeadersForVariant = [
    'handle',
    'variant',
    'variant_price',
    'variant_inventory_quantity',
    'variant_allow_backorder',
    'variant_manage_inventory',
];

const requiredCsvHeadersForVariantUpdate = [
    ...requiredCsvHeadersForVariant.filter(header => header !== 'variant'),
    'variant_id',
];

const requiredCsvHeadersForProductUpdate = [
    ...requiredCsvHeadersForProduct.filter(header => header !== 'variant'),
    'product_id'
];

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

export const POST = async (req: FileRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');
    const storeService: StoreService = req.scope.resolve('storeService');

    /**
     * optionNames: array of option names i.e. 
     [
        { title: 'color', values: ['Black', 'White'] },
        { title: 'size', values: ['L', 'XL'] },
     ]
     
     * productDetails: array of product items variant with name, price i.e. 
     [
        {
            productInfo: {
                name: 'Some product name',
                baseCurrency: 'cny',
            },
            variants: [
                {name: 'L', price: 100}, 
                {name: 'XL', price: 200}
            ]
        }
    ]
    * @param productDetails 
    * @param optionNames 
    * @returns 
    */
    const mapVariants = async (
        productDetails: ProductDetails
    ): Promise<(CreateProductProductVariantInput | UpdateProductProductVariantDTO)[]> => {
        const variants = [];
        const currencies = [
            { code: 'eth', symbol: 'ETH' },
            { code: 'usdc', symbol: 'USDC' },
            { code: 'usdt', symbol: 'USDT' },
        ];

        // console.log('POSTCheck5.1.3.1');

        //extracts option values from variantData
        //const option = [ { "value":"L" }, { "value":"Black" }, { "value":"Female" } ]
        const extractOptions = (variantString: string): { value: string; option_id: string }[] => {
            const options = variantString.includes('|') ? variantString.split('|') : [variantString];
            return options.map(option => {
                const value = option.trim().split('[')[1].replace(']', '');
                const option_id = "opt_" + value;
                return { value, option_id };
            });
        };

        // console.log('POSTCheck5.1.3.2.3');

        for (const variant of productDetails.variants) {
            //get price
            const baseAmount = variant.variant_price;
            const convertedPrices = await productService.getPricesForVariant(
                baseAmount,
                productDetails.productInfo.baseCurrency
            );

            // console.log('POSTCheck5.1.3.2.4');
            // console.log('convertedPrices: ' + JSON.stringify(convertedPrices));
            //TODO: get from someplace global
            const prices = [];
            for (const currency of currencies) {
                const price = convertedPrices.find(
                    (p) => p.currency_code === currency.code
                );
                // console.log('price: ' + JSON.stringify(price));
                prices.push({
                    currency_code: currency.code,
                    amount: Number(price.amount) * 100,
                });
            }

            // console.log('POSTCheck5.1.3.2.5');

            const options = variant.variant ? extractOptions(variant.variant) : null;
            // console.log('options: ' + JSON.stringify(options));

            // console.log('POSTCheck5.1.3.2.6');

            variants.push({
                id: variant.variant_id || null,
                ...(options && { title: options.map((option) => option.value).join(' | ') }),
                inventory_quantity: variant.variant_inventory_quantity,
                allow_backorder:
                    variant.variant_allow_backorder === '1' ? true : false,
                manage_inventory:
                    variant.variant_manage_inventory === '1' ? true : false,
                sku: variant.variant_sku || null,
                barcode: variant.variant_barcode || null,
                ean: variant.variant_ean || null,
                upc: variant.variant_upc || null,
                hs_code: variant.variant_hs_code || null,
                origin_country: variant.variant_origin_country || null,
                mid_code: variant.variant_mid_code || null,
                material: variant.variant_material || null,
                weight: variant.variant_weight || null,
                length: variant.variant_length || null,
                width: variant.variant_width || null,
                height: variant.variant_height || null,
                ...(prices.length > 0 && { prices }),
                ...(options && { options: options }),
            });

            // console.log('POSTCheck5.1.3.2.7');
        }
        // console.log('variants: ' + JSON.stringify(variants));
        return variants;
    };

    /**
     *
     * @param rowData - product row data
     * @param csvData - all csv data
     * @returns
     */
    const convertRowDataToProductDetails = async (
        rowData: csvProductData,
        csvData: csvProductData[],
        store: Store
    ): Promise<ProductDetails> => {

        //get all variant rows with same handle
        let variants = [];
        
        //usually, product row data contains variant data as well
        const hasVariant = productService.csvRowHasVariant(
            rowData,
            requiredCsvHeadersForVariant,
            requiredCsvHeadersForVariantUpdate
        );
        
        if (hasVariant) {
            variants.push(rowData);
        }
        
        //grabbing all variants that are the same handle
        variants.push(
            ...csvData.filter(
                (row) => rowData !== row && row.handle && rowData.handle && row.handle === rowData.handle
            )
        );

        // console.log('variantsConvertRowDataToProductDetails: ' + JSON.stringify(variants));

        //if product_id is present, we're updating a product        
        let productDetails: ProductDetails = {
            productInfo: {
                productId: rowData['product_id'] || null,
                name: rowData['title'] || null,
                baseCurrency: store.default_currency_code,
            },
            variants: variants,
        };
        // console.log('productDetails2: ' + JSON.stringify(productDetails));
        return productDetails;
    };

    // generate option names from variantData
    // const optionNames: extractOptionNames[] = [
    //     { title: 'color', values: ['Black', 'White'] },
    //     { title: 'size', values: ['L', 'XL'] },
    //     { title: 'gender', values: ['Male', 'Female'] },
    // ];
    const extractOptionNames = async (
        variants: csvProductData[]
    ): Promise<CreateProductProductOption_[] | null> => {
        const optionMap: { [key: string]: Set<string> } = {};

        // console.log('POSTCheck5.1.3.2.1');

        variants.forEach((variant) => {
            if (!variant.variant) {
                return;
            }
            const options = variant.variant.includes('|')
                ? variant.variant.split('|').map((option) => option.trim())
                : [variant.variant.trim()];
            options.forEach((option) => {
                const [key, value] = option.split('[');
                const cleanValue = value.replace(']', '');
                if (!optionMap[key]) {
                    optionMap[key] = new Set();
                }
                optionMap[key].add(cleanValue);
            });
        });

        // console.log('POSTCheck5.1.3.2.2');

        if (Object.entries(optionMap).length === 0) {
            return null;
        }

        return Object.entries(optionMap).map(([title, values]) => ({
            title,
            values: Array.from(values),
        }));
    }

    /**
     * Extracts and formats image URLs from a given string of image paths.
     * 
     * @param {string} images - A string containing image paths separated by '|'.
     * @param {string} baseImageUrl - The base URL to prepend to image paths that do not start with 'http'.
     * @returns {Promise<string[]>} A promise that resolves to an array of formatted image URLs.
     * 
     * @example
     * const images = "image1.jpg|http://example.com/image2.jpg|image3.png";
     * const baseImageUrl = "http://mybaseurl.com/";
     * extractImages(images, baseImageUrl).then((result) => {
     *     console.log(result);
     *     // Output: [
     *     //   "http://mybaseurl.com/image1.jpg",
     *     //   "http://example.com/image2.jpg",
     *     //   "http://mybaseurl.com/image3.png"
     *     // ]
     * });
     */
    const extractImages = async (images: string, baseImageUrl: string): Promise<string[]> => {
        const images_ = images.split('|').map((option) => {
            if (option.trim().startsWith('http')) {
                return option.trim();
            } else {
                return baseImageUrl + option.trim();
            }
        });
        return images_;
    }

    const convertCsvDataToCreateProductInput = async (
        rowData: csvProductData,
        csvData: csvProductData[],
        store: Store,
        collectionId: string,
        salesChannelIds: string[],
        baseImageUrl: string
    ): Promise<CreateProductInput> => {
        // const productDetails: {
        //     productInfo: {
        //         name: string;
        //         baseCurrency: string;
        //     };
        //     variants: { variantData: string; price: number }[];
        // } = {
        //     productInfo: {
        //         name: rowData['title'],
        //         baseCurrency: 'cny',
        //     },
        //     variants: [
        //         { variantData: 'Size[L]|Color[Black] | Gender[Female]', price: rowData['variant_price'] },
        //         { variantData: 'Size[L] | Color[Black]|Gender[Male]', price: rowData['variant_price'] },
        //         { variantData: 'Size[L] | Color[White] | Gender[Female]', price: rowData['variant_price'] },
        //         { variantData: 'Size[L] | Color[White] | Gender[Male]', price: rowData['variant_price'] },
        //         { variantData: 'Size[XL] | Color[Black] | Gender[Female]', price: rowData['variant_price'] },
        //         { variantData: 'Size[XL] | Color[Black] | Gender[Male]', price: rowData['variant_price'] },
        //         { variantData: 'Size[XL] | Color[White] | Gender[Female]', price: rowData['variant_price'] },
        //         { variantData: 'Size[XL] | Color[White] | Gender[Male]', price: rowData['variant_price'] },
        //     ],
        // };
        const productDetails: ProductDetails =
            await convertRowDataToProductDetails(rowData, csvData, store);

        const optionNames = await extractOptionNames(productDetails.variants);
        // console.log('optionNames: ' + JSON.stringify(optionNames));

        const variants = await mapVariants(productDetails);
        // console.log('variants: ' + JSON.stringify(variants));

        const images = await extractImages(rowData['images'], baseImageUrl);
        // console.log('images: ' + JSON.stringify(images));

        const thumbnail = rowData['thumbnail'].startsWith('http')
            ? rowData['thumbnail']
            : baseImageUrl + rowData['thumbnail'];

        const output = {
            title: rowData['title'],
            subtitle: rowData['subtitle'],
            handle: rowData['handle'],
            description: rowData['description'],
            is_giftcard: false,
            status: rowData['status'] as ProductStatus,
            thumbnail: thumbnail,
            images: images,
            collection_id: collectionId,
            weight: Math.round(Number(rowData['weight']) ?? 100),
            discountable: rowData['discountable'] === '1' ? true : false,
            store_id: store.id,
            categories: [{ id: rowData['category_id'] }],
            sales_channels: salesChannelIds.map((sc) => {
                return { id: sc };
            }),
            options: optionNames,
            variants,
        } as CreateProductInput;

        // console.log('Converting data to CreateProductInput:', JSON.stringify(output));
        // console.log('Converting data to Variants:', JSON.stringify(variants));
        // console.log('Converting data to optionNames:', JSON.stringify(optionNames));

        if (!output.variants?.length)
            throw new Error(
                `No variants were detected for product ${output.handle}`
            );

        return output;
    };

    const convertCsvDataToUpdateProductInput = async (
        rowData: csvProductData,
        csvData: csvProductData[],
        store: Store,
        collectionId: string,
        salesChannelIds: string[],
        baseImageUrl: string
    ): Promise<UpdateProductInput> => {
        let images: string[] = [];
        let thumbnail: string = '';

        // const productDetails: {
        //     productInfo: {
        //         productId: string;
        //         name: string;
        //         baseCurrency: string;
        //     };
        //     variants: { variantId: string; variantData: string; price: number }[];
        // } = {
        //     productInfo: {
        //         productId: rowData['product_id']
        //         name: rowData['title'],
        //         baseCurrency: 'cny',
        //     },
        //     variants: [
        //         { variantid: rowData['variant_id'], variantData: 'Size[L]|Color[Black] | Gender[Female]', price: rowData['variant_price'] },
        //         { variantid: rowData['variant_id'], variantData: 'Size[L] | Color[Black]|Gender[Male]', price: rowData['variant_price'] },
        //     ],
        // };

        // console.log('POSTCheck5.1.3.1');

        const productDetails: ProductDetails =
            await convertRowDataToProductDetails(rowData, csvData, store);
        
        // console.log('POSTCheck5.1.3.2');
        
        // console.log('productDetails: ' + JSON.stringify(productDetails));

        const optionNames: (CreateProductProductOption_[] | null) = await extractOptionNames(productDetails.variants);
        // console.log('optionNames: ' + JSON.stringify(optionNames));

        // console.log('POSTCheck5.1.3.3');

        const variants: UpdateProductProductVariantDTO[] = (await mapVariants(productDetails)) as UpdateProductProductVariantDTO[];
        // console.log('variants: ' + JSON.stringify(variants));

        // console.log('POSTCheck5.1.3.4');
        
        if (rowData['images'] && rowData['images'].trim() !== '') {
            const images = await extractImages(rowData['images'], baseImageUrl);
            // console.log('images: ' + JSON.stringify(images));
        }

        // console.log('POSTCheck5.1.3.5');

        if (rowData['thumbnail'] && rowData['thumbnail'].trim() !== '') {
            const thumbnail = rowData['thumbnail'].startsWith('http')
                ? rowData['thumbnail']
                : baseImageUrl + rowData['thumbnail'];
        }

        // console.log('POSTCheck5.1.3.6');
        
        const output: UpdateProductInput = {
            ...(rowData['product_id'] && { id: rowData['product_id'].trim() }),
            ...(rowData['title'] && { title: rowData['title'] }),
            ...(rowData['subtitle'] && { subtitle: rowData['subtitle'] }),
            ...(rowData['handle'] && { handle: rowData['handle'] }),
            ...(rowData['description'] && { description: rowData['description'] }),
            is_giftcard: false,
            ...(rowData['status'] && { status: rowData['status'] as ProductStatus }),
            ...(thumbnail && thumbnail.trim() !== '' && { thumbnail: thumbnail }),
            ...(images && images.length > 0 && { images: images }),
            collection_id: collectionId,
            ...(rowData['weight'] && { weight: Math.round(Number(rowData['weight'])) }),
            ...(rowData['discountable'] && { discountable: rowData['discountable'] === '1' ? true : false }),
            ...(rowData['category_id'] && { categories: [{ id: rowData['category_id'] }] }),
            ...(salesChannelIds && salesChannelIds.length > 0 && { sales_channels: salesChannelIds.map((sc) => { return { id: sc }; }) }),
            ...(optionNames && optionNames.length > 0 && { options: optionNames }),
            ...(variants && variants.length > 0 && { variants: variants }),
        };
        
        // console.log('POSTCheck5.1.3.7');

        // console.log('Converting data to UpdateProductInput:', JSON.stringify(output));
        // console.log('Converting data to Variants:', JSON.stringify(variants));
        // console.log('Converting data to optionNames:', JSON.stringify(optionNames));

        return output;
    };

    const convertCreateCsvData = async (
        store: Store,
        collectionId: string,
        salesChannelId: string,
        baseImageUrl: string,
        data: csvProductData[]
    ): Promise<{
        success: boolean;
        message: string;
        jsonData?: CreateProductInput[];
    }> => {
        let productInputs: CreateProductInput[] = [];

        // TODO: get collectionId and salesChannelId from database
        // const collectionId = 'pcol_01HRVF8HCVY8B00RF5S54THTPC';
        // const salesChannelId = 'sc_01JE2GP93F1P0621E4ZCKK1AYR';

        /**
         * Validate the see if there are product rows.
         * This is only for create instance.
         */
        const productRows = await productService.filterCsvProductRows(
            data,
            requiredCsvHeadersForProduct,
            requiredCsvHeadersForVariant,
            requiredCsvHeadersForProductUpdate,
            requiredCsvHeadersForVariantUpdate
        );
        if (productRows.length === 0) {
            return {
                success: false,
                message: 'Your spreadsheet does not contain any create product rows',
            };
        }

        // convert row to CreateDataInput
        for (let p of productRows) {
            // console.log('p: ' + JSON.stringify(p));
            productInputs.push(
                await convertCsvDataToCreateProductInput(
                    p,
                    data,
                    store,
                    collectionId,
                    [salesChannelId],
                    baseImageUrl
                )
            );
        }

        return {
            success: true,
            message: 'data converted successfully',
            jsonData: productInputs,
        };
    };

    const convertUpdateCsvData = async (
        store: Store,
        collectionId: string,
        salesChannelId: string,
        baseImageUrl: string,
        data: csvProductData[]
    ): Promise<{
        success: boolean;
        message: string;
        variantOnly: boolean;
        jsonData?: (UpdateProductInput | UpdateProductProductVariantDTO)[];
    }> => {
        let productInputs: UpdateProductInput[] = [];
        let variantInputs: UpdateProductProductVariantDTO[] = [];

        // TODO: get collectionId and salesChannelId from database
        // const collectionId = 'pcol_01HRVF8HCVY8B00RF5S54THTPC';
        // const salesChannelId = 'sc_01JE2GP93F1P0621E4ZCKK1AYR';

        // console.log('data: ' + JSON.stringify(data));
        // console.log('POSTCheck5.1.1');

        /**
         * Validate the see if there are product rows.
         * This is only for create instance.
         */
        const productRows = await productService.filterCsvProductRows(
            data,
            requiredCsvHeadersForProduct,
            requiredCsvHeadersForVariant,
            requiredCsvHeadersForProductUpdate,
            requiredCsvHeadersForVariantUpdate
        );

        // console.log('productRows: ' + JSON.stringify(productRows));

        // console.log('POSTCheck5.1.2');

        // if update is only a bunch of variants, we'll need to update variants only, not the product
        if (productRows.length === 0) {
            
            for (let d of data) {
                //TODO: handle variant only update
                variantInputs.push(
                    // await convertCsvDataToUpdateVariantInput(d)
                );
            }

            // console.log('variantInputs: ' + JSON.stringify(variantInputs));

            return {
                success: true,
                message: 'data converted successfully',
                variantOnly: true,
                jsonData: variantInputs,
            };
        }

        // console.log('POSTCheck5.1.3');

        // convert row to CreateDataInput
        // console.log('productRows: ' + JSON.stringify(productRows));

        for (let p of productRows) {
            // console.log('p: ' + JSON.stringify(p));
            productInputs.push(
                await convertCsvDataToUpdateProductInput(
                    p,
                    data,
                    store,
                    collectionId,
                    salesChannelId ? [salesChannelId] : null,
                    baseImageUrl
                )
            );
        }

        // console.log('POSTCheck5.1.4');

        // console.log('productInputs2: ' + JSON.stringify(productInputs));
        
        return {
            success: productInputs.length > 0,
            message: productInputs.length > 0 ? 'data converted successfully' : 'No data converted',
            variantOnly: false,
            jsonData: productInputs,
        };
    };

    const createProducts = async (
        store: Store,
        collection_id: string,
        sales_channel_id: string,
        baseImageUrl: string,
        productInputs: csvProductData[]
    ): Promise<{
        success: boolean;
        message: string;
        products?: Product[];
    }> => {
        const convertCreateCsvDataOutput: {
            success: boolean;
            message: string;
            jsonData?: CreateProductInput[];
        } = await convertCreateCsvData(
            store,
            collection_id,
            sales_channel_id,
            baseImageUrl,
            productInputs
        );
        // console.log('convertCsvDataOutput: ' + JSON.stringify(convertCsvDataOutput));

        if (!convertCreateCsvDataOutput.success) {
            return {
                success: false,
                message: convertCreateCsvDataOutput.message,
            };
        }

        const products: Product[] =
            await productService.bulkImportProducts(
                store.id,
                convertCreateCsvDataOutput.jsonData
            );

        if (products.length === 0) {
            return {
                success: false,
                message: 'No products were imported',
            };
        }

        return {
            success: true,
            message: 'Products imported successfully',
            products: products
        };
    }

    const updateProducts = async (
        store: Store,
        collection_id: string,
        sales_channel_id: string,
        baseImageUrl: string,
        productInputs: csvProductData[]
    ): Promise<{
        success: boolean;
        message: string;
        products?: Product[];
    }> => { 

        // console.log('POSTCheck5.1');

        const convertUpdateCsvDataOutput: {
            success: boolean;
            message: string;
            jsonData?: (UpdateProductInput | UpdateProductProductVariantDTO)[];
        } = await convertUpdateCsvData(
            store,
            collection_id,
            sales_channel_id,
            baseImageUrl,
            productInputs
        );
        // console.log('convertCsvDataOutput: ' + JSON.stringify(convertUpdateCsvDataOutput));

        // console.log('POSTCheck5.2');

        if (!convertUpdateCsvDataOutput.success) {
            return {
                success: false,
                message: convertUpdateCsvDataOutput.message,
            };
        }

        const products: Product[] =
            await productService.bulkUpdateProducts(
                store.id,
                convertUpdateCsvDataOutput.jsonData as UpdateProductInput[]
            );

        if (products.length === 0) {
            return {
                success: false,
                message: 'No products were updated',
            };
        }

        // console.log('POSTCheck5.3');

        return {
            success: true,
            message: 'Products updated successfully',
            products: products
        };
    }

    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: 'File upload failed' });
        }

        const handler = new RouteHandler(
            req,
            res,
            'POST',
            '/seller/product/csv',
            ['store_id', 'file', 'collection_id', 'sales_channel_id', 'base_image_url']
        );

        await handler.handle(async () => {
            try {
                const { store_id, collection_id, sales_channel_id, base_image_url } =
                    handler.inputParams;

                if (!store_id) {
                    return handler.returnStatus(400, {
                        message: 'store_id is required',
                    });
                }

                // if (!collection_id) {
                //     return handler.returnStatus(400, {
                //         message: 'collection_id is required',
                //     });
                // }

                // if (!sales_channel_id) {
                //     return handler.returnStatus(400, {
                //         message: 'sales_channel_id is required',
                //     });
                // }

                const baseImageUrl = (base_image_url) ? base_image_url : 'https://static.hamza.market/stores/';

                const file = req.file;
                if (!file) {
                    return handler.returnStatus(400, {
                        message: 'No file uploaded',
                    });
                }

                // validation for store_id.  Methods throws error if store not found.
                const store = await storeService.getStoreById(store_id);

                // TODO: validate collection_id
                // TODO: validate sales_channel_id

                // console.log('POSTCheck1');

                const validateCsvOutput: { success: boolean; message: string } =
                    await productService.validateCsv(
                        file.path,
                        requiredCsvHeadersForProduct
                    );

                if (!validateCsvOutput.success) {
                    return handler.returnStatus(400, {
                        message: validateCsvOutput.message,
                    });
                }

                const fileData: Array<any> = await productService.parseCsvFile(
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
                } = await productService.validateCsvData(
                    fileData,
                    requiredCsvHeadersForProduct,
                    requiredCsvHeadersForVariant,
                    requiredCsvHeadersForVariantUpdate,
                    requiredCsvHeadersForProductUpdate
                );

                // console.log('POSTCheck3');

                if (!validateCsvDataOutput.createSuccess && !validateCsvDataOutput.updateSuccess) {
                    return handler.returnStatus(400, {
                        createMessage: validateCsvDataOutput.createMessage,
                        createInvalidData: validateCsvDataOutput.createInvalidData,
                        updateMessage: validateCsvDataOutput.updateMessage,
                        updateInvalidData: validateCsvDataOutput.updateInvalidData,
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
                    products: []
                };

                if (validateCsvDataOutput.createSuccess) {
                    createProductsOutput = await createProducts(
                        store,
                        collection_id,
                        sales_channel_id,
                        baseImageUrl,
                        validateCsvDataOutput.createValidData
                    );

                    if (!createProductsOutput.success) {
                        return handler.returnStatus(400, {
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
                    products: []
                };

                if (validateCsvDataOutput.updateSuccess) {
                    updateProductsOutput = await updateProducts(
                        store,
                        collection_id,
                        sales_channel_id,
                        baseImageUrl,
                        validateCsvDataOutput.updateValidData
                    );

                    if (!updateProductsOutput.success) {
                        return handler.returnStatus(400, {
                            message: updateProductsOutput.message,
                        });
                    }
                }

                // console.log('POSTCheck5');

                res.status(200).json({
                    createSuccess: createProductsOutput.success,
                    createMessage: createProductsOutput.message,
                    createdProducts: createProductsOutput.products,
                    invalidCreatedProducts: validateCsvDataOutput.createInvalidData,
                    updateSuccess: updateProductsOutput.success,
                    updateMessage: updateProductsOutput.message,
                    updatedProducts: updateProductsOutput.products,
                    invalidUpdatedProducts: validateCsvDataOutput.updateInvalidData,
                });
            } catch (error) {
                return handler.returnStatus(400, {
                    message: 'Error importing products: ' + error,
                });
            }
        });
    });
};
