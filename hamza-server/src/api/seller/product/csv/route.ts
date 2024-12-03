import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';
import StoreService from '../../../../services/store';
import { CreateProductInput as MedusaCreateProductInput } from '@medusajs/medusa/dist/types/product';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import * as readline from 'readline';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
};

interface FileRequest extends MedusaRequest {
    file?: any;
}

const upload = multer({ dest: 'uploads/csvs/' });

const requiredHeaders = ['category', 'images', 'title', 'subtitle', 'handle', 'status', 'thumbnail', 'weight', 'discountable', 'price', 'description'];

const validateCsv = (filePath: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
        const validationErrors = [];
        const fileRows = [];

        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity,
        });

        rl.on('line', (line) => {
            fileRows.push(line);
        });

        rl.on('close', () => {
            const rowCount = fileRows.length;

            if (rowCount < 2) {
                validationErrors.push({
                    error: 'CSV file must contain more than 2 rows',
                });
            } else {
                const headerRow = fileRows[0].split(',');
                const missingHeaders = requiredHeaders.filter(header => !headerRow.includes(header));
                if (missingHeaders.length > 0) {
                    validationErrors.push({
                        error: `Missing headers in header row: ${missingHeaders.join(', ')}`,
                                       });
                }
            }

            resolve({ success: validationErrors.length === 0, message: validationErrors.map(err => err.error).join(', ') });
        });
    });
};

const validateCategory = async (productService: ProductService, categoryHandle: string): Promise<string | null> => {
    const category_ = await productService.getCategoryByHandle(categoryHandle);
    return category_ ? category_.id : null;
};

const validateData = async (productService: ProductService, data: Array<any>): Promise<{ success: boolean; message: string; validData: Array<any>; invalidData: Array<any> }> => {
    const invalidData = [];
    const validData = [];

    for (const row of data) {
        const hasInvalidData = requiredHeaders.some(header => !row[header]);
        if (hasInvalidData) {
            row['invalid_error'] = 'required fields missing data';
            invalidData.push(row);
            continue;
        }

        const categoryId = await validateCategory(productService, row['category']);
        if (!categoryId) {
            row['invalid_error'] = 'category handle does not exist';
            invalidData.push(row);
            continue;
        } else {
            row['category_id'] = categoryId;
        }

        if (row['status'] !== ProductStatus.DRAFT && row['status'] !== ProductStatus.PUBLISHED) {
            row['invalid_error'] = 'status is not valid, status must be draft or published';
            invalidData.push(row);
            continue;
        }

        if (!Number.isInteger(Number(row['weight']))) {
            row['invalid_error'] = 'weight must be a number';
            invalidData.push(row);
            continue;
        }

        if (row['discountable'] !== '0' && row['discountable'] !== '1') {
            row['invalid_error'] = 'discountable must be a boolean';
            invalidData.push(row);
            continue;
        }

        if (!Number.isInteger(Number(row['price']))) {
            row['invalid_error'] = 'price must be a number';
            invalidData.push(row);
            continue;
        }

        const product = await productService.getProductByHandle(row['handle']);
        if (product) {
            row['invalid_error'] = 'product handle must be unique';
            invalidData.push(row);
            continue;
        }

        const dataSet = data.filter(item => item !== row);
        const handleExists = dataSet.some(item => item['handle'] === row['handle']);
        if (handleExists) {
            row['invalid_error'] = 'handle must be unique from other rows';
            invalidData.push(row);
            continue;
        }

        validData.push(row);
    }

    if (invalidData.length === data.length || validData.length === 0) {
        return { success: false, message: 'Contains invalid data', validData: validData, invalidData: invalidData };
    }

    const message = invalidData.length > 0 ? 'Contains SOME valid data' : 'Contains valid data';
    return { success: true, message: message, validData: validData, invalidData: invalidData };
};

const convertCsvToJson = async (storeId: string, data: Array<any>): Promise<{ success: boolean; message: string; jsonData: CreateProductInput[] }> => {
    const jsonData = [];
    
    for (const row of data) {
        jsonData.push({
            store_id: storeId,
            ...row,
        });
    }
    return { success: true, message: '', jsonData: jsonData };
};

const parseCsvFile = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const fileRows: any[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                fileRows.push(row);
            })
            .on("end", () => {
                fs.unlinkSync(filePath);
                resolve(fileRows);
            })
            .on("error", (error) => {
                reject(error);
            });
    });
};

export const POST = async (req: FileRequest, res: MedusaResponse) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: 'File upload failed' });
        }

        const productService: ProductService = req.scope.resolve('productService');
        const storeService: StoreService = req.scope.resolve('storeService');

        const handler = new RouteHandler(req, res, 'POST', '/seller/product/csv', [
            'store_id',
            'file',
        ]);

        await handler.handle(async () => {
            const { store_id } = handler.inputParams;
            const file = req.file;

            if (!file) {
                return handler.returnStatus(400, { message: 'No file uploaded' });
            }
            
            const validateCsvOutput = await validateCsv(file.path);

            if (!validateCsvOutput.success) {
                return handler.returnStatus(400, { message: validateCsvOutput.message });
            }

            const fileRows = await parseCsvFile(file.path);

            const validateDataOutput = await validateData(productService, fileRows);

            if (!validateDataOutput.success) {
                return handler.returnStatus(400, { message: validateDataOutput.message, invalidData: validateDataOutput.invalidData });
            }

            const covertCsvToJsonOutput = await convertCsvToJson(store_id, validateDataOutput.validData);

            if (!covertCsvToJsonOutput.success) {
                return handler.returnStatus(400, { message: covertCsvToJsonOutput.message });
            }

            const products = await productService.bulkImportProducts(
                store_id,
                covertCsvToJsonOutput.jsonData
            );

            res.status(200).json({ message: "Products imported successfully" });
        });
    });
};
