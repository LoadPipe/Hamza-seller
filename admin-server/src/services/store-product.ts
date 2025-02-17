import { Lifetime } from 'awilix';
import { createLogger, ILogger } from '../utils/logging/logger';
import ProductCollectionRepository from '@medusajs/medusa/dist/repositories/product-collection';
import { ProductVariantRepository } from '../repositories/product-variant';
import { PriceConverter } from '../utils/price-conversion';
import StoreRepository from '../repositories/store';
import SalesChannelRepository from '@medusajs/medusa/dist/repositories/sales-channel';
import { In, Not } from 'typeorm';
import { reverseCryptoPrice } from '../utils/price-formatter';
import ProductCategoryRepository from '@medusajs/medusa/dist/repositories/product-category';
import {
    ProductService as MedusaProductService,
    Logger,
    MoneyAmount,
    ProductVariantMoneyAmount,
    Store,
    ProductStatus,
    ProductCategory,
    Product,
} from '@medusajs/medusa';

interface QuerySellerProductByIdResponse {
    product: Product;
    availableCategories: Array<{ id: string; name: string }>;
}

class StoreProductService extends MedusaProductService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: ILogger;
    protected readonly productCollectionRepository_: typeof ProductCollectionRepository;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly salesChannelRepository_: typeof SalesChannelRepository;
    protected readonly productCategoryRepository_: typeof ProductCategoryRepository;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'ProductService');
        this.storeRepository_ = container.storeRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.productCategoryRepository_ = container.productCategoryRepository;

        this.productCollectionRepository_ =
            container.productCollectionRepository;
        this.salesChannelRepository_ = container.salesChannelRepository;
    }

    async patchSellerProduct(
        productId: string,
        storeId: string,
        updates: any
    ): Promise<QuerySellerProductByIdResponse> {
        console.log(`Incoming Updates: ${JSON.stringify(updates)}`);

        const { preferredCurrency } = updates;
        if (!preferredCurrency) {
            throw new Error('Preferred currency is missing in updates.');
        }

        // 1. Reverse crypto prices for the variants based on preferred currency
        if (Array.isArray(updates.variants)) {
            updates.variants = updates.variants.map((variant) => {
                if (typeof variant.price === 'number') {
                    // Convert display price into internal price
                    variant.price = reverseCryptoPrice(
                        variant.price,
                        preferredCurrency
                    );
                }
                return variant;
            });
        }

        try {
            // 2. Fetch and validate product
            const product = await this.productRepository_.findOne({
                where: { id: productId, store_id: storeId },
                relations: ['images'], // Fetch images for the product
            });
            if (!product) {
                throw new Error(
                    `Product with ID ${productId} not found for store ${storeId}`
                );
            }

            // 3. Separate variants from top-level fields
            const { variants, ...productUpdates } = updates;

            // 4. Update the product
            const updatedProduct = {
                ...product,
                ...productUpdates,
                updated_at: new Date(),
            };
            await this.productRepository_.save(updatedProduct);

            // 5. Handle Image Updates
            if (Array.isArray(updates.images)) {
                const existingImages = product.images.map((img) => img.url);
                const newImages = updates.images.filter(
                    (img) => !existingImages.includes(img)
                );

                if (newImages.length > 0) {
                    for (const imageUrl of newImages) {
                        // Create a new image entry
                        const newImage = this.imageRepository_.create({
                            url: imageUrl,
                            metadata: {}, // Add metadata if needed
                        });
                        const savedImage =
                            await this.imageRepository_.save(newImage);

                        //  Instead of productImageRepository_, link directly to the product
                        product.images.push(savedImage);
                    }

                    // Save the updated product with new images
                    await this.productRepository_.save(product);
                }
            }

            // 6. Update or create each variant
            if (Array.isArray(variants)) {
                for (const variantUpdate of variants) {
                    let variantId: string | undefined;

                    if (variantUpdate.id) {
                        // Update existing variant
                        const existingVariant =
                            await this.productVariantRepository_.findOne({
                                where: {
                                    id: variantUpdate.id,
                                    product_id: productId,
                                },
                            });
                        if (!existingVariant) {
                            console.warn(
                                `Variant ${variantUpdate.id} not found. Skipping.`
                            );
                            continue;
                        }

                        existingVariant.title =
                            variantUpdate.title ?? existingVariant.title;
                        existingVariant.weight =
                            variantUpdate.weight ?? existingVariant.weight;
                        existingVariant.inventory_quantity =
                            variantUpdate.inventory_quantity ??
                            existingVariant.inventory_quantity;
                        existingVariant.height =
                            variantUpdate.height ?? existingVariant.height;
                        existingVariant.width =
                            variantUpdate.width ?? existingVariant.width;
                        existingVariant.length =
                            variantUpdate.length ?? existingVariant.length;
                        existingVariant.sku =
                            variantUpdate.sku ?? existingVariant.sku;
                        existingVariant.metadata = variantUpdate.metadata ?? {};
                        const savedVariant =
                            await this.productVariantRepository_.save(
                                existingVariant
                            );

                        variantId = savedVariant.id;
                    } else {
                        // Create new variant
                        const newVariant =
                            this.productVariantRepository_.create({
                                product_id: product.id,
                                title: variantUpdate.title,
                                weight: variantUpdate.weight,
                                // ... other fields
                            });
                        const savedVariant =
                            await this.productVariantRepository_.save(
                                newVariant
                            );
                        variantId = savedVariant.id;
                    }

                    // 5a. Update the variant’s money_amount *only* for preferredCurrency
                    if (variantId && typeof variantUpdate.price === 'number') {
                        await this.updateSingleVariantPrice(
                            variantId,
                            preferredCurrency,
                            variantUpdate.price
                        );
                    }
                }
            }

            // 7. Re-fetch the updated product with relations
            const refreshedProduct = await this.productRepository_.findOne({
                where: { id: productId, store_id: storeId },
                relations: ['variants', 'variants.prices', 'categories'],
            });
            if (!refreshedProduct) {
                throw new Error(
                    `Failed to re-fetch updated product with ID ${productId}`
                );
            }

            // 8. Fetch available categories
            const availableCategories = await this.productCategoryRepository_
                .find({ select: ['id', 'name'] })
                .then((categories) =>
                    categories.map((cat) => ({
                        id: cat.id,
                        name: cat.name,
                    }))
                );

            // 9. Return the updated product
            return {
                product: refreshedProduct,
                availableCategories,
            };
        } catch (error) {
            console.error(
                `Error updating product ${productId} for store ${storeId}: ${error.message}`
            );
            throw error;
        }
    }

    /**
     * Updates (or inserts) the price for the single currency on the given variant.
     * Other currency amounts are left intact.
     *
     *  This approach is essentially a single SQL statement that updates the row in money_amount
     *  if (and only if) it’s linked to the specified variant and has the specified currency.
     *  If no row matches, no update occurs.
     */
    async updateSingleVariantPrice(
        variantId: string,
        currencyCode: string,
        amount: number
    ): Promise<void> {
        const moneyAmountRepo = this.activeManager_.getRepository(MoneyAmount);
        const pvmRepo = this.activeManager_.getRepository(
            ProductVariantMoneyAmount
        );

        try {
            // 1. Fetch the join table rows for this variant
            const pvmRecords = await pvmRepo.find({
                where: { variant_id: variantId },
                // No 'relations' here because ProductVariantMoneyAmount
                // does not define a money_amount property
            });

            if (pvmRecords.length === 0) {
                this.logger.warn(
                    `No product_variant_money_amount records found for variant=${variantId}`
                );
                return;
            }

            // 2. Gather all money_amount_ids from these rows
            const moneyAmountIds = pvmRecords.map((r) => r.money_amount_id);

            // 3. Find the existing money_amount for the matching currency
            const existingMoneyAmount = await moneyAmountRepo.findOne({
                where: {
                    id: In(moneyAmountIds),
                    currency_code: currencyCode,
                },
            });

            if (existingMoneyAmount) {
                // 4a. Update if found
                existingMoneyAmount.amount = amount;
                await moneyAmountRepo.save(existingMoneyAmount);
                this.logger.info(
                    `Updated price for variant=${variantId}, currency=${currencyCode} => ${amount}`
                );
            } else {
                // 4b. (Optional) If not found, you can create a new record and link it
                // Uncomment if desired to create a new price record:
                /*
                const newMoneyAmount = moneyAmountRepo.create({
                  currency_code: currencyCode,
                  amount,
                })
                const savedMoneyAmount = await moneyAmountRepo.save(newMoneyAmount)

                // Create the join row
                const newPvm = pvmRepo.create({
                  variant_id: variantId,
                  money_amount_id: savedMoneyAmount.id,
                })
                await pvmRepo.save(newPvm)

                this.logger.info(
                  `Created new price record for variant=${variantId}, currency=${currencyCode} => ${amount}`
                )
                */
                this.logger.warn(
                    `No existing money_amount found for variant=${variantId}, currency=${currencyCode}.`
                );
            }
        } catch (err) {
            this.logger.error(
                `Error updating price for variant=${variantId}, currency=${currencyCode}:`,
                err
            );
            throw err;
        }
    }

    // The function deletes an image by image_id...

    async deleteGalleryImage(imageId: string) {
        // Ok we have table `product_images` && `image` we want to delete both
        // if we just delete the image, it will remove the image from the `product_images` table
        try {
            const image = await this.imageRepository_.findOne({
                where: { id: imageId },
            });

            if (!image) {
                throw new Error(`Image with ID ${imageId} not found`);
            }

            // Delete the image from the `product_images` table
            await this.imageRepository_.remove(image);

            return true;
        } catch (e) {
            console.error(`Error deleting image: ${e.message}`);
            throw e;
        }
    }

    // We need to get the specific product w/ variants
    // Fetch a specific product with its variants
    async querySellerProductById(
        productId: string,
        storeId: string
    ): Promise<QuerySellerProductByIdResponse> {
        try {
            const where: any = { store_id: storeId, id: productId };

            const product = await this.productRepository_.findOne({
                where: where,
                relations: [
                    'variants',
                    'variants.prices',
                    'categories',
                    'images',
                ],
            });

            // Fetch all available categories
            const availableCategories = await this.productCategoryRepository_
                .find({
                    select: ['id', 'name'], // Fetch only the necessary fields
                })
                .then((categories) =>
                    categories.map((category) => ({
                        id: category.id,
                        name: category.name,
                    }))
                );

            if (!product) {
                throw new Error(
                    `Product with ID ${productId} not found for store ${storeId}`
                );
            }

            return {
                product: product,
                availableCategories: availableCategories,
            };
        } catch (e) {
            console.error(`Error querying product by ID: ${e.message}`);
            throw e; // Rethrow the error for the caller to handle
        }
    }

    async validateUniqueSKU(sku: string, variant_id: string): Promise<boolean> {
        try {
            const existingProduct =
                await this.productVariantRepository_.findOne({
                    where: { sku, id: Not(variant_id) },
                });

            return !existingProduct;
        } catch (e) {
            console.error(`Error validating SKU: ${e.message}`);
            throw e;
        }
    }

    // Simple function, just list product categories
    async queryAllCategories() {
        try {
            const queryCategories =
                await this.productCategoryRepository_.find();
            console.log(`queryCategory ${queryCategories}`);
            return queryCategories;
        } catch (e) {
            throw new e();
        }
    }
}

export default StoreProductService;
