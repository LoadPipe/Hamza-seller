"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const awilix_1 = require("awilix");
const logger_1 = require("../utils/logging/logger");
class ProductVariantService extends medusa_1.ProductVariantService {
    constructor(container) {
        super(container);
        this.productVariantRepository_ = container.productVariantRepository;
        this.logger = (0, logger_1.createLogger)(container, 'ProductVariantService');
    }
    async checkInventory(variantId) {
        try {
            const productVariant = await this.productVariantRepository_.findOne({
                where: { id: variantId },
            });
            this.logger.debug(`Inventory for variant ${productVariant.id}: ${productVariant.inventory_quantity}`);
            return productVariant.inventory_quantity;
        }
        catch (e) {
            this.logger.error(`Error checking inventory for variant ${variantId}: ${e}`);
        }
    }
    async updateInventory(variantOrVariantId, quantityToDeduct) {
        try {
            const productVariant = await this.productVariantRepository_.findOne({
                where: { id: variantOrVariantId },
            });
            if (productVariant.inventory_quantity >= quantityToDeduct) {
                productVariant.inventory_quantity -= quantityToDeduct;
                await this.productVariantRepository_.save(productVariant);
                this.logger.debug(`Inventory updated for variant ${productVariant.id}, new inventory count: ${productVariant.inventory_quantity}`);
                return productVariant;
            }
            else if (productVariant.allow_backorder) {
                this.logger.info('Inventory below requested deduction but backorders are allowed.');
            }
            else {
                this.logger.info('Not enough inventory to deduct the requested quantity.');
            }
        }
        catch (e) {
            this.logger.error(`Error updating inventory for variant ${variantOrVariantId}: ${e}`);
        }
    }
}
ProductVariantService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = ProductVariantService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC12YXJpYW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3Byb2R1Y3QtdmFyaWFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUcwQjtBQUUxQixtQ0FBa0M7QUFFbEMsb0RBQWdFO0FBRWhFLE1BQU0scUJBQXNCLFNBQVEsOEJBQTJCO0lBSzNELFlBQVksU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLHlCQUF5QixHQUFHLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQztRQUNwRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFpQjtRQUNsQyxJQUFJLENBQUM7WUFDRCxNQUFNLGNBQWMsR0FBRyxNQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQy9EO2dCQUNJLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUU7YUFDM0IsQ0FDSixDQUFDO1lBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ2IseUJBQXlCLGNBQWMsQ0FBQyxFQUFFLEtBQUssY0FBYyxDQUFDLGtCQUFrQixFQUFFLENBQ3JGLENBQUM7WUFDRixPQUFPLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQztRQUM3QyxDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNULElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNiLHdDQUF3QyxTQUFTLEtBQUssQ0FBQyxFQUFFLENBQzVELENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlLENBQ2pCLGtCQUEwQixFQUMxQixnQkFBd0I7UUFFeEIsSUFBSSxDQUFDO1lBQ0QsTUFBTSxjQUFjLEdBQUcsTUFBTSxJQUFJLENBQUMseUJBQXlCLENBQUMsT0FBTyxDQUMvRDtnQkFDSSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLEVBQUU7YUFDcEMsQ0FDSixDQUFDO1lBRUYsSUFBSSxjQUFjLENBQUMsa0JBQWtCLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEQsY0FBYyxDQUFDLGtCQUFrQixJQUFJLGdCQUFnQixDQUFDO2dCQUN0RCxNQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzFELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNiLGlDQUFpQyxjQUFjLENBQUMsRUFBRSwwQkFBMEIsY0FBYyxDQUFDLGtCQUFrQixFQUFFLENBQ2xILENBQUM7Z0JBQ0YsT0FBTyxjQUFjLENBQUM7WUFDMUIsQ0FBQztpQkFBTSxJQUFJLGNBQWMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ1osaUVBQWlFLENBQ3BFLENBQUM7WUFDTixDQUFDO2lCQUFNLENBQUM7Z0JBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ1osd0RBQXdELENBQzNELENBQUM7WUFDTixDQUFDO1FBQ0wsQ0FBQztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDYix3Q0FBd0Msa0JBQWtCLEtBQUssQ0FBQyxFQUFFLENBQ3JFLENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQzs7QUE1RE0sK0JBQVMsR0FBRyxpQkFBUSxDQUFDLE1BQU0sQ0FBQztBQStEdkMsa0JBQWUscUJBQXFCLENBQUMifQ==