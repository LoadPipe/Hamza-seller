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
    const handler = new RouteHandler(req, res, 'POST', '/seller/auth', [
        'store_id',
        'wallet_address',
    ]);

    await handler.handle(async () => {
        const { message, signature } = handler.inputParams;
        const wallet_address = message.address?.trim()?.toLowerCase();

        //verify the signature
        const siweMessage = new SiweMessage(message);
        let siweResponse = await siweMessage.verify({ signature });
        handler.logger.debug(
            'siwe response is ' + JSON.stringify(siweResponse)
        );
        if (!siweResponse.success) {
            throw new Error('Error in validating wallet address signature');
        }

        //get the user record
        let storeOwner = await UserRepository.findOne({
            where: { wallet_address },
        });

        if (!storeOwner) {
            return handler.returnStatusWithMessage(
                404,
                `User with wallet address ${wallet_address} not found.`
            );
        }

        //get the corresponding store
        const options: FindOneOptions<Store> = { owner_id: storeOwner.id };
        const store = await StoreRepository.findOne(options);

        if (!store) {
            return handler.returnStatusWithMessage(
                404,
                `Store with owner ${storeOwner.id} not found.`
            );
        }

        //once authorized, return a JWT token
        const token = jwt.sign(
            {
                store_id: handler.inputParams.store_id,
                wallet_address: handler.inputParams.wallet_address,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '24h',
            }
        );

        return handler.returnStatus(200, token);
    });
};
