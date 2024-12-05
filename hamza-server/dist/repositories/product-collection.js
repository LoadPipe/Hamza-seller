"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCollectionRepository = void 0;
const product_collection_1 = require("../models/product-collection");
const database_1 = require("@medusajs/medusa/dist/loaders/database");
const product_collection_2 = require("@medusajs/medusa/dist/repositories/product-collection");
exports.ProductCollectionRepository = database_1.dataSource
    .getRepository(product_collection_1.ProductCollection)
    .extend({
    ...Object.assign(product_collection_2.ProductCollectionRepository, {
        target: product_collection_1.ProductCollection,
    }),
});
exports.default = exports.ProductCollectionRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9wcm9kdWN0LWNvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQWlFO0FBQ2pFLHFFQUFvRTtBQUNwRSw4RkFBeUk7QUFFNUgsUUFBQSwyQkFBMkIsR0FBRyxxQkFBVTtLQUNoRCxhQUFhLENBQUMsc0NBQWlCLENBQUM7S0FDaEMsTUFBTSxDQUFDO0lBQ0osR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGdEQUFpQyxFQUFFO1FBQ2hELE1BQU0sRUFBRSxzQ0FBaUI7S0FDNUIsQ0FBQztDQUNMLENBQUMsQ0FBQztBQUVQLGtCQUFlLG1DQUEyQixDQUFDIn0=