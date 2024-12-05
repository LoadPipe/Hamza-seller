"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const logger_1 = require("../utils/logging/logger");
class CartEmailService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.cartService_ = container.cartService;
        this.logger = (0, logger_1.createLogger)(container, 'CartEmailService');
        this.cartEmailRepository = container.cartEmailRepository;
    }
    async setCartEmail(cart_id, email_address) {
        await this.cartEmailRepository.save({ id: cart_id, email_address });
    }
    async getCartEmail(cart_id) {
        const record = await this.cartEmailRepository.findOne({ where: { id: cart_id } });
        return record === null || record === void 0 ? void 0 : record.email_address;
    }
}
exports.default = CartEmailService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydC1lbWFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9jYXJ0LWVtYWlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBRzBCO0FBQzFCLG9EQUFnRTtBQUdoRSxNQUFxQixnQkFBaUIsU0FBUSwrQkFBc0I7SUFLaEUsWUFBWSxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsU0FBUyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQztJQUM3RCxDQUFDO0lBRUQsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFlLEVBQUUsYUFBcUI7UUFDckQsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFBO0lBQ3ZFLENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQWU7UUFDOUIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsRixPQUFPLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxhQUFhLENBQUM7SUFDakMsQ0FBQztDQUNKO0FBcEJELG1DQW9CQyJ9