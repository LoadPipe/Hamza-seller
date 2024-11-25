import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import jwt from 'jsonwebtoken';
import UserRepository from '../../../repositories/user';
import StoreRepository from '../../../repositories/store';
import { SiweMessage } from 'siwe';
import { Store } from '../../../models/store';
import { FindOneOptions as TypeOrmFindOneOptions } from 'typeorm';

interface FindOneOptions<Store> extends TypeOrmFindOneOptions<Store> {
    owner_id?: string;
}

/**
 * Authenticates a store by wallet login.
 *
 * INPUTS:
 *
 * OUTPUTS:
 * JWT token
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeRepository: typeof StoreRepository =
        req.scope.resolve('storeRepository');

    const handler = new RouteHandler(req, res, 'POST', '/seller/auth', [
        'message',
        'signature',
    ]);

    await handler.handle(async () => {
        const { message, signature } = handler.inputParams;

        //verify the signature
        const siweMessage = new SiweMessage(message);
        let siweResponse = await siweMessage.verify({ signature });
        handler.logger.debug(
            'siwe response is ' + JSON.stringify(siweResponse)
        );
        if (!siweResponse.success) {
            throw new Error('Error in validating wallet address signature');
        }

        const wallet_address = siweResponse.data?.address
            ?.trim()
            ?.toLowerCase();

        console.log('Wallet adddy', wallet_address);
        //get the user record
        handler.logger.debug('finding user...');
        let storeOwner = await UserRepository.findOne({
            where: { wallet_address },
        });
        handler.logger.debug('found user ' + storeOwner?.id);
        console.log('store owner id', storeOwner);
        if (!storeOwner) {
            return handler.returnStatusWithMessage(
                404,
                `User with wallet address ${wallet_address} not found.`
            );
        }

        //get the corresponding store
        handler.logger.debug('finding store...');
        const options: FindOneOptions<Store> = {
            where: { owner_id: storeOwner.id },
        };
        const store = await storeRepository.findOne(options);

        if (!store) {
            return handler.returnStatusWithMessage(
                404,
                `Store with owner ${storeOwner.id} not found.`
            );
        }

        //once authorized, return a JWT token
        const token = jwt.sign(
            {
                store_id: store.id,
                wallet_address,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '24h',
            }
        );

        return handler.returnStatus(200, token);
    });
};
