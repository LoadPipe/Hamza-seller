import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import jwt from 'jsonwebtoken';

/**
 * Authenticates a store by wallet login.
 *
 * INPUTS:
 *
 * OUTPUTS:
 * JWT token
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler = new RouteHandler(req, res, 'POST', '/seller/auth', [
        'store_id',
        'wallet_address',
    ]);

    await handler.handle(async () => {
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
