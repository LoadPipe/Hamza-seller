"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const route_handler_1 = require("../../route-handler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../../repositories/user"));
const siwe_1 = require("siwe");
/**
 * Authenticates a store by wallet login.
 *
 * INPUTS:
 *
 * OUTPUTS:
 * JWT token
 */
const POST = async (req, res) => {
    const storeRepository = req.scope.resolve('storeRepository');
    const handler = new route_handler_1.RouteHandler(req, res, 'POST', '/seller/auth', [
        'message',
        'signature',
    ]);
    await handler.handle(async () => {
        var _a, _b, _c, _d;
        const { message, signature } = handler.inputParams;
        //verify the signature
        const siweMessage = new siwe_1.SiweMessage(message);
        let siweResponse = await siweMessage.verify({ signature });
        handler.logger.debug('siwe response is ' + JSON.stringify(siweResponse));
        if (!siweResponse.success) {
            throw new Error('Error in validating wallet address signature');
        }
        const wallet_address = (_c = (_b = (_a = siweResponse.data) === null || _a === void 0 ? void 0 : _a.address) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
        //get the user record
        handler.logger.debug('finding user...');
        let storeUser = await user_1.default.findOne({
            where: { wallet_address },
        });
        handler.logger.debug('found user ' + (storeUser === null || storeUser === void 0 ? void 0 : storeUser.id));
        if (!storeUser) {
            return handler.returnStatusWithMessage(404, `User with wallet address ${wallet_address} not found.`);
        }
        //once authorized, return a JWT token
        const token = jsonwebtoken_1.default.sign({
            store_id: (_d = storeUser.store_id) !== null && _d !== void 0 ? _d : '',
            wallet_address,
        }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });
        return handler.returnStatus(200, token);
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL3NlbGxlci9hdXRoL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHVEQUFtRDtBQUNuRCxnRUFBK0I7QUFDL0Isc0VBQXdEO0FBRXhELCtCQUFtQztBQVFuQzs7Ozs7OztHQU9HO0FBQ0ksTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ2xFLE1BQU0sZUFBZSxHQUNqQixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBRXpDLE1BQU0sT0FBTyxHQUFHLElBQUksNEJBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUU7UUFDL0QsU0FBUztRQUNULFdBQVc7S0FDZCxDQUFDLENBQUM7SUFFSCxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7O1FBQzVCLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUVuRCxzQkFBc0I7UUFDdEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxrQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUksWUFBWSxHQUFHLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDM0QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ2hCLG1CQUFtQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQ3JELENBQUM7UUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsTUFBTSxjQUFjLEdBQUcsTUFBQSxNQUFBLE1BQUEsWUFBWSxDQUFDLElBQUksMENBQUUsT0FBTywwQ0FDM0MsSUFBSSxFQUFFLDBDQUNOLFdBQVcsRUFBRSxDQUFDO1FBRXBCLHFCQUFxQjtRQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hDLElBQUksU0FBUyxHQUFHLE1BQU0sY0FBYyxDQUFDLE9BQU8sQ0FBQztZQUN6QyxLQUFLLEVBQUUsRUFBRSxjQUFjLEVBQUU7U0FDNUIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxJQUFHLFNBQVMsYUFBVCxTQUFTLHVCQUFULFNBQVMsQ0FBRSxFQUFFLENBQUEsQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNiLE9BQU8sT0FBTyxDQUFDLHVCQUF1QixDQUNsQyxHQUFHLEVBQ0gsNEJBQTRCLGNBQWMsYUFBYSxDQUMxRCxDQUFDO1FBQ04sQ0FBQztRQUVELHFDQUFxQztRQUNyQyxNQUFNLEtBQUssR0FBRyxzQkFBRyxDQUFDLElBQUksQ0FDbEI7WUFDSSxRQUFRLEVBQUUsTUFBQSxTQUFTLENBQUMsUUFBUSxtQ0FBSSxFQUFFO1lBQ2xDLGNBQWM7U0FDakIsRUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFDdEI7WUFDSSxTQUFTLEVBQUUsS0FBSztTQUNuQixDQUNKLENBQUM7UUFFRixPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBdERXLFFBQUEsSUFBSSxRQXNEZiJ9