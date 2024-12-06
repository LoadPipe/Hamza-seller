import { TransactionBaseService } from '@medusajs/medusa/dist/interfaces';
import { Customer, CustomerService, Logger } from '@medusajs/medusa';
import { MedusaError } from 'medusa-core-utils';
import { Lifetime } from 'awilix';
import { WishlistItem } from '../models/wishlist-item';
import { Wishlist } from '../models/wishlist';
import { createLogger, ILogger } from '../utils/logging/logger';
import ProductService from './product';

class WishlistService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: ILogger;
    protected readonly customerService: CustomerService;
    protected readonly productService: ProductService;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'WishlistService');
        this.customerService = container.customerService;
        this.productService = container.productService;
    }

    async createOrRetrieve(customer_id: string) {
        const wishlistRepository = this.activeManager_.getRepository(Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            if (!customer_id) {
                throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    `A customer_id must be provided when creating a wishlist`
                );
            }

            // Check if a wishlist-dropdown already exists for the customer_id
            const [wishlist] = await wishlistRepository.find({
                where: { customer_id },
                relations: [
                    'items',
                    'items.variant.product',
                    'items.variant.prices',
                ],
            });

            if (wishlist) {
                let customer_id = wishlist.customer_id;
                // Wishlist already exists, return it
                this.logger.debug('Wishlist already exists for this customer');
                for (const item of wishlist.items) {
                    if (item.variant) {
                        item.variant =
                            await this.productService.convertVariantPrice(
                                item.variant,
                                customer_id
                            );
                    }
                }
                return wishlist;
            }

            const payload = {
                customer_id,
            };

            //check for existing customer
            if (await this.customerExists(customer_id)) {
                const createdWishlist = wishlistRepository.create(payload);
                const savedWishList =
                    await wishlistRepository.save(createdWishlist);

                const [wishlist] = await wishlistRepository.find({
                    where: { id: savedWishList.id },
                    relations: ['items', 'items.variant.product'],
                });

                return wishlist;
            }

            return null;
        });
    }

    async addWishItem(
        customer_id: string,
        variant_id: string
    ): Promise<Wishlist> {
        const wishlistItemRepository =
            this.activeManager_.getRepository(WishlistItem);
        const wishlistRepository = this.activeManager_.getRepository(Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            // Find the wishlist-dropdown based on the customer_id
            const wishlist = await wishlistRepository.findOne({
                where: { customer_id },
            });

            if (!wishlist) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `Wishlist not found for customer with ID ${customer_id}`
                );
            }

            // Check if the item already exists in the wishlist-dropdown
            const [item] = await wishlistItemRepository.find({
                where: { wishlist_id: wishlist.id, variant_id },
            });

            if (!item) {
                // Create a new wishlist-dropdown item if it doesn't already exist
                const createdItem = wishlistItemRepository.create({
                    wishlist_id: wishlist.id,
                    variant_id,
                });
                await wishlistItemRepository.save(createdItem);
            }

            // Fetch the updated wishlist-dropdown with items
            const updatedWishlist = await wishlistRepository.findOne({
                where: { id: wishlist.id },
                relations: ['items', 'items.variant.product'],
            });

            return updatedWishlist;
        });
    }

    async removeWishItem(
        customer_id: string,
        variant_id: string
    ): Promise<Wishlist> {
        const wishlistItemRepository =
            this.activeManager_.getRepository(WishlistItem);
        const wishlistRepository = this.activeManager_.getRepository(Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            // Find the wishlist-dropdown based on the customer_id
            const wishlist = await wishlistRepository.findOne({
                where: { customer_id },
            });

            if (!wishlist) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `Wishlist not found for customer with ID ${customer_id}`
                );
            }
            // Find the wishlist-dropdown item based on the wishlist_id and variant_id
            const item = await wishlistItemRepository.findOne({
                where: { wishlist_id: wishlist.id, variant_id },
            });

            if (!item) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `Item not found in wishlist for customer with ID ${customer_id}`
                );
            }

            // Remove the item from the wishlist-dropdown
            await wishlistItemRepository.remove(item);

            // Fetch the updated wishlist-dropdown with items
            const updatedWishlist = await wishlistRepository.findOne({
                where: { id: wishlist.id },
                relations: ['items', 'items.variant.product'],
            });

            return updatedWishlist;
        });
    }

    private async customerExists(customerId: string): Promise<boolean> {
        try {
            const customer = await this.customerService.retrieve(customerId);
            return customer ? true : false;
        } catch (e: any) {
            return false;
        }
    }
}

export default WishlistService;
