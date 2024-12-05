"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCollectionRepository = void 0;
const database_1 = require("@medusajs/medusa/dist/loaders/database");
const payment_collection_1 = require("@medusajs/medusa/dist/repositories/payment-collection");
const payment_collection_2 = require("../models/payment-collection");
exports.PaymentCollectionRepository = database_1.dataSource
    .getRepository(payment_collection_2.PaymentCollection)
    .extend({
    ...Object.assign(payment_collection_1.PaymentCollectionRepository, {
        target: payment_collection_2.PaymentCollection,
    }),
});
exports.default = exports.PaymentCollectionRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9wYXltZW50LWNvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQW9FO0FBQ3BFLDhGQUF5STtBQUN6SSxxRUFBaUU7QUFFcEQsUUFBQSwyQkFBMkIsR0FBRyxxQkFBVTtLQUNoRCxhQUFhLENBQUMsc0NBQWlCLENBQUM7S0FDaEMsTUFBTSxDQUFDO0lBQ0osR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGdEQUFpQyxFQUFFO1FBQ2hELE1BQU0sRUFBRSxzQ0FBaUI7S0FDNUIsQ0FBQztDQUNMLENBQUMsQ0FBQztBQUVQLGtCQUFlLG1DQUEyQixDQUFDIn0=