import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';
import { CreateProductInput as MedusaCreateProductInput } from '@medusajs/medusa/dist/types/product';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
};

/**
 * Uploads a CSV product listing to a store.
 *
 * INPUTS:
 * store_id: string
 * data: string
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(req, res, 'POST', '/seller/product/csv', [
        'store_id',
        'data',
    ]);

    const validateCsv = (data: string) => {
        return { success: true, message: '' };
    };

    const convertCsvToJson = (storeId: string, data: string) => {
        return [];
    };

    await handler.handle(async () => {
        //this causes the route to return 400 if required params are not supplied
        if (!handler.requireParams(['store_id', 'data'])) return;

        const { store_id, data } = handler.inputParams;

        //validate the CSV
        const validationOutput: { success: boolean; message: string } =
            validateCsv(data);

        //convert the csv to json
        const jsonData: CreateProductInput[] = convertCsvToJson(store_id, data);

        //productService bulkImport
        const products = await productService.bulkImportProducts(
            store_id,
            jsonData
        );

        return handler.returnStatus(200, products);
    });
};
