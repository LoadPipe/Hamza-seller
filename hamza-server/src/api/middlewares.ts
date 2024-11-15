import {
    type MiddlewaresConfig,
    type User,
    type UserService,
    type MedusaNextFunction,
    type MedusaRequest,
    type MedusaResponse,
    Logger,
    generateEntityId,
} from '@medusajs/medusa';
import { asyncLocalStorage, sessionStorage } from '../utils/context';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { readRequestBody } from '../utils/request-body';
import { Store } from '../models/store';
import StoreRepository from '../repositories/store';

const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8000';
const SELLER_CORS = process.env.SELLER_CORS || 'http://localhost:5173';

function getRequestedStoreId(req: MedusaRequest): string {
    if (req.body) {
        const output = readRequestBody(req.body, ['store_id']);
        return output?.store_id?.toString();
    }
    return req.query.store_id?.toString();
}

const ADMIN_CORS =
    process.env.ADMIN_CORS || 'http://localhost:7001;http://localhost:7000';
const registerLoggedInUser = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    const logger = req.scope.resolve('logger') as Logger;

    logger.debug('running logged in user function');
    let loggedInUser: User | null = null;

    if (req.user && req.user.userId) {
        const userService = req.scope.resolve('userService') as UserService;
        loggedInUser = await userService.retrieve(req.user.userId);
    }

    req.scope.register({
        loggedInUser: {
            resolve: () => loggedInUser,
        },
    });

    next();
};

const restrictLoggedInSeller = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    const logger = req.scope.resolve('logger') as Logger;
    const storeRepository: typeof StoreRepository =
        req.scope.resolve('storeRepository');

    let authorized: boolean = false;

    logger.debug(`Auth middleware: token: ${req.headers.authorization}`);

    if (req.headers.authorization) {
        //decode the token //TODO: put this somewhere accessible
        const jwtToken: any = jwt.decode(
            req.headers.authorization
                ?.replace('Bearer', '')
                ?.replace(':', '')
                ?.trim()
        );
        const storeId = jwtToken?.store_id;
        const wallet = jwtToken?.wallet_address;

        const requestedStoreId = getRequestedStoreId(req);

        logger.debug(
            `Auth middleware: wallet: ${wallet}, store: ${storeId}, requested store: ${requestedStoreId}`
        );

        //compare store ids, owners, etc
        if (
            wallet &&
            storeId &&
            requestedStoreId &&
            storeId === requestedStoreId
        ) {
            const store: Store = await storeRepository.findOne({
                where: { id: storeId },
                relations: ['owner'],
            });

            if (store) {
                if (
                    store.owner?.wallet_address?.trim()?.toLowerCase() ===
                    wallet.trim().toLowerCase()
                ) {
                    logger.debug('Authorized');
                    authorized = true;
                } else {
                    logger.warn(
                        `Store ${storeId} wallet address ${store.owner?.wallet_address} != ${wallet}`
                    );
                }
            } else {
                logger.warn(`Store ${storeId} was not found.`);
            }
        }
    }

    if (!authorized) {
        logger.debug('Seller unauthorized');
        res.status(401).json({ status: false });
        return;
    }

    next();
};

export const permissions = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    if (!req.user || !req.user.userId) {
        next();
        return;
    }
    // retrieve currently logged-in user
    const userService = req.scope.resolve('userService') as UserService;
    const loggedInUser = await userService.retrieve(req.user.userId, {
        select: ['id'],
        relations: ['team_role', 'team_role.permissions'],
    });

    if (!loggedInUser.team_role) {
        // considered as super user
        next();
        return;
    }

    const isAllowed = loggedInUser.team_role?.permissions.some((permission) => {
        const metadataKey = Object.keys(permission.metadata).find(
            (key) => key === req.path
        );
        if (!metadataKey) {
            return false;
        }

        // boolean value
        return permission.metadata[metadataKey];
    });

    if (isAllowed) {
        next();
        return;
    }

    // deny access
    res.sendStatus(401);
};

export const config: MiddlewaresConfig = {
    routes: [
        {
            matcher: '/admin/products',
            middlewares: [registerLoggedInUser],
        },
        {
            matcher: '/admin/auth',
            middlewares: [
                cors({
                    origin: [
                        STORE_CORS,
                        'http://localhost:7001',
                        'http://localhost:7000',
                        'http://localhost:9000', // TEST ENV
                    ],
                    credentials: true,
                }),
            ],
        },
        {
            matcher: '/admin/collections',
            middlewares: [
                cors({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
            ],
        },
        {
            matcher: '/seller/order',
            middlewares: [
                cors({
                    origin: [SELLER_CORS],
                    credentials: true,
                }),
                restrictLoggedInSeller,
            ],
        },
        {
            matcher: '/admin/*',
            middlewares: [
                cors({
                    origin: [
                        'http://localhost:7001',
                        'http://localhost:7000',
                        STORE_CORS,
                    ],
                    credentials: true,
                }),
                [permissions],
            ],
        },
        {
            matcher: '/admin/currencies',
            middlewares: [
                cors({
                    origin: '*',
                    credentials: true,
                }),
            ],
        },

        // {
        //     matcher: '/custom/confirmation-token/generate',
        //     // middlewares: [authenticateCustomer(), registerLoggedInCustomer],
        // },
    ],
};
