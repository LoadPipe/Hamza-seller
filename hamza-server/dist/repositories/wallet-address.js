"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletAddressRepository = void 0;
const walletAddress_1 = require("../models/walletAddress");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
exports.WalletAddressRepository = database_1.dataSource
    .getRepository(walletAddress_1.WalletAddress);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0LWFkZHJlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL3dhbGxldC1hZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJEQUF3RDtBQUN4RCxxRUFFK0M7QUFFbEMsUUFBQSx1QkFBdUIsR0FBRyxxQkFBVTtLQUM5QyxhQUFhLENBQUMsNkJBQWEsQ0FBQyxDQUFBIn0=