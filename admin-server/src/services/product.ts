import { Lifetime } from 'awilix';
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
import axios from 'axios';
import { reverseCryptoPrice } from '../utils/price-formatter';
import {
    CreateProductInput as MedusaCreateProductInput,
    CreateProductProductVariantPriceInput,
    CreateProductProductVariantInput,
    CreateProductProductOption,
} from '@medusajs/medusa/dist/types/product';
import { ProductVariant } from '@medusajs/medusa';
import { StoreRepository } from '../repositories/store';
import ProductCategoryRepository from '@medusajs/medusa/dist/repositories/product-category';
import { CachedExchangeRateRepository } from '../repositories/cached-exchange-rate';
import PriceSelectionStrategy from '../strategies/price-selection';
import CustomerService from './customer';
import ProductVariantService from './product-variant';
import { ProductVariantRepository } from '../repositories/product-variant';
import SalesChannelRepository from '@medusajs/medusa/dist/repositories/sales-channel';
import ProductCollectionRepository from '@medusajs/medusa/dist/repositories/product-collection';
import {
    In,
    IsNull,
    LessThan,
    LessThanOrEqual,
    MoreThan,
    MoreThanOrEqual,
    Not,
} from 'typeorm';
import { createLogger, ILogger } from '../utils/logging/logger';
import { SeamlessCache } from '../utils/cache/seamless-cache';
import { filterDuplicatesById } from '../utils/filter-duplicates';
import { PriceConverter } from '../utils/price-conversion';
import { getCurrencyPrecision } from '../currency.config';

const DEFAULT_PAGE_COUNT = 10;

export type BulkImportProductInput = CreateProductInput;

export type UpdateProductProductVariantDTO = {
    id?: string;
    store_id?: string;
    title?: string;
    sku?: string;
    ean?: string;
    upc?: string;
    barcode?: string;
    hs_code?: string;
    inventory_quantity?: number;
    allow_backorder?: boolean;
    manage_inventory?: boolean;
    weight?: number;
    length?: number;
    height?: number;
    width?: number;
    origin_country?: string;
    mid_code?: string;
    material?: string;
    metadata?: Record<string, unknown>;
    prices?: CreateProductProductVariantPriceInput[];
    options?: {
        value: string;
        option_id: string;
    }[];
};
interface FilterProducts {
    name?: { in?: string[]; eq?: string; ne?: string };
    price?: { lt?: number; gt?: number; lte?: number; gte?: number };
    categories?: { in?: string[]; eq?: string; ne?: string };
    created_at?: { gte?: string; lte?: string }; // Dates as ISO strings
}

interface StoreProductsDTO {
    pageIndex: number;
    pageCount: number;
    rowsPerPage: number;
    sortedBy: string | null;
    sortDirection: 'ASC' | 'DESC';
    filtering: FilterProducts | null;
    products: Product[];
    totalRecords: number;
    filteredProductsCount: number;
    availableCategories: Array<{
        id: string;
        name: string;
    }>;
}

interface QuerySellerProductByIdResponse {
    product: Product;
    availableCategories: Array<{ id: string; name: string }>;
}

export type Price = {
    currency_code: string;
    amount: number;
};

export type UpdateProductInput = Omit<Partial<CreateProductInput>, 'variants'> & {
    variants?: UpdateProductProductVariantDTO[];
    id?: string;
};

export type CreateProductInput = MedusaCreateProductInput & {
    id?: string;
};

class ProductService extends MedusaProductService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: ILogger;
    protected readonly storeRepository_: typeof StoreRepository;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly cacheExchangeRateRepository: typeof CachedExchangeRateRepository;
    protected readonly customerService_: CustomerService;
    protected readonly productVariantService_: ProductVariantService;
    protected readonly priceConverter_: PriceConverter;
    protected readonly productCategoryRepository_: typeof ProductCategoryRepository;
    protected readonly salesChannelRepository_: typeof SalesChannelRepository;
    protected readonly productCollectionRepository_: typeof ProductCollectionRepository;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'ProductService');
        this.storeRepository_ = container.storeRepository;
        this.productCategoryRepository_ = container.productCategoryRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.cacheExchangeRateRepository =
            container.cachedExchangeRateRepository;
        this.salesChannelRepository_ = container.salesChannelRepository;
        this.productCollectionRepository_ =
            container.productCollectionRepository;
        this.customerService_ = container.customerService;
        this.productVariantService_ = container.productVariantService;
        this.priceConverter_ = new PriceConverter(
            this.logger,
            this.cacheExchangeRateRepository
        );
    }

    async updateProduct(
        productId: string,
        update: UpdateProductInput
    ): Promise<Product> {
        this.logger.debug(
            `Received update for product: ${productId}, ${update}`
        );
        const result = await super.update(productId, update);
        return result;
    }

    async updateVariantPrice(
        variantId: string,
        prices: CreateProductProductVariantPriceInput[]
    ): Promise<void> {
        const moneyAmountRepo = this.activeManager_.getRepository(MoneyAmount);
        const productVariantMoneyAmountRepo = this.activeManager_.getRepository(
            ProductVariantMoneyAmount
        );

        try {
            const moneyAmounts = [];
            const variantMoneyAmounts = [];

            for (const price of prices) {
                const moneyAmount = moneyAmountRepo.create({
                    currency_code: price.currency_code,
                    amount: price.amount, // Assuming the amount is the same for all currencies; adjust if needed
                });
                const savedMoneyAmount =
                    await moneyAmountRepo.save(moneyAmount);

                moneyAmounts.push(savedMoneyAmount);

                const productVariantMoneyAmount =
                    productVariantMoneyAmountRepo.create({
                        variant_id: variantId,
                        money_amount_id: savedMoneyAmount.id,
                    });

                variantMoneyAmounts.push(productVariantMoneyAmount);
            }

            // Save all ProductVariantMoneyAmount entries in one go
            await productVariantMoneyAmountRepo.save(variantMoneyAmounts);
            this.logger.info(
                `Updated prices for variant ${variantId} in currencies: eth, usdc, usdt`
            );
        } catch (e) {
            this.logger.error('Error updating variant prices:', e);
        }
    }

    // get all products from product table
    async reindexProducts() {
        try {
            // Fetch all products
            const products = await this.productRepository_.find();

            // Handle empty product list
            if (products.length === 0) {
                this.logger.info('No products found to index.');
                return;
            }

            const cleanProducts = products.map((product) => ({
                id: product.id,
                title: product.title,
                description: product.description.replace(/<[^>]*>/g, ''), // Strip HTML
                thumbnail: product.thumbnail,
                handle: product.handle,
                status: product.status, // Include status for all products, including drafts
            }));

            // Prepare the HTTP request headers
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
                },
            };

            // URL of the Meilisearch API
            const url = 'http://localhost:7700/indexes/products/documents';

            // console.log(
            //     `Sending ${cleanProducts.length} products to be indexed.`
            // );

            // Send products to be indexed
            const indexResponse = await axios.post(url, cleanProducts, config);

            // Check if the indexing was successful
            if (indexResponse.status === 200 || indexResponse.status === 202) {
                this.logger.info(
                    `Reindexed ${cleanProducts.length} products successfully.`
                );
            } else {
                this.logger.error(
                    'Failed to index products:',
                    indexResponse.status
                );
                return;
            }

            // Delete drafts immediately after reindexing
            const deleteResponse = await axios.post(
                'http://localhost:7700/indexes/products/documents/delete',
                { filter: 'status = draft' },
                config
            );
            // Check if the deletion was successful
            if (
                deleteResponse.status === 200 ||
                deleteResponse.status === 202
            ) {
                this.logger.info(
                    'Draft products have been removed from the index.'
                );
            } else {
                this.logger.error(
                    'Failed to delete draft products:',
                    deleteResponse.status
                );
            }
        } catch (e) {
            this.logger.error('Error reindexing products:', e);
        }
    }

    // do the detection here does the product exist already / update product input

    async bulkImportProducts(
        storeId: string,
        productData: (CreateProductInput | UpdateProductInput)[],
        deleteExisting: boolean = true
    ): Promise<Product[]> {
        try {
            //get the store
            const store: Store = await this.storeRepository_.findOne({
                where: { id: storeId },
            });

            if (!store) {
                throw new Error(`Store ${storeId} not found.`);
            }

            //get existing products by handle
            const productHandles: string[] = productData.map((p) => p.handle);
            const existingProducts: Product[] =
                await this.productRepository_.find({
                    where: { handle: In(productHandles) },
                    relations: ['variants'],
                });

            const addedProducts = await Promise.all(
                productData.map((product) => {
                    return new Promise<Product>(async (resolve, reject) => {
                        const productHandle = product.handle;

                        try {
                            // Check if the product already exists by handle
                            const existingProduct = existingProducts.find(
                                (p) => p.handle === product.handle
                            );

                            //delete existing product
                            if (existingProduct) {
                                if (deleteExisting) {
                                    this.logger.info(
                                        `Deleting existing product ${existingProduct.id} with handle ${existingProduct.handle}`
                                    );
                                    await this.delete(existingProduct.id);
                                } else {
                                    this.logger.warn(
                                        `Could not import, existing product ${existingProduct.id} with handle ${existingProduct.handle} found`
                                    );
                                    resolve(null);
                                }
                            }

                            // If the product does not exist, create a new one
                            this.logger.info(
                                `Creating new product with handle: ${productHandle}`
                            );
                            resolve(
                                await super.create(
                                    product as CreateProductInput
                                )
                            );
                        } catch (error) {
                            this.logger.error(
                                `Error processing product with handle: ${productHandle}`,
                                error
                            );
                            resolve(null);
                        }
                    });
                })
            );

            // Ensure all products are non-null and have valid IDs
            const validProducts = addedProducts.filter((p) => p && p.id);
            this.logger.info(
                `${validProducts.length} out of ${productData.length} products were imported`
            );
            if (validProducts.length !== addedProducts.length) {
                this.logger.warn('Some products were not created successfully');
            }

            this.logger.debug(
                `Added products: ${validProducts.map((p) => p.id).join(', ')}`
            );
            return validProducts;
        } catch (error) {
            this.logger.error(
                'Error in adding products from BuckyDrop:',
                error
            );
            throw error;
        }
    }

    public async processProductUpdate(
        product: UpdateProductInput,
        existingProducts: Product[]
    ): Promise<Product | null> {
        const productId = product.id;

        try {
            // Check if the product already exists by product ID
            const existingProduct = existingProducts.find(
                (p) => p.id === productId
            );

            // Update existing product
            if (existingProduct) {
                this.updateProduct(
                    existingProduct.id,
                    product as UpdateProductInput
                );
                this.logger.info(
                    `Updated product with product ID: ${productId}`
                );
                return existingProduct;
            }

            // If the product does not exist, create a new one
            this.logger.info(
                `Product with ID: ${productId} does not exist, creating new product.`
            );
            return null;
        } catch (error) {
            this.logger.error(
                `Error processing product with product ID: ${productId}`,
                error
            );
            return null;
        }
    }

    async bulkUpdateProducts(
        storeId: string,
        productData: UpdateProductInput[]
    ): Promise<Product[]> {
        try {
            //get the store
            const store: Store = await this.storeRepository_.findOne({
                where: { id: storeId },
            });

            if (!store) {
                throw new Error(`Store ${storeId} not found.`);
            }

            //get existing products by handle
            const existingProducts: Product[] = await Promise.all(
                productData
                    .filter((product) => product.id)
                    .map((product) =>
                        this.productRepository_.findOne({
                            where: { id: product.id },
                            relations: ['variants'],
                        })
                    )
            );

            const updatedProducts = await Promise.all(
                productData.map((product) =>
                    this.processProductUpdate(product, existingProducts)
                )
            );

            // Ensure all products are non-null and have valid IDs
            const validProducts = updatedProducts.filter((p) => p && p.id);
            this.logger.info(
                `${validProducts.length} out of ${productData.length} products were updated`
            );
            if (validProducts.length !== updatedProducts.length) {
                this.logger.warn('Some products were not updated successfully');
            }

            this.logger.debug(
                `Updated products: ${validProducts.map((p) => p.id).join(', ')}`
            );
            return validProducts;
        } catch (error) {
            this.logger.error('Error in updating products from CSV: ', error);
            throw error;
        }
    }

    async getProductsFromStoreWithPrices(storeId: string): Promise<Product[]> {
        return this.convertProductPrices(
            (
                await this.productRepository_.find({
                    where: {
                        store_id: storeId,
                        status: ProductStatus.PUBLISHED,
                    },
                    relations: ['variants.prices', 'reviews'],
                })
            ).filter((p) => p.variants?.length)
        );
    }

    async getAllProductsWithPrices(): Promise<Product[]> {
        const products = await this.convertProductPrices(
            await this.productRepository_.find({
                relations: ['variants.prices', 'reviews'],
                where: {
                    status: ProductStatus.PUBLISHED,
                    store_id: Not(IsNull()),
                },
            })
        );

        //TODO: sort alphabetically by title
        const sortedProducts = products
            .sort((a, b) => {
                return 0;
            })
            .filter((p) => p.variants?.length);

        return sortedProducts;
    }

    async getProductsFromStore(storeId: string): Promise<Product[]> {
        // this.logger.log('store_id: ' + storeId); // Potential source of the error
        return (
            await this.productRepository_.find({
                where: { store_id: storeId, status: ProductStatus.PUBLISHED },
                // relations: ['store'],
                relations: ['variants'],
            })
        ).filter((p) => p.variants?.length);
    }

    async getCategoriesByStoreId(storeId: string): Promise<ProductCategory[]> {
        try {
            const categories = await categoryCache.retrieve(
                this.productCategoryRepository_
            );
            return categories.filter((c) =>
                c.products.find((p) => p.store_id === storeId)
            );
            /*
            const query = `
                SELECT pc.*
                FROM product p
                JOIN product_category_product pcp ON p.id = pcp.product_id
                JOIN product_category pc ON pcp.product_category_id = pc.id
                WHERE p.store_id = $1
            `;

            const categories = await this.productRepository_.query(query, [
                storeId,
            ]);
            return categories;
            */
        } catch (error) {
            this.logger.error('Error fetching categories by store ID:', error);
            throw new Error(
                'Failed to fetch categories for the specified store.'
            );
        }
    }

    async getStoreFromProduct(productId: string): Promise<Object> {
        try {
            const product = await this.productRepository_.findOne({
                where: { id: productId },
                relations: ['store'],
            });

            return product.store;
        } catch (error) {
            this.logger.error('Error fetching store from product:', error);
            throw new Error('Failed to fetch store from product');
        }
    }

    async getProductsFromReview(storeId: string) {
        try {
            const products = await this.productRepository_.find({
                where: { store_id: storeId },
                relations: ['reviews'],
            });

            let totalReviews = 0;
            let totalRating = 0;

            products.forEach((product) => {
                product.reviews.forEach((review) => {
                    totalRating += review.rating;
                });
                totalReviews += product.reviews.length;
            });

            const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            const reviewStats = { reviewCount: totalReviews, avgRating };

            return reviewStats;
        } catch (error) {
            // Handle the error here
            console.error(
                'Error occurred while fetching products from review:',
                error
            );
            throw new Error('Failed to fetch products from review.');
        }
    }

    /**
     * Fetches all products for a specific store and category.
     *
     * 1. Retrieves product categories with their associated products, variants, prices, and reviews.
     * 2. If the categoryName is not "all", filters the categories based on the given category name.
     * 3. Filters products within the selected category (or all categories if "all") by the provided store ID.
     * 4. Updates the product pricing for the filtered products.
     * 5. Returns the filtered list of products.
     *
     * @param {string} storeId - The ID of the store to fetch products from.
     * @param {string} categoryName - The category to filter products by, or "all" to fetch all categories.
     * @returns {Array} - A list of products for the specified store and category.
     * @throws {Error} - If there is an issue fetching the products or updating prices.
     */
    async getStoreProductsByCategory(storeId: string, categoryName: string) {
        try {
            if (categoryName.toLowerCase() === 'all') {
                return this.getProductsFromStoreWithPrices(storeId);
            }
            // Query to get all products for the given store ID
            const categories = await this.productCategoryRepository_.find({
                select: ['id', 'name', 'metadata'],
                relations: [
                    'products',
                    'products.variants.prices',
                    'products.reviews',
                ],
            });

            let filteredCategories = categories;

            //Filter for the specific category
            filteredCategories = categories.filter(
                (cat) => cat.name.toLowerCase() === categoryName
            );

            // Filter products for the category (or all categories) by storeId and status 'published'
            const filteredProducts = filteredCategories.map((cat) => {
                return {
                    ...cat,
                    products: cat.products.filter(
                        (product) =>
                            product.store_id === storeId &&
                            product.status === 'published'
                    ),
                };
            });

            // Update product pricing
            await Promise.all(
                filteredProducts.map((cat) =>
                    this.convertProductPrices(cat.products)
                )
            );

            return filteredProducts; // Return all product data
        } catch (error) {
            // Handle the error here
            this.logger.error(
                'Error occurred while fetching products by handle:',
                error
            );
            throw new Error('Failed to fetch products by handle.');
        }
    }

    async getAllProductsByCategoryHandle(storeId: string, handle: string) {
        const productCategory = await this.productCategoryRepository_.findOne({
            where: {
                handle: handle,
            },
            relations: ['products.variants.prices'],
        });

        if (!productCategory) {
            throw new Error('Product category not found');
        }

        const products = productCategory.products.filter(
            (product) =>
                product.store_id === storeId &&
                product.status === ProductStatus.PUBLISHED &&
                product.store_id
        );
        return productCategory.products;
    }

    async getProductCollectionAndSalesChannelIds(): Promise<{
        collectionId: string;
        salesChannelId: string;
    }> {
        try {
            // Fetch the single sales channel
            const salesChannel = await this.salesChannelRepository_.findOne({
                where: {}, // Empty where clause to find any sales channel
                order: { created_at: 'ASC' }, // Sort by creation time, oldest first
            });

            // Fetch a random product collection
            const collection = await this.productCollectionRepository_.findOne({
                where: {}, // Empty where clause to find any sales channel
                order: { created_at: 'ASC' }, // Sort by creation time, oldest first
            });

            if (!collection) {
                throw new Error('No collections available.');
            }

            return {
                collectionId: collection.id,
                salesChannelId: salesChannel.id,
            };
        } catch (error) {
            this.logger.error(
                'Error fetching collection and sales channel IDs:',
                error
            );
            throw new Error(
                'Failed to fetch collection and sales channel IDs.'
            );
        }
    }

    /**
     * Fetches all product categories along with their associated products, variants, prices, and reviews.
     *
     * 1. Retrieves product categories from the repository, including their related products, product variants, prices, and reviews.
     * 2. Filters out unpublished products or products without a store ID.
     * 3. Removes categories that have no associated products after filtering.
     * 4. Converts the product prices based on the appropriate currency.
     * 5. Returns the filtered list of categories with their corresponding products.
     *
     * @returns {Array} - A list of product categories with associated products and their updated prices.
     * @throws {Error} - If there is an issue fetching the categories or updating prices.
     */
    async getAllProductCategories(): Promise<ProductCategory[]> {
        try {
            return await categoryCache.retrieve(
                this.productCategoryRepository_
            );
        } catch (error) {
            this.logger.error(
                'Error fetching product categories with prices:',
                error
            );
            throw new Error('Failed to fetch product categories with prices.');
        }
    }

    /**
     * Filters products based on selected categories, upper price limit, and lower price limit.
     *
     * @param {string[]} categories - An array of category names to filter products by.
     * @param {number} upperPrice - The upper price limit for filtering products.
     * @param {number} lowerPrice - The lower price limit for filtering products.
     * @param {number} lowerPrice - Optional param to filter further by store.
     * @returns {Array} - A list of products filtered by the provided criteria.
     */
    async getFilteredProducts(
        categories: string[], // Array of strings representing category names
        upperPrice: number = 0, // Number representing the upper price limit
        lowerPrice: number = 0, // Number representing the lower price limit
        filterCurrencyCode: string = 'usdc',
        storeId?: string
    ) {
        try {
            //prepare category names for query
            let normalizedCategoryNames = categories.map((name) =>
                name.toLowerCase()
            );
            if (
                normalizedCategoryNames.length > 1 &&
                normalizedCategoryNames[0] === 'all'
            )
                normalizedCategoryNames = normalizedCategoryNames.slice(1);

            const key = normalizedCategoryNames.sort().join(',');

            if (filterCurrencyCode === 'eth') {
                const factor = Math.pow(10, getCurrencyPrecision('usdc').db);
                upperPrice = await this.priceConverter_.convertPrice(
                    upperPrice * factor,
                    'usdc',
                    'eth'
                );
                lowerPrice = await this.priceConverter_.convertPrice(
                    lowerPrice * factor,
                    'usdc',
                    'eth'
                );
            } else {
                const factor = Math.pow(
                    10,
                    getCurrencyPrecision(filterCurrencyCode).db
                );
                upperPrice = upperPrice * factor;
                lowerPrice = lowerPrice * factor;
            }

            //retrieve products from cache
            let products = await productFilterCache.retrieveWithKey(key, {
                categoryRepository: this.productCategoryRepository_,
                categoryNames: normalizedCategoryNames,
                upperPrice,
                lowerPrice,
                filterCurrencyCode,
                convertProductPrices: async (prods) => {
                    return this.convertProductPrices(prods);
                },
            });

            //filter by store id if provided
            if (storeId) {
                products = products.filter((p) => p.store_id === storeId);
            }

            return products;
        } catch (error) {
            // Handle the error here
            this.logger.error(
                'Error occurred while fetching products by handle:',
                error
            );
            throw new Error('Failed to fetch products by handle.');
        }
    }

    async getProductsFromStoreName(storeName: string) {
        try {
            const store = await this.storeRepository_.findOne({
                where: { name: storeName },
            });

            if (!store) {
                return null;
            }

            let totalReviews = 0;
            let totalRating = 0;

            const products = await this.productRepository_.find({
                where: {
                    store_id: store.id,
                    status: ProductStatus.PUBLISHED,
                },
                relations: ['reviews'],
            });

            let thumbnail = store.icon;
            let productCount = products.length;
            let createdAt = store.created_at;
            let reviews = [];

            products.forEach((product) => {
                product.reviews.forEach((review) => {
                    totalRating += review.rating;
                    reviews.push({
                        id: review.id,
                        title: review.title,
                        rating: review.rating,
                        review: review.content,
                        createdAt: review.created_at,
                    });
                });
                totalReviews += product.reviews.length;
            });

            const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            const reviewStats = {
                reviewCount: totalReviews,
                reviews: reviews,
                avgRating,
                productCount,
                createdAt,
                numberOfFollowers: store.store_followers,
                description: store.store_description,
                thumbnail,
            };

            return reviewStats;
        } catch (error) {
            // Handle the error here
            this.logger.error(
                'Error occurred while fetching products from review:',
                error
            );
            throw new Error('Failed to fetch products from review.');
        }
    }

    private async convertProductPrices(
        products: Product[],
        customerId: string = ''
    ): Promise<Product[]> {
        const strategy: PriceSelectionStrategy = new PriceSelectionStrategy({
            customerService: this.customerService_,
            productVariantRepository: this.productVariantRepository_,
            logger: this.logger,
            cachedExchangeRateRepository: this.cacheExchangeRateRepository,
        });
        for (const prod of products) {
            for (const variant of prod.variants) {
                const results = await strategy.calculateVariantPrice(
                    [{ variantId: variant.id, quantity: 1 }],
                    { customer_id: customerId }
                );
                if (results.has(variant.id))
                    variant.prices = results.get(variant.id).prices;
            }
        }

        return products;
    }

    async convertVariantPrice(
        variant: ProductVariant,
        customerId: string = ''
    ): Promise<ProductVariant> {
        const strategy = new PriceSelectionStrategy({
            customerService: this.customerService_,
            productVariantRepository: this.productVariantRepository_,
            logger: this.logger,
            cachedExchangeRateRepository: this.cacheExchangeRateRepository,
        });

        const results = await strategy.calculateVariantPrice(
            [{ variantId: variant.id, quantity: 1 }],
            { customer_id: customerId }
        );

        if (results.has(variant.id)) {
            variant.prices = results.get(variant.id).prices;
        }

        return variant;
    }

    async deleteProductById(productId: string): Promise<void> {
        await this.delete(productId);
    }

    // Were getting products from the store for the /products page..
    // TODO: We really need to add the filters and totalCount ot this, and we will do this after the skeleton Products Panel
    async querySellerAllProducts(
        storeId: string,
        filter: { categories?: { in: string[] } }, // Simplified filter for categories
        sort: { field: string; direction: 'ASC' | 'DESC' },
        page: number, // Pagination page index
        productsPerPage: number // Number of products per page
    ): Promise<StoreProductsDTO> {
        const where: any = { store_id: storeId };

        // Total product count for pagination
        const totalRecords = await this.productRepository_.count({ where });

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

        // Handle category filtering
        if (filter?.categories?.in) {
            const categoryIds = availableCategories
                .filter((category) =>
                    filter.categories.in.includes(category.name)
                )
                .map((category) => category.id);

            if (categoryIds.length > 0) {
                where.categories = { id: In(categoryIds) };
            } else {
                // If no matching category IDs, return no results for filtered count
                where.categories = { id: In([]) };
            }
        }

        console.log(`SORTING SORT SORT SKIP: ${page * productsPerPage}`);
        console.log(`TAKE: ${productsPerPage}`);
        const params = {
            where,
            take: productsPerPage || 20,
            skip: page * productsPerPage,
            order:
                sort?.field &&
                !['price', 'inventory_quantity'].includes(sort.field)
                    ? { [sort.field]: sort.direction }
                    : undefined,
            relations: ['variants', 'variants.prices', 'categories'], // Include necessary relations
        };

        const filteredProducts = await this.productRepository_.find(params);

        if (sort?.field === 'inventory_quantity') {
            filteredProducts.sort((a, b) => {
                const qtyA = a.variants?.[0]?.inventory_quantity || 0;
                const qtyB = b.variants?.[0]?.inventory_quantity || 0;

                return sort.direction === 'ASC' ? qtyA - qtyB : qtyB - qtyA;
            });
        } else if (sort?.field === 'price') {
            filteredProducts.sort((a, b) => {
                const priceA = a.variants[0]?.prices[0]?.amount || 0;
                const priceB = b.variants[0]?.prices[0]?.amount || 0;

                return sort.direction === 'ASC'
                    ? priceA - priceB
                    : priceB - priceA;
            });
        }

        if (sort?.field === 'categories') {
            filteredProducts.sort((a, b) => {
                const categoryA = a.categories[0]?.name || '';
                const categoryB = b.categories[0]?.name || '';
                return sort.direction === 'ASC'
                    ? categoryA.localeCompare(categoryB)
                    : categoryB.localeCompare(categoryA);
            });
        }

        if (sort?.field === '')
            if (sort?.field && sort.field !== 'price') {
                // Other sorting fields (e.g., created_at)
                params.order[sort.field] = sort.direction;
            }

        const filteredProductsCount =
            await this.productRepository_.count(params);

        // console.log(JSON.stringify(filteredProducts));

        return {
            pageIndex: page,
            pageCount: Math.ceil(totalRecords / productsPerPage),
            rowsPerPage: productsPerPage,
            sortedBy: sort?.field ?? null,
            sortDirection: sort?.direction ?? 'ASC',
            filtering: filter,
            products: filteredProducts,
            filteredProductsCount: filteredProductsCount,
            totalRecords,
            availableCategories,
        };
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
                relations: ['variants', 'variants.prices', 'categories'],
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

            // 5. Update or create each variant
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
                        // ... any other fields you may need to update
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

            // 6. Re-fetch the updated product with relations
            const refreshedProduct = await this.productRepository_.findOne({
                where: { id: productId, store_id: storeId },
                relations: ['variants', 'variants.prices', 'categories'],
            });
            if (!refreshedProduct) {
                throw new Error(
                    `Failed to re-fetch updated product with ID ${productId}`
                );
            }

            // 7. Fetch available categories
            const availableCategories = await this.productCategoryRepository_
                .find({ select: ['id', 'name'] })
                .then((categories) =>
                    categories.map((cat) => ({
                        id: cat.id,
                        name: cat.name,
                    }))
                );

            // 8. Return the updated product
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

    async getCategoryByHandle(
        categoryHandle: string
    ): Promise<ProductCategory | null> {
        try {
            const category = await this.productCategoryRepository_.findOne({
                where: { handle: categoryHandle },
            });

            return category || null;
        } catch (error) {
            this.logger.error(
                'Error fetching product category by handle:',
                error
            );
            throw new Error('Failed to fetch product category by handle.');
        }
    }

    async getProductByHandle(productHandle: string): Promise<Product | null> {
        try {
            const product = await this.productRepository_.findOne({
                where: { handle: productHandle },
            });

            return product || null;
        } catch (error) {
            this.logger.error('Error fetching product by handle:', error);
            throw new Error('Failed to fetch product by handle.');
        }
    }

    async getProductById(productId: string): Promise<Product | null> {
        try {
            const product = await this.productRepository_.findOne({
                where: { id: productId },
            });

            return product || null;
        } catch (error) {
            this.logger.error('Error fetching product by id:', error);
            throw new Error('Failed to fetch product by id.');
        }
    }

    /**
     * validates a category handle, and returns the category id if the category exists
     * @param categoryHandle
     * @returns
     */
    async validateCategory(categoryHandle: string): Promise<string | null> {
        const category_ = await this.getCategoryByHandle(categoryHandle);
        return category_ ? category_.id : null;
    }
}

/**
 * See SeamlessCache
 *
 * This implementation of SeamlessCache caches product categories together with products,
 * since it's a slow query.
 */
class CategoryCache extends SeamlessCache {
    constructor() {
        super(parseInt(process.env.CATEGORY_CACHE_EXPIRATION_SECONDS ?? '300'));
    }

    async retrieve(params?: any): Promise<ProductCategory[]> {
        return super.retrieve(params);
    }

    protected async getData(
        productCategoryRepository: any
    ): Promise<ProductCategory[]> {
        const categories = await productCategoryRepository.find({
            select: ['id', 'name', 'metadata', 'handle'],
            relations: [
                'products',
                'products.variants.prices',
                'products.reviews',
            ],
        });

        //remove products that aren't published
        for (let cat of categories) {
            if (cat.products)
                cat.products = cat.products.filter(
                    (p) => p.status == ProductStatus.PUBLISHED && p.store_id
                );
        }

        // Filter out categories that have no associated products that are published
        const filteredCategories = categories.filter(
            (category) => category.products && category.products.length > 0
        );

        return filteredCategories;
    }
}

/**
 * See SeamlessCache
 *
 * This implementation of SeamlessCache caches the entire output of getFilteredProducts, since it's a slow
 * query that runs often.
 */
class ProductFilterCache extends SeamlessCache {
    constructor() {
        super(parseInt(process.env.PRODUCT_CACHE_EXPIRATION_SECONDS ?? '300'));
    }

    async retrieveWithKey(key?: string, params?: any): Promise<Product[]> {
        let products = await super.retrieveWithKey(key, params);

        if (params.upperPrice !== 0 && params.lowerPrice >= 0) {
            products = products.filter((product) => {
                const price =
                    product.variants[0]?.prices.find(
                        (p) => p.currency_code === params.filterCurrencyCode
                    )?.amount ?? 0;
                // console.log(params.lowerPrice, price, params.upperPrice);
                return price >= params.lowerPrice && price <= params.upperPrice;
            });

            // Sort the products by price (assuming the price is in the first variant and the first price in each variant)
            products = products.sort((a, b) => {
                const priceA =
                    a.variants[0]?.prices.find(
                        (p) => p.currency_code === params.filterCurrencyCode
                    )?.amount ?? 0;
                const priceB =
                    b.variants[0]?.prices.find(
                        (p) => p.currency_code === params.filterCurrencyCode
                    )?.amount ?? 0;
                return priceA - priceB; // Ascending order
            });
        }

        return products;
    }

    protected async getData(params: any): Promise<any> {
        let products: Product[] = [];

        // console.log('params', params);
        //get categories from cache
        const productCategories = await categoryCache.retrieve(
            params.categoryRepository
        );

        if (params.categoryNames[0] === 'all') {
            //remove products that aren't published
            products = productCategories.flatMap((cat) =>
                cat.products.filter(
                    (p) => p.status === ProductStatus.PUBLISHED && p.store_id
                )
            );
        } else {
            // Filter the categories based on the provided category names
            const filteredCategories = productCategories.filter((cat) =>
                params.categoryNames.includes(cat.name.toLowerCase())
            );

            // Gather all the products into a single list
            products = filteredCategories.flatMap((cat) =>
                cat.products.filter(
                    (p) => p.status === ProductStatus.PUBLISHED && p.store_id
                )
            );
        }

        //remove duplicates
        products = filterDuplicatesById(products);

        // Update product pricing
        await params.convertProductPrices(products);

        return products; // Return filtered products
    }
}

// GLOBAL CACHES
const categoryCache: CategoryCache = new CategoryCache();
const productFilterCache: ProductFilterCache = new ProductFilterCache();

export default ProductService;
