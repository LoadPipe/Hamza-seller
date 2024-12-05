"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("@medusajs/medusa/dist/interfaces");
const medusa_core_utils_1 = require("medusa-core-utils");
const awilix_1 = require("awilix");
const wishlist_item_1 = require("../models/wishlist-item");
const wishlist_1 = require("../models/wishlist");
const logger_1 = require("../utils/logging/logger");
class WishlistService extends interfaces_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.logger = (0, logger_1.createLogger)(container, 'WishlistService');
        this.customerService = container.customerService;
        this.productService = container.productService;
    }
    async createOrRetrieve(customer_id) {
        const wishlistRepository = this.activeManager_.getRepository(wishlist_1.Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            if (!customer_id) {
                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, `A customer_id must be provided when creating a wishlist`);
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
                            await this.productService.convertVariantPrice(item.variant, customer_id);
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
                const savedWishList = await wishlistRepository.save(createdWishlist);
                const [wishlist] = await wishlistRepository.find({
                    where: { id: savedWishList.id },
                    relations: ['items', 'items.variant.product'],
                });
                return wishlist;
            }
            return null;
        });
    }
    async addWishItem(customer_id, variant_id) {
        const wishlistItemRepository = this.activeManager_.getRepository(wishlist_item_1.WishlistItem);
        const wishlistRepository = this.activeManager_.getRepository(wishlist_1.Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            // Find the wishlist-dropdown based on the customer_id
            const wishlist = await wishlistRepository.findOne({
                where: { customer_id },
            });
            if (!wishlist) {
                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, `Wishlist not found for customer with ID ${customer_id}`);
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
    async removeWishItem(customer_id, variant_id) {
        const wishlistItemRepository = this.activeManager_.getRepository(wishlist_item_1.WishlistItem);
        const wishlistRepository = this.activeManager_.getRepository(wishlist_1.Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            // Find the wishlist-dropdown based on the customer_id
            const wishlist = await wishlistRepository.findOne({
                where: { customer_id },
            });
            if (!wishlist) {
                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, `Wishlist not found for customer with ID ${customer_id}`);
            }
            // Find the wishlist-dropdown item based on the wishlist_id and variant_id
            const item = await wishlistItemRepository.findOne({
                where: { wishlist_id: wishlist.id, variant_id },
            });
            if (!item) {
                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, `Item not found in wishlist for customer with ID ${customer_id}`);
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
    async customerExists(customerId) {
        try {
            const customer = await this.customerService.retrieve(customerId);
            return customer ? true : false;
        }
        catch (e) {
            return false;
        }
    }
}
WishlistService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = WishlistService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lzaGxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvd2lzaGxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpRUFBMEU7QUFFMUUseURBQWdEO0FBQ2hELG1DQUFrQztBQUNsQywyREFBdUQ7QUFDdkQsaURBQThDO0FBQzlDLG9EQUFnRTtBQUdoRSxNQUFNLGVBQWdCLFNBQVEsbUNBQXNCO0lBTWhELFlBQVksU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDO1FBQ2pELElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFdBQW1CO1FBQ3RDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsbUJBQVEsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxFQUFFO1lBQ3hELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDZixNQUFNLElBQUksK0JBQVcsQ0FDakIsK0JBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUM5Qix5REFBeUQsQ0FDNUQsQ0FBQztZQUNOLENBQUM7WUFFRCxrRUFBa0U7WUFDbEUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sa0JBQWtCLENBQUMsSUFBSSxDQUFDO2dCQUM3QyxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUU7Z0JBQ3RCLFNBQVMsRUFBRTtvQkFDUCxPQUFPO29CQUNQLHVCQUF1QjtvQkFDdkIsc0JBQXNCO2lCQUN6QjthQUNKLENBQUMsQ0FBQztZQUVILElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ1gsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztnQkFDdkMscUNBQXFDO2dCQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO2dCQUMvRCxLQUFLLE1BQU0sSUFBSSxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDaEMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ2YsSUFBSSxDQUFDLE9BQU87NEJBQ1IsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUN6QyxJQUFJLENBQUMsT0FBTyxFQUNaLFdBQVcsQ0FDZCxDQUFDO29CQUNWLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxPQUFPLFFBQVEsQ0FBQztZQUNwQixDQUFDO1lBRUQsTUFBTSxPQUFPLEdBQUc7Z0JBQ1osV0FBVzthQUNkLENBQUM7WUFFRiw2QkFBNkI7WUFDN0IsSUFBSSxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztnQkFDekMsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLGFBQWEsR0FDZixNQUFNLGtCQUFrQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFbkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sa0JBQWtCLENBQUMsSUFBSSxDQUFDO29CQUM3QyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRTtvQkFDL0IsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLHVCQUF1QixDQUFDO2lCQUNoRCxDQUFDLENBQUM7Z0JBRUgsT0FBTyxRQUFRLENBQUM7WUFDcEIsQ0FBQztZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQ2IsV0FBbUIsRUFDbkIsVUFBa0I7UUFFbEIsTUFBTSxzQkFBc0IsR0FDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsNEJBQVksQ0FBQyxDQUFDO1FBQ3BELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsbUJBQVEsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxFQUFFO1lBQ3hELHNEQUFzRDtZQUN0RCxNQUFNLFFBQVEsR0FBRyxNQUFNLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztnQkFDOUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFO2FBQ3pCLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDWixNQUFNLElBQUksK0JBQVcsQ0FDakIsK0JBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUMzQiwyQ0FBMkMsV0FBVyxFQUFFLENBQzNELENBQUM7WUFDTixDQUFDO1lBRUQsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLHNCQUFzQixDQUFDLElBQUksQ0FBQztnQkFDN0MsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFO2FBQ2xELENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDUixrRUFBa0U7Z0JBQ2xFLE1BQU0sV0FBVyxHQUFHLHNCQUFzQixDQUFDLE1BQU0sQ0FBQztvQkFDOUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxFQUFFO29CQUN4QixVQUFVO2lCQUNiLENBQUMsQ0FBQztnQkFDSCxNQUFNLHNCQUFzQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNuRCxDQUFDO1lBRUQsaURBQWlEO1lBQ2pELE1BQU0sZUFBZSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsT0FBTyxDQUFDO2dCQUNyRCxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRTtnQkFDMUIsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLHVCQUF1QixDQUFDO2FBQ2hELENBQUMsQ0FBQztZQUVILE9BQU8sZUFBZSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQ2hCLFdBQW1CLEVBQ25CLFVBQWtCO1FBRWxCLE1BQU0sc0JBQXNCLEdBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLDRCQUFZLENBQUMsQ0FBQztRQUNwRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLG1CQUFRLENBQUMsQ0FBQztRQUN2RSxPQUFPLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsRUFBRTtZQUN4RCxzREFBc0Q7WUFDdEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7Z0JBQzlDLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRTthQUN6QixDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ1osTUFBTSxJQUFJLCtCQUFXLENBQ2pCLCtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFDM0IsMkNBQTJDLFdBQVcsRUFBRSxDQUMzRCxDQUFDO1lBQ04sQ0FBQztZQUNELDBFQUEwRTtZQUMxRSxNQUFNLElBQUksR0FBRyxNQUFNLHNCQUFzQixDQUFDLE9BQU8sQ0FBQztnQkFDOUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFO2FBQ2xELENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDUixNQUFNLElBQUksK0JBQVcsQ0FDakIsK0JBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUMzQixtREFBbUQsV0FBVyxFQUFFLENBQ25FLENBQUM7WUFDTixDQUFDO1lBRUQsNkNBQTZDO1lBQzdDLE1BQU0sc0JBQXNCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFDLGlEQUFpRDtZQUNqRCxNQUFNLGVBQWUsR0FBRyxNQUFNLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztnQkFDckQsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFCLFNBQVMsRUFBRSxDQUFDLE9BQU8sRUFBRSx1QkFBdUIsQ0FBQzthQUNoRCxDQUFDLENBQUM7WUFFSCxPQUFPLGVBQWUsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQWtCO1FBQzNDLElBQUksQ0FBQztZQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakUsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ25DLENBQUM7UUFBQyxPQUFPLENBQU0sRUFBRSxDQUFDO1lBQ2QsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztJQUNMLENBQUM7O0FBcktNLHlCQUFTLEdBQUcsaUJBQVEsQ0FBQyxNQUFNLENBQUM7QUF3S3ZDLGtCQUFlLGVBQWUsQ0FBQyJ9