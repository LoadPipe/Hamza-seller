import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import StoreOrderService from '../../../services/store-order';
import { PriceConverter } from 'src/utils/price-conversion';
import { CachedExchangeRateRepository } from 'src/repositories/cached-exchange-rate';
import { Price } from 'src/services/product';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: StoreOrderService =
        req.scope.resolve('storeOrderService');

    const handler = new RouteHandler(req, res, 'POST', '/seller/order', []);

    await handler.handle(async () => {
        const cachedExchangeRateRepository: typeof CachedExchangeRateRepository =
            req.scope.resolve('cachedExchangeRateRepository');

        const rates = {
            'usdc-eth': 0,
            'eth-usdc': 0,
            'usdt-eth': 0,
            'eth-usdt': 0,
            'usdc-usdt': 0,
            'usdt-usdc': 0,
        };

        return rates;
    });
};
