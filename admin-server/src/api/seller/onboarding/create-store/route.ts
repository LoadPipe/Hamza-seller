import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreService from 'src/services/store';
import UserService from 'src/services/user';
import { User } from 'src/models/user';
import jwt from 'jsonwebtoken';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    const userService: UserService = req.scope.resolve('userService');

    const handler = new RouteHandler(
        req,
        res,
        'POST',
        '/seller/onboarding/create-store',
        ['wallet_address']
    );

    await handler.handle(async () => {
        const wallet_address = handler.inputParams.wallet_address;
        const whitelistService = req.scope.resolve('whitelistService');


        if (!wallet_address) {
            return handler.returnStatus(400, {
                error: 'Wallet address is missing; unable to onboard.',
            });
        }

        // Retrieve the user using the wallet address.
        const user = (await userService.retrieveByWalletAddress(
            wallet_address
        )) as User;
        if (!user) {
            return handler.returnStatus(400, {
                error: 'User not found; unable to onboard.',
            });
        }

        let store_id = user.store_id;

        
        if (!store_id) {
            const whitelistRecords = await whitelistService.getByWalletAddress(
                '',
                user.wallet_address
            );
            if (!whitelistRecords || whitelistRecords.length === 0) {
                return handler.returnStatus(403, {
                    error: 'Your wallet address is not whitelisted for store creation.',
                });
            }

            const escrow_metadata = JSON.parse(
                process.env.ESCROW_METADATA || '{}'
            );
            const newStore = await storeService.createStore(
                user,
                '',
                '',
                '',
                '',
                0,
                '',
                escrow_metadata
            );
            store_id = newStore.id;
        }

        const onboardingData = req.body;

        const updatedStore = await storeService.updateSellerStoreDetails(
            store_id,
            onboardingData,
            user.id
        );

        const token = jwt.sign(
            {
                store_id: user.store_id ?? '',
                wallet_address,
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        handler.returnStatus(200, { token, store: updatedStore });
    });
};
