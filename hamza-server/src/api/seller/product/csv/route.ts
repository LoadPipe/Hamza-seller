import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';
import StoreService from '../../../../services/store';
import { CreateProductInput as MedusaCreateProductInput } from '@medusajs/medusa/dist/types/product';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
};

interface FileRequest extends MedusaRequest {
    file?: any;
}

const upload = multer({ dest: 'uploads/csvs/' });

/**
 * Uploads a CSV product listing to a store.
 *
 * INPUTS:
 * store_id: string
 * data: string
 */
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

        const validateCsv = (data: Array<any>) => {
            handler.logger.debug(`fileRows: ${JSON.stringify(data)}`);
            return { success: true, message: '' };
        };

        const convertCsvToJson = (storeId: string, data: Array<any>) => {
            return { success: true, message: '', jsonData: [] };
        };

        await handler.handle(async () => {
            const { store_id } = handler.inputParams;
            const file = req.file; // Access the uploaded file

            if (!file) {
                return handler.returnStatus(400, { message: 'No file uploaded' });
            }

            // Function to read and parse the CSV file
            const parseCsvFile = (filePath: string): Promise<any[]> => {
                return new Promise((resolve, reject) => {
                    const fileRows: any[] = [];
                    fs.createReadStream(filePath)
                        .pipe(csv())
                        .on("data", (row) => {
                            fileRows.push(row);
                        })
                        .on("end", () => {
                            fs.unlinkSync(filePath); // Remove the temporary file
                            resolve(fileRows);
                        })
                        .on("error", (error) => {
                            reject(error);
                        });
                });
            };

            try {
                const fileRows = await parseCsvFile(file.path);
                //handler.logger.debug(`fileRows: ${JSON.stringify(fileRows)}`);
        
                //Validate the CSV
                const validationOutput: { success: boolean; message: string } = validateCsv(fileRows);

                if (!validationOutput.success) {
                    return handler.returnStatus(400, { message: validationOutput.message });
                }

                // Convert the CSV to JSON
                const covertOutput: { success: boolean; message: string; jsonData: CreateProductInput[] } = convertCsvToJson(store_id, fileRows);

                if (!covertOutput.success) {
                    return handler.returnStatus(400, { message: covertOutput.message });
                }

                // ProductService bulkImport
                const products = await productService.bulkImportProducts(
                    store_id,
                    covertOutput.jsonData
                );
        
                res.status(200).json({ message: "Products imported successfully" });
            } catch (error) {
                handler.logger.error(`Error processing CSV file: ${error.message}`);
                return handler.returnStatus(500, { message: 'Error processing CSV file' });
            }

            
        });
    });

    // await handler.handle(async () => {

    //     const { store_id, file } = handler.inputParams;

    //     //validate the CSV
    //     const validationOutput: { success: boolean; message: string } =
    //         validateCsv(file);

    //     //convert the csv to json
    //     const jsonData: CreateProductInput[] = convertCsvToJson(store_id, file);

    //     //productService bulkImport
    //     const products = await productService.bulkImportProducts(
    //         store_id,
    //         jsonData
    //     );

    //     return handler.returnStatus(200, products);
    // });
};
