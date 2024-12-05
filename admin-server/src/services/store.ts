import { Lifetime } from 'awilix';
import {
    StoreService as MedusaStoreService,
    Store,
    Logger,
} from '@medusajs/medusa';
import { User } from '../models/user';
import StoreRepository from '../repositories/store';
import axios from 'axios';
import { UpdateStoreInput as MedusaUpdateStoreInput } from '@medusajs/medusa/dist/types/store';
import { UpdateProductInput as MedusaUpdateProductInput } from '@medusajs/medusa/dist/types/product';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { createLogger, ILogger } from '../utils/logging/logger';
import { IsNull, Not } from 'typeorm';
import UserRepository from 'src/repositories/user';

type UpdateStoreInput = MedusaUpdateStoreInput & {
    massmarket_keycard?: string;
    massmarket_store_id?: string;
};

type UpdateProductInput = MedusaUpdateProductInput & {
    store_id?: string;
};

class StoreService extends MedusaStoreService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly productRepository_: typeof ProductRepository;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly userRepository_: typeof UserRepository;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.storeRepository_ = container.storeRepository;
        this.userRepository_ = container.userRepository;
        this.productRepository_ = container.productRepository;
        this.logger = createLogger(container, 'StoreService');
    }

    async createStore(
        user: User,
        store_name: string,
        collection: string,
        icon: string,
        store_followers: number,
        store_description: string,
        escrow_metadata: any
    ): Promise<Store> {
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
        newStore.escrow_metadata = escrow_metadata;
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
            where: { owner_id: Not(IsNull()) },
        });
    }

    async getStoreNames() {
        const stores = await this.storeRepository_.find({
            select: ['name'],
            where: { owner_id: Not(IsNull()) },
        });
        return stores.map((store) => store.name);
    }

    async update(data: UpdateStoreInput) {
        return super.update(data);
    }

    async getStoreByName(store_name: string): Promise<Store> {
        const storeRepo = this.manager_.withRepository(this.storeRepository_);
        const store = await storeRepo.findOneBy({ name: store_name });
        if (!store) {
            throw new Error(`Store with name ${store_name} not found`);
        }
        return store;
    }

    async getStoreById(store_id: string): Promise<Store> {
        const storeRepo = this.manager_.withRepository(this.storeRepository_);
        const store = await storeRepo.findOneBy({ id: store_id });
        if (!store) {
            throw new Error(`Store with name ${store_id} not found`);
        }
        return store;
    }
}

export default StoreService;
