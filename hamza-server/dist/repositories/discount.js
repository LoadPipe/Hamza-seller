"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountRepository = void 0;
const discount_1 = require("../models/discount");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
const discount_2 = require("@medusajs/medusa/dist/repositories/discount");
exports.DiscountRepository = database_1.dataSource
    .getRepository(discount_1.Discount)
    .extend({
    // it is important to spread the existing repository here.
    //  Otherwise you will end up losing core properties
    ...Object.assign(discount_2.DiscountRepository, {
        target: discount_1.Discount,
    }),
    async updateDiscountStore(discountId, storeId) {
        const discount = await this.findOne(discountId);
        if (!discount) {
            return null;
        }
        discount.store_id = storeId;
        await this.save(discount);
        return discount;
    }
});
exports.default = exports.DiscountRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL2Rpc2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUE4QztBQUM5QyxxRUFBb0U7QUFDcEUsMEVBQTZHO0FBRWhHLFFBQUEsa0JBQWtCLEdBQUcscUJBQVU7S0FDdkMsYUFBYSxDQUFDLG1CQUFRLENBQUM7S0FDdkIsTUFBTSxDQUFDO0lBQ0osMERBQTBEO0lBQzFELG9EQUFvRDtJQUNwRCxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsNkJBQXdCLEVBQUU7UUFDdkMsTUFBTSxFQUFFLG1CQUFRO0tBQ25CLENBQUM7SUFFRixLQUFLLENBQUMsbUJBQW1CLENBQUMsVUFBa0IsRUFBRSxPQUFlO1FBQ3pELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDWixPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsUUFBUSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDNUIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FDSixDQUFDLENBQUE7QUFHTixrQkFBZSwwQkFBa0IsQ0FBQyJ9