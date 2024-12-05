"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistoryRepository = void 0;
const order_history_1 = require("../models/order-history");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
exports.OrderHistoryRepository = database_1.dataSource.getRepository(order_history_1.OrderHistory);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItaGlzdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvc2l0b3JpZXMvb3JkZXItaGlzdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBdUQ7QUFDdkQscUVBQW9FO0FBRXZELFFBQUEsc0JBQXNCLEdBQUcscUJBQVUsQ0FBQyxhQUFhLENBQUMsNEJBQVksQ0FBQyxDQUFDIn0=