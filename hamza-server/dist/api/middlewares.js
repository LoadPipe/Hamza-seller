"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.permissions = void 0;
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const request_body_1 = require("../utils/request-body");
const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8000';
const SELLER_CORS = process.env.SELLER_CORS || 'http://localhost:5173';
const SELLER_AUTH_ENABLED = false;
function getRequestParam(req, param) {
    var _a, _b;
    if (req.body) {
        const output = (0, request_body_1.readRequestBody)(req.body, [param]);
        if (output[param])
            return (_a = output[param]) === null || _a === void 0 ? void 0 : _a.toString();
    }
    return (_b = req.query[param]) === null || _b === void 0 ? void 0 : _b.toString();
}
function getRequestedStoreId(req) {
    return getRequestParam(req, 'store_id');
}
function getRequestedOrderId(req) {
    return getRequestParam(req, 'order_id');
}
const ADMIN_CORS = process.env.ADMIN_CORS || 'http://localhost:7001;http://localhost:7000';
const registerLoggedInUser = async (req, res, next) => {
    const logger = req.scope.resolve('logger');
    logger.debug('running logged in user function');
    let loggedInUser = null;
    if (req.user && req.user.userId) {
        const userService = req.scope.resolve('userService');
        loggedInUser = await userService.retrieve(req.user.userId);
    }
    req.scope.register({
        loggedInUser: {
            resolve: () => loggedInUser,
        },
    });
    next();
};
const restrictLoggedInSeller = async (req, res, next) => {
    var _a, _b, _c, _d, _e, _f, _g;
    //ignore if disabled
    if (!SELLER_AUTH_ENABLED) {
        next();
        return;
    }
    const logger = req.scope.resolve('logger');
    const storeRepository = req.scope.resolve('storeRepository');
    const orderRepository = req.scope.resolve('orderRepository');
    let authorized = false;
    logger.debug(`Auth middleware: token: ${req.headers.authorization}`);
    if (req.headers.authorization) {
        //decode the token //TODO: put this somewhere accessible
        const jwtToken = jsonwebtoken_1.default.decode((_c = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer', '')) === null || _b === void 0 ? void 0 : _b.replace(':', '')) === null || _c === void 0 ? void 0 : _c.trim());
        const storeId = jwtToken === null || jwtToken === void 0 ? void 0 : jwtToken.store_id;
        const wallet = jwtToken === null || jwtToken === void 0 ? void 0 : jwtToken.wallet_address;
        const requestedStoreId = getRequestedStoreId(req);
        const requestedOrderId = getRequestedOrderId(req);
        logger.debug(`Auth middleware: wallet: ${wallet}, store: ${storeId}, requested store: ${requestedStoreId}, requested order: ${requestedOrderId}`);
        //compare store ids, owners, etc
        if (wallet && storeId) {
            let eligible = false;
            //if there is a requested store id, then it's only eligible if it matches the store id from the token
            if (requestedStoreId === null || requestedStoreId === void 0 ? void 0 : requestedStoreId.length) {
                eligible = (requestedStoreId === null || requestedStoreId === void 0 ? void 0 : requestedStoreId.trim()) == storeId.trim();
                if (!eligible)
                    logger.warn(`Request for store ${requestedStoreId} by ${storeId} is invalid`);
            }
            else if (requestedOrderId === null || requestedOrderId === void 0 ? void 0 : requestedOrderId.length) {
                //if there's an order id, then it should belong to the right store
                eligible = (await orderRepository.findOne({
                    where: {
                        id: requestedOrderId,
                        store_id: storeId,
                    },
                }))
                    ? true
                    : false;
                if (!eligible)
                    logger.warn(`Request for order ${requestedOrderId} by ${storeId} is invalid`);
            }
            //if eligible to this point, check that the store exists and that it belongs to the right guy
            if (eligible) {
                const store = await storeRepository.findOne({
                    where: { id: storeId },
                    relations: ['owner'],
                });
                if (store) {
                    if (((_f = (_e = (_d = store.owner) === null || _d === void 0 ? void 0 : _d.wallet_address) === null || _e === void 0 ? void 0 : _e.trim()) === null || _f === void 0 ? void 0 : _f.toLowerCase()) ===
                        wallet.trim().toLowerCase()) {
                        //finally, auth is set to true, if all of the conditions are true
                        logger.debug('Authorized');
                        authorized = true;
                    }
                    else {
                        logger.warn(`Store ${storeId} wallet address ${(_g = store.owner) === null || _g === void 0 ? void 0 : _g.wallet_address} != ${wallet}`);
                    }
                }
                else {
                    logger.warn(`Store ${storeId} was not found.`);
                }
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
const permissions = async (req, res, next) => {
    var _a;
    if (!req.user || !req.user.userId) {
        next();
        return;
    }
    // retrieve currently logged-in user
    const userService = req.scope.resolve('userService');
    const loggedInUser = await userService.retrieve(req.user.userId, {
        select: ['id'],
        relations: ['team_role', 'team_role.permissions'],
    });
    if (!loggedInUser.team_role) {
        // considered as super user
        next();
        return;
    }
    const isAllowed = (_a = loggedInUser.team_role) === null || _a === void 0 ? void 0 : _a.permissions.some((permission) => {
        const metadataKey = Object.keys(permission.metadata).find((key) => key === req.path);
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
exports.permissions = permissions;
exports.config = {
    routes: [
        {
            matcher: '/admin/products',
            middlewares: [registerLoggedInUser],
        },
        {
            matcher: '/admin/auth',
            middlewares: [
                (0, cors_1.default)({
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
                (0, cors_1.default)({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
            ],
        },
        {
            matcher: '/seller/order',
            middlewares: [
                (0, cors_1.default)({
                    origin: [SELLER_CORS],
                    credentials: true,
                }),
                restrictLoggedInSeller,
            ],
        },
        {
            matcher: '/seller',
            middlewares: [
                (0, cors_1.default)({
                    origin: [SELLER_CORS],
                    credentials: true,
                }),
            ],
        },
        {
            matcher: '/admin/*',
            middlewares: [
                (0, cors_1.default)({
                    origin: [
                        'http://localhost:7001',
                        'http://localhost:7000',
                        STORE_CORS,
                    ],
                    credentials: true,
                }),
                [exports.permissions],
            ],
        },
        {
            matcher: '/admin/currencies',
            middlewares: [
                (0, cors_1.default)({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQVdBLGdEQUF3QjtBQUN4QixnRUFBK0I7QUFDL0Isd0RBQXdEO0FBS3hELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLHVCQUF1QixDQUFDO0FBQ3JFLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLHVCQUF1QixDQUFDO0FBQ3ZFLE1BQU0sbUJBQW1CLEdBQVksS0FBSyxDQUFDO0FBRTNDLFNBQVMsZUFBZSxDQUFDLEdBQWtCLEVBQUUsS0FBYTs7SUFDdEQsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxNQUFNLE1BQU0sR0FBRyxJQUFBLDhCQUFlLEVBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxNQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQUUsUUFBUSxFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUNELE9BQU8sTUFBQSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQywwQ0FBRSxRQUFRLEVBQUUsQ0FBQztBQUN4QyxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxHQUFrQjtJQUMzQyxPQUFPLGVBQWUsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQUMsR0FBa0I7SUFDM0MsT0FBTyxlQUFlLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFFRCxNQUFNLFVBQVUsR0FDWixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSw2Q0FBNkMsQ0FBQztBQUM1RSxNQUFNLG9CQUFv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