"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const medusa_1 = require("@medusajs/medusa");
const logger_1 = require("../utils/logging/logger");
const typeorm_1 = require("typeorm");
class StoreService extends medusa_1.StoreService {
    constructor(container) {
        super(container);
        this.storeRepository_ = container.storeRepository;
        this.userRepository_ = container.userRepository;
        this.productRepository_ = container.productRepository;
        this.logger = (0, logger_1.createLogger)(container, 'StoreService');
    }
    async createStore(user, store_name, collection, icon, store_followers, store_description, escrow_contract_address) {
        let owner_id = user.id;
        this.logger.debug('owner_id: ' + owner_id);
        const storeRepo = this.manager_.withRepository(this.storeRepository_);
        let newStore = storeRepo.create();
        // newStore.owner = user; // Set the owner
        newStore.name = store_name; // Set the store name
        newStore.owner_id = owner_id; // Set the owner_id
        newStore.icon = icon;
        newStore.store_followers = store_followers;
        newStore.store_description = store_description;
        newStore.default_currency_code = 'eth';
        newStore.escrow_contract_address = escrow_contract_address;
        newStore = await storeRepo.save(newStore);
        this.logger.debug('New Store Saved:' + newStore);
        //save the store id for the user
        user.store_id = newStore.id;
        this.logger.debug(`user ${user.id} getting store ${newStore.id}`);
        await this.userRepository_.save(user);
        return newStore; // Return the newly created and saved store
    }
    async getStores() {
        return this.storeRepository_.find({
            where: { owner_id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) },
        });
    }
    async getStoreNames() {
        const stores = await this.storeRepository_.find({
            select: ['name'],
            where: { owner_id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) },
        });
        return stores.map((store) => store.name);
    }
    async update(data) {
        return super.update(data);
    }
    async getStoreByName(store_name) {
        const storeRepo = this.manager_.withRepository(this.storeRepository_);
        const store = await storeRepo.findOneBy({ name: store_name });
        if (!store) {
            throw new Error(`Store with name ${store_name} not found`);
        }
        return store;
    }
}
StoreService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = StoreService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBa0M7QUFDbEMsNkNBSTBCO0FBTzFCLG9EQUFnRTtBQUNoRSxxQ0FBc0M7QUFZdEMsTUFBTSxZQUFhLFNBQVEscUJBQWtCO0lBT3pDLFlBQVksU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUM7UUFDbEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDO1FBQ2hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUMsaUJBQWlCLENBQUM7UUFDdEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUNiLElBQVUsRUFDVixVQUFrQixFQUNsQixVQUFrQixFQUNsQixJQUFZLEVBQ1osZUFBdUIsRUFDdkIsaUJBQXlCLEVBQ3pCLHVCQUErQjtRQUUvQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsQ0FBQztRQUMzQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEMsMENBQTBDO1FBQzFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMscUJBQXFCO1FBQ2pELFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsbUJBQW1CO1FBQ2pELFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLFFBQVEsQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQzNDLFFBQVEsQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUMvQyxRQUFRLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO1FBQ3ZDLFFBQVEsQ0FBQyx1QkFBdUIsR0FBRyx1QkFBdUIsQ0FBQztRQUMzRCxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxDQUFDO1FBRWpELGdDQUFnQztRQUNoQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLENBQUMsRUFBRSxrQkFBa0IsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEUsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QyxPQUFPLFFBQVEsQ0FBQyxDQUFDLDJDQUEyQztJQUNoRSxDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7WUFDOUIsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUEsYUFBRyxFQUFDLElBQUEsZ0JBQU0sR0FBRSxDQUFDLEVBQUU7U0FDckMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhO1FBQ2YsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1lBQzVDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUNoQixLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBQSxhQUFHLEVBQUMsSUFBQSxnQkFBTSxHQUFFLENBQUMsRUFBRTtTQUNyQyxDQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFzQjtRQUMvQixPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBa0I7UUFDbkMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsVUFBVSxZQUFZLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7QUF4RU0sc0JBQVMsR0FBRyxpQkFBUSxDQUFDLE1BQU0sQ0FBQztBQTJFdkMsa0JBQWUsWUFBWSxDQUFDIn0=