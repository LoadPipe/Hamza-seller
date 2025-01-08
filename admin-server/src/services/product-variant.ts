import {
    ProductVariantService as MedusaProductVariantService,
    Logger,
} from '@medusajs/medusa';
import { ProductVariant } from '@medusajs/medusa';
import { Lifetime } from 'awilix';
import { ProductVariantRepository } from '../repositories/product-variant';
import { createLogger, ILogger } from '../utils/logging/logger';
import { UpdateProductVariantInput as MedusaUpdateProductVariantInput } from '@medusajs/medusa/dist/types/product-variant';

export type UpdateProductVariantInput = MedusaUpdateProductVariantInput & {
    variant_id: string;
}

class ProductVariantService extends MedusaProductVariantService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.productVariantRepository_ = container.productVariantRepository;
        this.logger = createLogger(container, 'ProductVariantService');
    }

    async checkInventory(variantId: string) {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { id: variantId },
                }
            );
            this.logger.debug(
                `Inventory for variant ${productVariant.id}: ${productVariant.inventory_quantity}`
            );
            return productVariant.inventory_quantity;
        } catch (e) {
            this.logger.error(
                `Error checking inventory for variant ${variantId}: ${e}`
            );
        }
    }

    async updateInventory(
        variantOrVariantId: string,
        quantityToDeduct: number
    ) {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { id: variantOrVariantId },
                }
            );

            if (productVariant.inventory_quantity >= quantityToDeduct) {
                productVariant.inventory_quantity -= quantityToDeduct;
                await this.productVariantRepository_.save(productVariant);
                this.logger.debug(
                    `Inventory updated for variant ${productVariant.id}, new inventory count: ${productVariant.inventory_quantity}`
                );
                return productVariant;
            } else if (productVariant.allow_backorder) {
                this.logger.info(
                    'Inventory below requested deduction but backorders are allowed.'
                );
            } else {
                this.logger.info(
                    'Not enough inventory to deduct the requested quantity.'
                );
            }
        } catch (e) {
            this.logger.error(
                `Error updating inventory for variant ${variantOrVariantId}: ${e}`
            );
        }
    }

    async getVariantById(variantId: string): Promise<ProductVariant | null> {
        try {
            const productVariant = await this.productVariantRepository_.findOne({
                where: { id: variantId },
            });

            return productVariant || null;
        } catch (error) {
            this.logger.error('Error fetching product variant by id:', error);
            throw new Error('Failed to fetch product variant by id.');
        }
    }

    async getVariantBySku(sku: string): Promise<ProductVariant | null> {
        try {
            const productVariant = await this.productVariantRepository_.findOne({
                where: { sku: sku },
            });

            return productVariant || null;
        } catch (error) {
            this.logger.error('Error fetching product variant by sku:', error);
            throw new Error('Failed to fetch product variant by sku.');
        }
    }

    async getVariantByBarcode(barcode: string): Promise<ProductVariant | null> {
        try {
            const productVariant = await this.productVariantRepository_.findOne({
                where: { barcode: barcode },
            });

            return productVariant || null;
        } catch (error) {
            this.logger.error('Error fetching product variant by barcode:', error);
            throw new Error('Failed to fetch product variant by barcode.');
        }
    }

    async getVariantByUpc(upc: string): Promise<ProductVariant | null> {
        try {
            const productVariant = await this.productVariantRepository_.findOne({
                where: { upc: upc },
            });

            return productVariant || null;
        } catch (error) {
            this.logger.error('Error fetching product variant by upc:', error);
            throw new Error('Failed to fetch product variant by upc.');
        }
    }

    async getVariantByEan(ean: string): Promise<ProductVariant | null> {
        try {
            const productVariant = await this.productVariantRepository_.findOne({
                where: { ean: ean },
            });

            return productVariant || null;
        } catch (error) {
            this.logger.error('Error fetching product variant by ean:', error);
            throw new Error('Failed to fetch product variant by ean.');
        }
    }

    async updateVariants(variantInputs: UpdateProductVariantInput[]): Promise<ProductVariant[]> {
        const updatedVariants: ProductVariant[] = [];
        try {
            // Update the variant
            for (let variantInput of variantInputs) {
                
                const existingVariant = await this.retrieve(variantInput.variant_id);
                if (existingVariant) {
                    const updatedVariant = await this.update(variantInput.variant_id, variantInput);
                    updatedVariants.push(updatedVariant);
                } else {
                    this.logger.warn(`Variant with id ${variantInput.variant_id} does not exist.`);
                }
            }

            return updatedVariants;
        } catch (error) {
            this.logger.error('Error updating variants:', error);
            throw new Error('Failed to update variants.');
        }
    }
}

export default ProductVariantService;
