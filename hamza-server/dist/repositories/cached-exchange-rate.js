"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedExchangeRateRepository = void 0;
const cached_exchange_rate_1 = require("../models/cached-exchange-rate");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
exports.CachedExchangeRateRepository = database_1.dataSource.getRepository(cached_exchange_rate_1.CachedExchangeRate);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGVkLWV4Y2hhbmdlLXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL2NhY2hlZC1leGNoYW5nZS1yYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlFQUFvRTtBQUNwRSxxRUFBb0U7QUFFdkQsUUFBQSw0QkFBNEIsR0FDckMscUJBQVUsQ0FBQyxhQUFhLENBQUMseUNBQWtCLENBQUMsQ0FBQyJ9