"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerWalletAddressRepository = void 0;
const database_1 = require("@medusajs/medusa/dist/loaders/database");
const customer_wallet_address_1 = require("../models/customer-wallet-address");
exports.CustomerWalletAddressRepository = database_1.dataSource.getRepository(customer_wallet_address_1.CustomerWalletAddress);
exports.default = exports.CustomerWalletAddressRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItd2FsbGV0LWFkZHJlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL2N1c3RvbWVyLXdhbGxldC1hZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUFvRTtBQUNwRSwrRUFBMEU7QUFFN0QsUUFBQSwrQkFBK0IsR0FBRyxxQkFBVSxDQUFDLGFBQWEsQ0FBQywrQ0FBcUIsQ0FBQyxDQUFDO0FBRS9GLGtCQUFlLHVDQUErQixDQUFDIn0=