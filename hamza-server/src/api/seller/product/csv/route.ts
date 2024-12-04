import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';
import StoreService from '../../../../services/store';
import { Product } from '../../../../models/product';
import { CreateProductProductVariantInput, CreateProductInput as MedusaCreateProductInput } from '@medusajs/medusa/dist/types/product';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import * as readline from 'readline';
import { PriceConverter } from 'src/utils/price-conversion';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
};

interface FileRequest extends MedusaRequest {
    file?: any;
}

const upload = multer({ dest: 'uploads/csvs/' });

const requiredHeaders = [
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

const validateCsv = async (
    filePath: string
): Promise<{ success: boolean; message: string }> => {
    const validationErrors = [];
    const fileRows = [];

    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        fileRows.push(line);
    }

    const rowCount = fileRows.length;

    if (rowCount < 2) {
        validationErrors.push({
            error: 'CSV file must contain more than 2 rows',
        });
    } else {
        const headerRow = fileRows[0].split(',');
        const missingHeaders = requiredHeaders.filter(
            (header) => !headerRow.includes(header)
        );
        if (missingHeaders.length > 0) {
            validationErrors.push({
                error: `Missing headers in header row: ${missingHeaders.join(', ')}`,
            });
        }
    }

    return {
        success: validationErrors.length === 0,
        message: validationErrors.map((err) => err.error).join(', '),
    };
};

const validateCategory = async (
    productService: ProductService,
    categoryHandle: string
): Promise<string | null> => {
    const category_ = await productService.getCategoryByHandle(categoryHandle);
    return category_ ? category_.id : null;
};

const validateData = async (
    productService: ProductService,
    data: Array<any>
): Promise<{
    success: boolean;
    message: string;
    validData: Array<any>;
    invalidData: Array<any>;
}> => {
    const invalidData = [];
    const validData = [];

    for (const row of data) {
        const validationError = await validateRow(productService, data, row);
        if (validationError) {
            row['invalid_error'] = validationError;
            invalidData.push(row);
        } else {
            validData.push(row);
        }
    }

    const success = validData.length > 0;
    const message = invalidData.length > 0
        ? 'Contains SOME valid data'
        : 'Contains valid data';

    return {
        success,
        message: success ? message : 'Contains invalid data',
        validData,
        invalidData,
    };
};

const validateRow = async (
    productService: ProductService,
    data: Array<any>,
    row: Array<any>
): Promise<string | null> => {
    if (requiredHeaders.some((header) => !row[header])) {
        return 'required fields missing data';
    }

    const categoryId = await validateCategory(productService, row['category']);
    if (!categoryId) {
        return 'category handle does not exist';
    }
    row['category_id'] = categoryId;

    if (![ProductStatus.DRAFT, ProductStatus.PUBLISHED].includes(row['status'])) {
        return 'status is not valid, status must be draft or published';
    }

    if (!Number.isInteger(Number(row['weight']))) {
        return 'weight must be a number';
    }

    if (!['0', '1'].includes(row['discountable'])) {
        return 'discountable must be a boolean';
    }

    if (!Number.isInteger(Number(row['price']))) {
        return 'price must be a number';
    }

    const product = await productService.getProductByHandle(row['handle']);
    if (product) {
        return 'product handle must be unique';
    }

    const handleExists = data.some(
        (item) => item !== row && item['handle'] === row['handle']
    );
    if (handleExists) {
        return 'handle must be unique from other rows';
    }

    return null;
};

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

        //TODO: get from someplace global
        const prices = [];
        for (const currency of currencies) {
            prices.push({
                currency_code: currency,
                amount: baseAmount * currency.rate,
            });
        }

        //get option names/values
        const options = [];
        for (const opt of optionNames) {
            options.push({ value: opt })
        }

        variants.push({
            title: productDetails.productInfo.name,
            inventory_quantity: variant.quantity,
            allow_backorder: false,
            manage_inventory: true,
            bucky_metadata: variant,
            metadata: { imgUrl: variant.imgUrl },
            prices,
            options: options
        });
    }

    return variants;
}

const convertDataToCreateDataInput = async (
    data: Array<any>,
    storeId: string,
    collectionId: string,
    salesChannelIds: string[]
): Promise<CreateProductInput> => {
    

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
        // variants,
    } as CreateProductInput;

    if (!output.variants?.length)
        throw new Error(
            `No variants were detected for product ${output.handle}`
        );

    return output;
};

const convertData = async (
    storeId: string,
    data: Array<any>
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

const parseCsvFile = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const fileRows: any[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                fileRows.push(row);
            })
            .on('end', () => {
                fs.unlinkSync(filePath);
                resolve(fileRows);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

export const POST = async (req: FileRequest, res: MedusaResponse) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: 'File upload failed' });
        }

        const productService: ProductService =
            req.scope.resolve('productService');
        const storeService: StoreService = req.scope.resolve('storeService');

        const handler = new RouteHandler(
            req,
            res,
            'POST',
            '/seller/product/csv',
            ['store_id', 'file']
        );

        await handler.handle(async () => {
            const { store_id } = handler.inputParams;
            const file = req.file;

            // TODO: add validation for store_id

            if (!file) {
                return handler.returnStatus(400, {
                    message: 'No file uploaded',
                });
            }

            const validateCsvOutput: { success: boolean; message: string } =
                await validateCsv(file.path);

            if (!validateCsvOutput.success) {
                return handler.returnStatus(400, {
                    message: validateCsvOutput.message,
                });
            }

            const fileRows = await parseCsvFile(file.path);

            const validateDataOutput: {
                success: boolean;
                message: string;
                validData: Array<any>;
                invalidData: Array<any>;
            } = await validateData(productService, fileRows);

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
            } = await convertData(store_id, validateDataOutput.validData);

            if (!convertDataOutput.success) {
                return handler.returnStatus(400, {
                    message: convertDataOutput.message,
                });
            }

            const products: Product[] = await productService.bulkImportProducts(
                store_id,
                convertDataOutput.jsonData
            );

            res.status(200).json({ message: 'Products imported successfully' });
        });
    });
};
