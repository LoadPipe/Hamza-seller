"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const medusa_1 = require("@medusajs/medusa");
const logger_1 = require("../utils/logging/logger");
class PriceListService extends medusa_1.PriceListService {
    constructor(container) {
        super(container);
        this.priceListRepository_ = container.priceListRepository;
        this.logger = (0, logger_1.createLogger)(container, 'PriceListService');
    }
    //TODO: any needed functions go here
    async create(input) {
        this.logger.debug('creating price list ' + input);
        return await this.priceListRepository_.save(input);
    }
    async update(id, input) {
        return await this.priceListRepository_.save(input);
    }
}
PriceListService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = PriceListService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2UtbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9wcmljZS1saXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWtDO0FBQ2xDLDZDQUkwQjtBQU0xQixvREFBZ0U7QUFVaEUsTUFBcUIsZ0JBQWlCLFNBQVEseUJBQXNCO0lBS2hFLFlBQVksU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQztRQUMxRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsb0NBQW9DO0lBRXBDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBMkI7UUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDbEQsT0FBTyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBVSxFQUFFLEtBQTJCO1FBQ2hELE9BQU8sTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELENBQUM7O0FBbkJNLDBCQUFTLEdBQUcsaUJBQVEsQ0FBQyxNQUFNLENBQUM7a0JBRGxCLGdCQUFnQiJ9