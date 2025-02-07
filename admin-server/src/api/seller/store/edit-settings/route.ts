import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreService from 'src/services/store';
import UserService from 'src/services/user';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeService: StoreService = req.scope.resolve('storeService');
  const userService: UserService = req.scope.resolve('userService');

  const handler = new RouteHandler(
    req,
    res,
    'POST',
    '/seller/store/edit-settings',
    ['store_id']
  );

  await handler.handle(async () => {
    const store_id = handler.inputParams.store_id;
    if (!store_id) {
      return handler.returnStatus(400, {
        error: "Missing 'store_id' parameter",
      });
    }

    const updates = req.body;

    const updatedStore = await storeService.updateSellerStoreDetails(store_id, updates);

    handler.returnStatus(200, updatedStore);
  });
};
