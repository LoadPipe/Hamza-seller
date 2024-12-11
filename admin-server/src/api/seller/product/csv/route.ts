import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService, { csvProductData } from '../../../../services/product';
import StoreService from '../../../../services/store';
import { Product } from '../../../../models/product';
import {
    CreateProductProductOption,
    CreateProductProductVariantInput,
    CreateProductInput as MedusaCreateProductInput,
} from '@medusajs/medusa/dist/types/product';
import multer from 'multer';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
};

type CreateProductProductOption_ = CreateProductProductOption & {
    values: string[];
};

type ProductDetails = {
    productInfo: {
        name: string;
        baseCurrency: string;
    };
    variants: csvProductData[];
}

interface FileRequest extends MedusaRequest {
    file?: any;
}

const upload = multer({ dest: 'uploads/csvs/' });

const requiredCsvHeadersForProduct = [
    'category',
    'images',
    'title',
    'subtitle',
    'status',
    'thumbnail',
    'weight',
    'discountable',
    'description',
    'handle',
    'variant',
    'variant_price',
    'variant_inventory_quantity',
    'variant_allow_backorder',
    'variant_manage_inventory'
];

const requiredCsvHeadersForVariant = [
    'handle',
    'variant',
    'variant_price',
    'variant_inventory_quantity',
    'variant_allow_backorder',
    'variant_manage_inventory'
];

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
    ): Promise<CreateProductProductVariantInput[]> => {
        const variants = [];
        const currencies = [
            { code: 'eth', symbol: 'ETH' },
            { code: 'usdc', symbol: 'USDC' },
            { code: 'usdt', symbol: 'USDT' },
        ];

        //extracts option values from variantData
        //const option = [ { "value":"L" }, { "value":"Black" }, { "value":"Female" } ]
        const extractOptions = (variantString: string): { value: string }[] => {
            return variantString.split('|').map(option => {
                const value = option.trim().split('[')[1].replace(']', '');
                return { value };
            });
        }
        
        for (const variant of productDetails.variants) {
            //get price
            const baseAmount = variant.variant_price;
            const convertedPrices = await productService.getPricesForVariant(
                baseAmount,
                productDetails.productInfo.baseCurrency
            );
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
                    amount: price.amount,
                });
            }

            const options = extractOptions(variant.variant);
            // console.log('options: ' + JSON.stringify(options));

            variants.push({
                title: options.map(option => option.value).join(' | '),
                inventory_quantity: variant.variant_inventory_quantity,
                allow_backorder: variant.variant_allow_backorder === '1' ? true : false,
                manage_inventory: variant.variant_manage_inventory === '1' ? true : false,
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
                prices,
                options: options,
            });
        }
        // console.log('variants: ' + JSON.stringify(variants));
        return variants;
    };

    /**
     * 
     * @param rowData - product row data 
     * @param csvData - all csv data
     * @param requiredCsvHeadersForProduct - product headers
     * @param requiredCsvHeadersForVariant - variant headers
     * @returns 
     */
    const convertRowDataToProductDetails = async (
        rowData: csvProductData,
        csvData: csvProductData[]
    ): Promise<ProductDetails> => {
        //get all variant rows with same handle
        let variants = [];
        variants.push(rowData);
        variants.push(...csvData.filter((row) => rowData !== row &&row.handle === rowData.handle));
        // console.log('variants: ' + JSON.stringify(variants));

        const productDetails: ProductDetails = {
            productInfo: {
                name: rowData['title'],
                baseCurrency: 'cny',
            },
            variants: variants,
        };
        return productDetails;
    };

    const convertCsvDataToCreateDataInput = async (
        rowData: csvProductData,
        csvData: csvProductData[],
        storeId: string,
        collectionId: string,
        salesChannelIds: string[]
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
            await convertRowDataToProductDetails(
                rowData,
                csvData
            );        
        
        // generate option names from variantData
        // const optionNames: extractOptionNames[] = [
        //     { title: 'color', values: ['Black', 'White'] },
        //     { title: 'size', values: ['L', 'XL'] },
        //     { title: 'gender', values: ['Male', 'Female'] },
        // ];        
        const extractOptionNames = async (
            variants: csvProductData[]
        ): Promise<CreateProductProductOption_[]> => {
            const optionMap: { [key: string]: Set<string> } = {};

            variants.forEach((variant) => {
                const options = variant.variant.split('|').map(option => option.trim());
                options.forEach((option) => {
                    const [key, value] = option.split('[');
                    const cleanValue = value.replace(']', '');
                    if (!optionMap[key]) {
                        optionMap[key] = new Set();
                    }
                    optionMap[key].add(cleanValue);
                });
            });

            return Object.entries(optionMap).map(([title, values]) => ({
                title,
                values: Array.from(values),
            }));
        };
        
        const optionNames = await extractOptionNames(productDetails.variants);
        // console.log('optionNames: ' + JSON.stringify(optionNames));
        
        const variants = await mapVariants(productDetails);
        // console.log('variants: ' + JSON.stringify(variants));

        const output = {
            title: rowData['title'],
            subtitle: rowData['subtitle'],
            handle: rowData['handle'],
            description: rowData['description'],
            is_giftcard: false,
            status: rowData['status'] as ProductStatus,
            thumbnail: rowData['thumbnail'],
            // images: rowData['images'],
            collection_id: collectionId,
            weight: Math.round(Number(rowData['weight']) ?? 100),
            discountable: rowData['discountable'] === '1' ? true : false,
            store_id: storeId,
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

    const convertCsvData = async (
        storeId: string,
        collectionId: string,
        salesChannelId: string,
        data: csvProductData[],
        requiredCsvHeadersForProduct: string[],
        requiredCsvHeadersForVariant: string[]
    ): Promise<{
        success: boolean;
        message: string;
        jsonData: CreateProductInput[];
    }> => {
        let productInputs: CreateProductInput[] = [];

        // TODO: get collectionId and salesChannelId from database
        // const collectionId = 'pcol_01HRVF8HCVY8B00RF5S54THTPC';
        // const salesChannelId = 'sc_01JE2GP93F1P0621E4ZCKK1AYR';

        //get all product rows to loop through
        const productRows = await productService.filterCsvProductRows(
            data,
            requiredCsvHeadersForProduct,
            requiredCsvHeadersForVariant
        );

        // convert row to CreateDataInput
        for (let p of productRows) {
            // console.log('p: ' + JSON.stringify(p));
            productInputs.push(
                await convertCsvDataToCreateDataInput(
                    p,
                    data,
                    storeId,
                    collectionId,
                    [salesChannelId]
                )
            );
        }

        return {
            success: true,
            message: 'data converted successfully',
            jsonData: productInputs,
        };
    };

    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: 'File upload failed' });
        }

        const handler = new RouteHandler(
            req,
            res,
            'POST',
            '/seller/product/csv',
            ['store_id', 'file']
        );

        await handler.handle(async () => {
            try {
                const { store_id, collection_id, sales_channel_id } =
                    handler.inputParams;

                if (!store_id) {
                    return handler.returnStatus(400, {
                        message: 'store_id is required',
                    });
                }

                if (!collection_id) {
                    return handler.returnStatus(400, {
                        message: 'collection_id is required',
                    });
                }

                if (!sales_channel_id) {
                    return handler.returnStatus(400, {
                        message: 'sales_channel_id is required',
                    });
                }

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

                const validateCsvDataOutput: {
                    success: boolean;
                    message: string;
                    validData: csvProductData[];
                    invalidData: csvProductData[];
                } = await productService.validateCsvData(
                    fileData,
                    requiredCsvHeadersForProduct,
                    requiredCsvHeadersForVariant
                );

                if (!validateCsvDataOutput.success) {
                    return handler.returnStatus(400, {
                        message: validateCsvDataOutput.message,
                        invalidData: validateCsvDataOutput.invalidData,
                    });
                }
                // console.log('validateCsvDataOutput: ' + JSON.stringify(validateCsvDataOutput));

                const convertCsvDataOutput: {
                    success: boolean;
                    message: string;
                    jsonData: CreateProductInput[];
                } = await convertCsvData(
                    store.id,
                    collection_id,
                    sales_channel_id,
                    validateCsvDataOutput.validData,
                    requiredCsvHeadersForProduct,
                    requiredCsvHeadersForVariant
                );
                // console.log('convertCsvDataOutput: ' + JSON.stringify(convertCsvDataOutput));

                if (!convertCsvDataOutput.success) {
                    return handler.returnStatus(400, {
                        message: convertCsvDataOutput.message,
                    });
                }

                const products: Product[] =
                    await productService.bulkImportProducts(
                        store.id,
                        convertCsvDataOutput.jsonData
                    );

                if (products.length === 0) {
                    return handler.returnStatus(400, {
                        message: 'No products were imported',
                    });
                }

                res.status(200).json({
                    message: 'Products imported successfully',
                    products: products,
                    invalidProducts: validateCsvDataOutput.invalidData,
                });
            } catch (error) {
                return handler.returnStatus(400, {
                    message: 'Error importing products: ' + error,
                });
            }
        });
    });
};
