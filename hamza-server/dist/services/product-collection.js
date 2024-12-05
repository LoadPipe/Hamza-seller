"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const medusa_1 = require("@medusajs/medusa");
const typeorm_1 = require("typeorm");
const logger_1 = require("../utils/logging/logger");
class ProductCollectionService extends medusa_1.ProductCollectionService {
    constructor(container) {
        super(container);
        this.productCollectionRepository_ =
            container.productCollectionRepository;
        this.logger = (0, logger_1.createLogger)(container, 'ProductCollectionService');
    }
    async update(id, input) {
        const result = await this.productCollectionRepository_.update(id, input);
        return this.productCollectionRepository_.findOne({
            where: { id },
        });
    }
    async create(input) {
        return this.productCollectionRepository_.save(input);
    }
    async addProducts(collection_id, product_ids) {
        //get the collection
        const collection = await this.productCollectionRepository_.findOne({
            where: { id: collection_id },
        });
        //verify that collection exists
        if (!collection)
            throw new Error(`Collection with id ${collection} not found.`);
        //verify that each product
        await this.verifyProductsInStore(collection.store_id, product_ids);
        //add the products
        await super.addProducts(collection_id, product_ids);
        //return the array of products
        return this.productCollectionRepository_.findOne({
            where: { id: collection_id },
        });
    }
    async verifyProductsInStore(store_id, product_ids) {
        //TODO: complete this check; will require extending product repository too
        //get all products
        const products = await this.productRepository_.find({
            where: { id: (0, typeorm_1.In)(product_ids) /*store_id: store_id*/ },
        });
        //check each one
        products.forEach((p) => {
            //if (p.store_id != store_id) return false;
        });
        return true;
    }
}
ProductCollectionService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = ProductCollectionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3Byb2R1Y3QtY29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFrQztBQUNsQyw2Q0FHMEI7QUFPMUIscUNBQTJDO0FBQzNDLG9EQUFnRTtBQVVoRSxNQUFxQix3QkFBeUIsU0FBUSxpQ0FBOEI7SUFLaEYsWUFBWSxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsNEJBQTRCO1lBQzdCLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FDUixFQUFVLEVBQ1YsS0FBOEI7UUFFOUIsTUFBTSxNQUFNLEdBQ1IsTUFBTSxJQUFJLENBQUMsNEJBQTRCLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5RCxPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPLENBQUM7WUFDN0MsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFO1NBQ2hCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQThCO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FDYixhQUFxQixFQUNyQixXQUFxQjtRQUVyQixvQkFBb0I7UUFDcEIsTUFBTSxVQUFVLEdBQ1osTUFBTSxJQUFJLENBQUMsNEJBQTRCLENBQUMsT0FBTyxDQUFDO1lBQzVDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxhQUFhLEVBQUU7U0FDL0IsQ0FBQyxDQUFDO1FBRVAsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxVQUFVO1lBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsVUFBVSxhQUFhLENBQUMsQ0FBQztRQUVuRSwwQkFBMEI7UUFDMUIsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVuRSxrQkFBa0I7UUFDbEIsTUFBTSxLQUFLLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVwRCw4QkFBOEI7UUFDOUIsT0FBTyxJQUFJLENBQUMsNEJBQTRCLENBQUMsT0FBTyxDQUFDO1lBQzdDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxhQUFhLEVBQUU7U0FDL0IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVTLEtBQUssQ0FBQyxxQkFBcUIsQ0FDakMsUUFBZ0IsRUFDaEIsV0FBcUI7UUFFckIsMEVBQTBFO1FBRTFFLGtCQUFrQjtRQUNsQixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7WUFDaEQsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUEsWUFBRSxFQUFDLFdBQVcsQ0FBQyxDQUFDLHNCQUFzQixFQUFFO1NBQ3hELENBQUMsQ0FBQztRQUVILGdCQUFnQjtRQUNoQixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDbkIsMkNBQTJDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7QUFyRU0sa0NBQVMsR0FBRyxpQkFBUSxDQUFDLE1BQU0sQ0FBQztrQkFEbEIsd0JBQXdCIn0=