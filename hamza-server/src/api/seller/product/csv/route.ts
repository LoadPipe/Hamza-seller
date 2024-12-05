import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService, { csvProductData } from '../../../../services/product';
import StoreService from '../../../../services/store';
import { Product } from '../../../../models/product';
import { CreateProductProductVariantInput, CreateProductInput as MedusaCreateProductInput } from '@medusajs/medusa/dist/types/product';
import multer from 'multer';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
};

interface FileRequest extends MedusaRequest {
    file?: any;
}

const upload = multer({ dest: 'uploads/csvs/' });

const requiredCsvHeaders = [
    'category',
    'images',
    'title',
    'subtitle',
    'handle',
    'status',
    'thumbnail',
    'weight',
    'discountable',
    'price',
    'description',
];





export const POST = async (req: FileRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');
    const storeService: StoreService = req.scope.resolve('storeService');

    /**
     * optionNames: array of option names i.e. ['color', 'size']
     * productDetails: array of product items variant with name, price i.e. 
     [
        {
            productInfo: {
                name: 'Some product name',
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
    const mapVariants = async (productDetails: any, optionNames: string[]): Promise<CreateProductProductVariantInput[]> => {
        const variants = [];
        const currencies = [
            {code: 'eth', symbol: 'ETH', rate: 1},
            {code: 'usdc', symbol: 'USDC', rate: 3445},
            {code: 'usdt', symbol: 'USDT', rate: 1}
        ];
            
        for (const variant of productDetails.variants) {
            //get price 
            const baseAmount = variant.price;
            const convertedPrices = await productService.getPricesForVariant(baseAmount, productDetails.productInfo.baseCurrency);
            console.log("convertedPrices: " + JSON.stringify(convertedPrices));
            //TODO: get from someplace global
            const prices = [];

            for (const currency of currencies) {
                const price = convertedPrices.find(p => p.currency_code === currency.code);
                console.log("price: " + JSON.stringify(price));
                prices.push({
                    currency_code: currency.code,
                    amount: price.amount,
                });
            }

            //get option names/values
            const options = [];
            for (const opt of optionNames) {
                options.push({ value: opt })
            }

            variants.push({
                title: productDetails.productInfo.name,
                inventory_quantity: 100,
                allow_backorder: false,
                manage_inventory: true,
                prices,
                options: options
            });
        }

        return variants;
    }

    const convertDataToCreateDataInput = async (
        data: csvProductData,
        storeId: string,
        collectionId: string,
        salesChannelIds: string[]
    ): Promise<CreateProductInput> => {
        // {
        //     productInfo: {
        //         name: 'Some product name',
        //     },
        //     variants: [
        //         {name: 'L', price: 100}, 
        //         {name: 'XL', price: 200}
        //     ]
        // }
        const optionNames = ['default'];
        const productDetails = {
            productInfo: {
                name: data['title'],
                baseCurrency: 'cny'
            },
            variants: [
                {name: 'default', price: data['price']}
            ]
        }
        const variants = await mapVariants(
            productDetails,
            optionNames
        );

        const output = {
            title: data['title'],
            subtitle: data['subtitle'],
            handle: data['handle'],
            description: data['description'],
            is_giftcard: false,
            status: data['status'] as ProductStatus,
            thumbnail: data['thumbnail'],
            // images: data['images'],
            collection_id: collectionId,
            weight: Math.round(Number(data['weight']) ?? 100),
            discountable: data['discountable'] === '1' ? true : false,
            store_id: storeId,
            categories: [{ id: data['category_id'] }],
            sales_channels: salesChannelIds.map((sc) => {
                return { id: sc };
            }),
            options: optionNames.map(o => { return { title: o } }),
            variants,
        } as CreateProductInput;

        // console.log('Converting data to CreateProductInput:', output);
        // console.log('Converting data to Variants:', JSON.stringify(variants));

        if (!output.variants?.length)
            throw new Error(
                `No variants were detected for product ${output.handle}`
            );

        return output;
    };

    const convertData = async (
        storeId: string,
        data: csvProductData[]
    ): Promise<{
        success: boolean;
        message: string;
        jsonData: CreateProductInput[];
    }> => {
        let productInputs: CreateProductInput[] = [];

        // TODO: get collectionId and salesChannelId from database
        const collectionId = 'pcol_01HRVF8HCVY8B00RF5S54THTPC';
        const salesChannelId = 'sc_01JE2GP93F1P0621E4ZCKK1AYR';

        for (let p of data) {
            productInputs.push(
                await convertDataToCreateDataInput(
                    p,
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
                const { store_id } = handler.inputParams;
                const file = req.file;
                if (!file) {
                    return handler.returnStatus(400, {
                        message: 'No file uploaded',
                    });
                }

                // validation for store_id.  Methods throws error if store not found.
                const store = await storeService.getStoreById(store_id);

                const validateCsvOutput: { success: boolean; message: string } =
                    await productService.validateCsv(file.path, requiredCsvHeaders);

                if (!validateCsvOutput.success) {
                    return handler.returnStatus(400, {
                        message: validateCsvOutput.message,
                    });
                }

                const fileData: Array<any> = await productService.parseCsvFile(file.path);

                const validateDataOutput: {
                    success: boolean;
                    message: string;
                    validData: Array<any>;
                    invalidData: Array<any>;
                } = await productService.validateData(fileData, requiredCsvHeaders);

                if (!validateDataOutput.success) {
                    return handler.returnStatus(400, {
                        message: validateDataOutput.message,
                        invalidData: validateDataOutput.invalidData,
                    });
                }

                const convertDataOutput: {
                    success: boolean;
                    message: string;
                    jsonData: CreateProductInput[];
                } = await convertData(store.id, validateDataOutput.validData);

                if (!convertDataOutput.success) {
                    return handler.returnStatus(400, {
                        message: convertDataOutput.message,
                    });
                }

            
                const products: Product[] = await productService.bulkImportProducts(
                    store.id,
                    convertDataOutput.jsonData
                );

                if (products.length === 0) {
                    return handler.returnStatus(400, {
                        message: 'No products were imported',
                    });
                } 

                res.status(200).json({ message: 'Products imported successfully', products: products, invalidProducts: validateDataOutput.invalidData });
            } catch (error) {
                return handler.returnStatus(400, {
                    message: 'Error importing products: ' + error,
                });
            }
        });
    });
};
