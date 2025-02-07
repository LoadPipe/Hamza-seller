import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreService from 'src/services/store';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeService: StoreService = req.scope.resolve('storeService');

  const handler = new RouteHandler(req, res, 'POST', '/seller/store/details', [
    'wallet_address',
  ]);

  await handler.handle(async () => {
    if (!handler.inputParams.wallet_address) {
      return handler.returnStatus(400, {
        error: "Missing 'wallet_address' parameter",
      });
    }

    const storeDetails = await storeService.getSellerStoreDetailsByWalletAddress(
      handler.inputParams.wallet_address
    );
    handler.returnStatus(200, storeDetails);
  });
};
