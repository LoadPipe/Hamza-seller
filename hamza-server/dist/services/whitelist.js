"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const customer_1 = __importDefault(require("../repositories/customer"));
const whitelist_1 = require("../repositories/whitelist");
const typeorm_1 = require("typeorm");
const logger_1 = require("../utils/logging/logger");
class WhiteListService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.customerRepository_ = customer_1.default;
        this.whitelistRepository_ = whitelist_1.WhiteListRepository;
        this.logger = (0, logger_1.createLogger)(container, 'WhiteListService');
    }
    async create(storeId, walletAddress) {
        var _a, _b;
        if (!((_a = (await this.getByWalletAddress(storeId, walletAddress))) === null || _a === void 0 ? void 0 : _a.length)) {
            return this.whitelistRepository_.save({
                id: (0, medusa_1.generateEntityId)(null, 'whitelist'),
                store_id: storeId,
                wallet_address: (_b = walletAddress === null || walletAddress === void 0 ? void 0 : walletAddress.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase()
            });
        }
    }
    async remove(storeId, walletAddress) {
        var _a;
        await this.whitelistRepository_.delete({
            store_id: storeId,
            wallet_address: (_a = walletAddress === null || walletAddress === void 0 ? void 0 : walletAddress.trim()) === null || _a === void 0 ? void 0 : _a.toLowerCase()
        });
        return;
    }
    async getByCustomerId(storeId, customerId) {
        this.logger.debug(`getting whitelist ${storeId}, ${customerId}`);
        const customer = await this.customerRepository_.findOne({ where: { id: customerId }, relations: ['walletAddresses'] });
        if (customer && customer.walletAddresses) {
            return this.whitelistRepository_.find({
                where: {
                    store_id: storeId,
                    wallet_address: (0, typeorm_1.In)(customer.walletAddresses.map(w => { var _a, _b, _c; return (_c = (_b = (_a = w.wallet_address) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== null && _c !== void 0 ? _c : ''; }))
                },
                //relations: ['items']
            });
        }
        return [];
    }
    async getByWalletAddress(storeId, walletAddress) {
        var _a;
        return this.whitelistRepository_.find({
            where: {
                store_id: storeId,
                wallet_address: (_a = walletAddress === null || walletAddress === void 0 ? void 0 : walletAddress.trim()) === null || _a === void 0 ? void 0 : _a.toLowerCase()
            },
            //relations: ['items']
        });
        return [];
    }
}
exports.default = WhiteListService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hpdGVsaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3doaXRlbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZDQUFvRjtBQUNwRix3RUFBMEQ7QUFDMUQseURBQWdFO0FBRWhFLHFDQUE2QjtBQUM3QixvREFBZ0U7QUFHaEUsTUFBcUIsZ0JBQWlCLFNBQVEsK0JBQXNCO0lBS2hFLFlBQVksU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGtCQUFrQixDQUFDO1FBQzlDLElBQUksQ0FBQyxvQkFBb0IsR0FBRywrQkFBbUIsQ0FBQztRQUNoRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFlLEVBQUUsYUFBcUI7O1FBQy9DLElBQUksQ0FBQyxDQUFBLE1BQUEsQ0FBQyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsMENBQUUsTUFBTSxDQUFBLEVBQUUsQ0FBQztZQUNuRSxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7Z0JBQ2xDLEVBQUUsRUFBRSxJQUFBLHlCQUFnQixFQUFDLElBQUksRUFBRSxXQUFXLENBQUM7Z0JBQ3ZDLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixjQUFjLEVBQUUsTUFBQSxhQUFhLGFBQWIsYUFBYSx1QkFBYixhQUFhLENBQUUsSUFBSSxFQUFFLDBDQUFFLFdBQVcsRUFBRTthQUN2RCxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBZSxFQUFFLGFBQXFCOztRQUMvQyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUM7WUFDbkMsUUFBUSxFQUFFLE9BQU87WUFDakIsY0FBYyxFQUFFLE1BQUEsYUFBYSxhQUFiLGFBQWEsdUJBQWIsYUFBYSxDQUFFLElBQUksRUFBRSwwQ0FBRSxXQUFXLEVBQUU7U0FDdkQsQ0FBQyxDQUFDO1FBQ0gsT0FBTztJQUNYLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQWUsRUFBRSxVQUFrQjtRQUNyRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsT0FBTyxLQUFLLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDakUsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRXRILElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7Z0JBQ2xDLEtBQUssRUFBRTtvQkFDSCxRQUFRLEVBQUUsT0FBTztvQkFDakIsY0FBYyxFQUFFLElBQUEsWUFBRSxFQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG1CQUFDLE9BQUEsTUFBQSxNQUFBLE1BQUEsQ0FBQyxDQUFDLGNBQWMsMENBQUUsSUFBSSxFQUFFLDBDQUFFLFdBQVcsRUFBRSxtQ0FBSSxFQUFFLENBQUEsRUFBQSxDQUFDLENBQUM7aUJBQ3ZHO2dCQUNELHNCQUFzQjthQUN6QixDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQWUsRUFBRSxhQUFxQjs7UUFDM0QsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO1lBQ2xDLEtBQUssRUFBRTtnQkFDSCxRQUFRLEVBQUUsT0FBTztnQkFDakIsY0FBYyxFQUFFLE1BQUEsYUFBYSxhQUFiLGFBQWEsdUJBQWIsYUFBYSxDQUFFLElBQUksRUFBRSwwQ0FBRSxXQUFXLEVBQUU7YUFDdkQ7WUFDRCxzQkFBc0I7U0FDekIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0NBQ0o7QUExREQsbUNBMERDIn0=