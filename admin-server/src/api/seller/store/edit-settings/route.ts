import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreService from 'src/services/store';
import UserService from 'src/services/user';
import { User } from 'src/models/user';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    const userService: UserService = req.scope.resolve('userService');

    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/seller/store/edit-settings',
        ['store_id', 'wallet_address']
    );

    await handler.handle(async () => {
        const wallet_address = handler.inputParams.wallet_address;

        if (!wallet_address) {
            return handler.returnStatus(400, {
                error: 'Wallet address is missing; unable to create store record.',
            });
        }

        // Retrieve the user using the wallet address.
       const currentUser = (await userService.retrieveByWalletAddress(
           wallet_address
       )) as User;

        if (!currentUser) {
            return handler.returnStatus(400, {
                error: 'User not found; unable to create store record.',
            });
        }

        let store_id = handler.inputParams.store_id || currentUser.store_id;
        if (!store_id) {
            return handler.returnStatus(400, {
                error: "Missing 'store_id' parameter",
            });
        }

        const updates = req.body;
        const updatedStore = await storeService.updateSellerStoreDetails(
            store_id,
            updates,
            currentUser.id
        );

        handler.returnStatus(200, updatedStore);
    });
};
