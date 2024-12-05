"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const logger_1 = require("../utils/logging/logger");
class DiscountService extends medusa_1.DiscountService {
    constructor(container) {
        super(container);
        this.discountRepository_ = container.discountRepository;
        this.logger = (0, logger_1.createLogger)(container, 'DiscountService');
    }
    async update(id, input) {
        this.logger.debug(`updating product collection ${id}, ${input}`);
        await this.discountRepository_.updateDiscountStore(id, input.store_id);
        return await super.update(id, input);
    }
    async create(discount) {
        let newDiscount = await this.create(discount);
        await this.discountRepository_.updateDiscountStore(newDiscount.id, discount.store_id);
        return newDiscount;
    }
}
exports.default = DiscountService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvZGlzY291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2Q0FJMEI7QUFNMUIsb0RBQWdFO0FBVWhFLE1BQXFCLGVBQWdCLFNBQVEsd0JBQXFCO0lBSTlELFlBQVksU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQztRQUN4RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFVLEVBQUUsS0FBcUI7UUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0JBQStCLEVBQUUsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkUsT0FBTyxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQXdCO1FBQ2pDLElBQUksV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FDOUMsV0FBVyxDQUFDLEVBQUUsRUFDZCxRQUFRLENBQUMsUUFBUSxDQUNwQixDQUFDO1FBQ0YsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztDQUNKO0FBeEJELGtDQXdCQyJ9