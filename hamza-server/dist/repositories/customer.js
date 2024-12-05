"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const customer_1 = require("../models/customer");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
const customer_2 = require("@medusajs/medusa/dist/repositories/customer");
exports.CustomerRepository = database_1.dataSource
    .getRepository(customer_1.Customer)
    .extend({
    // it is important to spread the existing repository here.
    //  Otherwise you will end up losing core properties
    ...Object.assign(customer_2.CustomerRepository, {
        target: customer_1.Customer,
    }),
    async findByWalletAddress(wallet_address) {
        return this.findOne({
            where: { wallet_address },
            relations: {
                preferred_currency: true
            }
        });
    },
});
exports.default = exports.CustomerRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL2N1c3RvbWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUE4QztBQUM5QyxxRUFBb0U7QUFDcEUsMEVBQTZHO0FBRWhHLFFBQUEsa0JBQWtCLEdBQUcscUJBQVU7S0FDekMsYUFBYSxDQUFDLG1CQUFRLENBQUM7S0FDdkIsTUFBTSxDQUFDO0lBQ04sMERBQTBEO0lBQzFELG9EQUFvRDtJQUNwRCxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsNkJBQXdCLEVBQUU7UUFDekMsTUFBTSxFQUFFLG1CQUFRO0tBQ2pCLENBQUM7SUFFRixLQUFLLENBQUMsbUJBQW1CLENBQUMsY0FBc0I7UUFDOUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ2xCLEtBQUssRUFBRSxFQUFFLGNBQWMsRUFBRTtZQUN6QixTQUFTLEVBQUU7Z0JBQ1Qsa0JBQWtCLEVBQUUsSUFBSTthQUN6QjtTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUE7QUFHSixrQkFBZSwwQkFBa0IsQ0FBQSJ9