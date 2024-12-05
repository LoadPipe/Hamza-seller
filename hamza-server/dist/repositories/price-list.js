"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceListRepository = void 0;
const database_1 = require("@medusajs/medusa/dist/loaders/database");
const price_list_1 = require("@medusajs/medusa/dist/repositories/price-list");
const medusa_1 = require("@medusajs/medusa");
exports.PriceListRepository = database_1.dataSource.getRepository(medusa_1.PriceList).extend({
    ...Object.assign(price_list_1.PriceListRepository, {
        target: medusa_1.PriceList,
    }),
});
exports.default = exports.PriceListRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2UtbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvc2l0b3JpZXMvcHJpY2UtbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxRUFBb0U7QUFDcEUsOEVBQWlIO0FBQ2pILDZDQUE2QztBQUVoQyxRQUFBLG1CQUFtQixHQUFHLHFCQUFVLENBQUMsYUFBYSxDQUFDLGtCQUFTLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDMUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGdDQUF5QixFQUFFO1FBQ3hDLE1BQU0sRUFBRSxrQkFBUztLQUNwQixDQUFDO0NBQ0wsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsMkJBQW1CLENBQUMifQ==