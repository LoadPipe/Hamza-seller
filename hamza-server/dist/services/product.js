"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const medusa_1 = require("@medusajs/medusa");
const axios_1 = __importDefault(require("axios"));
const price_selection_1 = __importDefault(require("../strategies/price-selection"));
const typeorm_1 = require("typeorm");
const logger_1 = require("../utils/logging/logger");
const seamless_cache_1 = require("../utils/cache/seamless-cache");
const filter_duplicates_1 = require("../utils/filter-duplicates");
const price_conversion_1 = require("../utils/price-conversion");
const currency_config_1 = require("../currency.config");
class ProductService extends medusa_1.ProductService {
    constructor(container) {
        super(container);
        this.logger = (0, logger_1.createLogger)(container, 'ProductService');
        this.storeRepository_ = container.storeRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.cacheExchangeRateRepository =
            container.cachedExchangeRateRepository;
        this.customerService_ = container.customerService;
        this.priceConverter_ = new price_conversion_1.PriceConverter(this.logger, this.cacheExchangeRateRepository);
    }
    async updateProduct(productId, update) {
        this.logger.debug(`Received update for product: ${productId}, ${update}`);
        const result = await super.update(productId, update);
        return result;
    }
    async updateVariantPrice(variantId, prices) {
        const moneyAmountRepo = this.activeManager_.getRepository(medusa_1.MoneyAmount);
        const productVariantMoneyAmountRepo = this.activeManager_.getRepository(medusa_1.ProductVariantMoneyAmount);
        try {
            const moneyAmounts = [];
            const variantMoneyAmounts = [];
            for (const price of prices) {
                const moneyAmount = moneyAmountRepo.create({
                    currency_code: price.currency_code,
                    amount: price.amount, // Assuming the amount is the same for all currencies; adjust if needed
                });
                const savedMoneyAmount = await moneyAmountRepo.save(moneyAmount);
                moneyAmounts.push(savedMoneyAmount);
                const productVariantMoneyAmount = productVariantMoneyAmountRepo.create({
                    variant_id: variantId,
                    money_amount_id: savedMoneyAmount.id,
                });
                variantMoneyAmounts.push(productVariantMoneyAmount);
            }
            // Save all ProductVariantMoneyAmount entries in one go
            await productVariantMoneyAmountRepo.save(variantMoneyAmounts);
            this.logger.info(`Updated prices for variant ${variantId} in currencies: eth, usdc, usdt`);
        }
        catch (e) {
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
            console.log(`Sending ${cleanProducts.length} products to be indexed.`);
            // Send products to be indexed
            const indexResponse = await axios_1.default.post(url, cleanProducts, config);
            // Check if the indexing was successful
            if (indexResponse.status === 200 || indexResponse.status === 202) {
                this.logger.info(`Reindexed ${cleanProducts.length} products successfully.`);
            }
            else {
                this.logger.error('Failed to index products:', indexResponse.status);
                return;
            }
            // Delete drafts immediately after reindexing
            const deleteResponse = await axios_1.default.post('http://localhost:7700/indexes/products/documents/delete', { filter: 'status = draft' }, config);
            // Check if the deletion was successful
            if (deleteResponse.status === 200 ||
                deleteResponse.status === 202) {
                this.logger.info('Draft products have been removed from the index.');
            }
            else {
                this.logger.error('Failed to delete draft products:', deleteResponse.status);
            }
        }
        catch (e) {
            this.logger.error('Error reindexing products:', e);
        }
    }
    // do the detection here does the product exist already / update product input
    async bulkImportProducts(storeId, productData, deleteExisting = true) {
        try {
            //get the store
            const store = await this.storeRepository_.findOne({
                where: { id: storeId },
            });
            if (!store) {
                throw new Error(`Store ${storeId} not found.`);
            }
            //get existing products by handle
            const productHandles = productData.map((p) => p.handle);
            const existingProducts = await this.productRepository_.find({
                where: { handle: (0, typeorm_1.In)(productHandles) },
                relations: ['variants'],
            });
            const addedProducts = await Promise.all(productData.map((product) => {
                return new Promise(async (resolve, reject) => {
                    const productHandle = product.handle;
                    try {
                        // Check if the product already exists by handle
                        const existingProduct = existingProducts.find((p) => p.handle === product.handle);
                        //delete existing product
                        if (existingProduct) {
                            if (deleteExisting) {
                                this.logger.info(`Deleting existing product ${existingProduct.id} with handle ${existingProduct.handle}`);
                                await this.delete(existingProduct.id);
                            }
                            else {
                                this.logger.warn(`Could not import, existing product ${existingProduct.id} with handle ${existingProduct.handle} found`);
                                resolve(null);
                            }
                        }
                        // If the product does not exist, create a new one
                        this.logger.info(`Creating new product with handle: ${productHandle}`);
                        resolve(await super.create(product));
                    }
                    catch (error) {
                        this.logger.error(`Error processing product with handle: ${productHandle}`, error);
                        resolve(null);
                    }
                });
            }));
            // Ensure all products are non-null and have valid IDs
            const validProducts = addedProducts.filter((p) => p && p.id);
            this.logger.info(`${validProducts.length} out of ${productData.length} products were imported`);
            if (validProducts.length !== addedProducts.length) {
                this.logger.warn('Some products were not created successfully');
            }
            this.logger.debug(`Added products: ${validProducts.map((p) => p.id).join(', ')}`);
            return validProducts;
        }
        catch (error) {
            this.logger.error('Error in adding products from BuckyDrop:', error);
            throw error;
        }
    }
    async getProductsFromStoreWithPrices(storeId) {
        return this.convertProductPrices((await this.productRepository_.find({
            where: {
                store_id: storeId,
                status: medusa_1.ProductStatus.PUBLISHED,
            },
            relations: ['variants.prices', 'reviews'],
        })).filter((p) => { var _a; return (_a = p.variants) === null || _a === void 0 ? void 0 : _a.length; }));
    }
    async getAllProductsWithPrices() {
        const products = await this.convertProductPrices(await this.productRepository_.find({
            relations: ['variants.prices', 'reviews'],
            where: {
                status: medusa_1.ProductStatus.PUBLISHED,
                store_id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
            },
        }));
        //TODO: sort alphabetically by title
        const sortedProducts = products
            .sort((a, b) => {
            return 0;
        })
            .filter((p) => { var _a; return (_a = p.variants) === null || _a === void 0 ? void 0 : _a.length; });
        return sortedProducts;
    }
    async getProductsFromStore(storeId) {
        // this.logger.log('store_id: ' + storeId); // Potential source of the error
        return (await this.productRepository_.find({
            where: { store_id: storeId, status: medusa_1.ProductStatus.PUBLISHED },
            // relations: ['store'],
        })).filter((p) => { var _a; return (_a = p.variants) === null || _a === void 0 ? void 0 : _a.length; });
    }
    async getCategoriesByStoreId(storeId) {
        try {
            const categories = await categoryCache.retrieve(this.productCategoryRepository_);
            return categories.filter((c) => c.products.find((p) => p.store_id === storeId));
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
        }
        catch (error) {
            this.logger.error('Error fetching categories by store ID:', error);
            throw new Error('Failed to fetch categories for the specified store.');
        }
    }
    async getStoreFromProduct(productId) {
        try {
            const product = await this.productRepository_.findOne({
                where: { id: productId },
                relations: ['store'],
            });
            return product.store;
        }
        catch (error) {
            this.logger.error('Error fetching store from product:', error);
            throw new Error('Failed to fetch store from product');
        }
    }
    async getProductsFromReview(storeId) {
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
        }
        catch (error) {
            // Handle the error here
            console.error('Error occurred while fetching products from review:', error);
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
    async getStoreProductsByCategory(storeId, categoryName) {
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
            filteredCategories = categories.filter((cat) => cat.name.toLowerCase() === categoryName);
            // Filter products for the category (or all categories) by storeId and status 'published'
            const filteredProducts = filteredCategories.map((cat) => {
                return {
                    ...cat,
                    products: cat.products.filter((product) => product.store_id === storeId &&
                        product.status === 'published'),
                };
            });
            // Update product pricing
            await Promise.all(filteredProducts.map((cat) => this.convertProductPrices(cat.products)));
            return filteredProducts; // Return all product data
        }
        catch (error) {
            // Handle the error here
            this.logger.error('Error occurred while fetching products by handle:', error);
            throw new Error('Failed to fetch products by handle.');
        }
    }
    async getAllProductsByCategoryHandle(storeId, handle) {
        const productCategory = await this.productCategoryRepository_.findOne({
            where: {
                handle: handle,
            },
            relations: ['products.variants.prices'],
        });
        if (!productCategory) {
            throw new Error('Product category not found');
        }
        const products = productCategory.products.filter((product) => product.store_id === storeId &&
            product.status === medusa_1.ProductStatus.PUBLISHED &&
            product.store_id);
        return productCategory.products;
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
    async getAllProductCategories() {
        try {
            return await categoryCache.retrieve(this.productCategoryRepository_);
        }
        catch (error) {
            this.logger.error('Error fetching product categories with prices:', error);
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
    async getFilteredProducts(categories, // Array of strings representing category names
    upperPrice = 0, // Number representing the upper price limit
    lowerPrice = 0, // Number representing the lower price limit
    filterCurrencyCode = 'usdc', storeId) {
        try {
            //prepare category names for query
            let normalizedCategoryNames = categories.map((name) => name.toLowerCase());
            if (normalizedCategoryNames.length > 1 &&
                normalizedCategoryNames[0] === 'all')
                normalizedCategoryNames = normalizedCategoryNames.slice(1);
            const key = normalizedCategoryNames.sort().join(',');
            if (filterCurrencyCode === 'eth') {
                const factor = Math.pow(10, (0, currency_config_1.getCurrencyPrecision)('usdc').db);
                upperPrice = await this.priceConverter_.convertPrice(upperPrice * factor, 'usdc', 'eth');
                lowerPrice = await this.priceConverter_.convertPrice(lowerPrice * factor, 'usdc', 'eth');
            }
            else {
                const factor = Math.pow(10, (0, currency_config_1.getCurrencyPrecision)(filterCurrencyCode).db);
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
        }
        catch (error) {
            // Handle the error here
            this.logger.error('Error occurred while fetching products by handle:', error);
            throw new Error('Failed to fetch products by handle.');
        }
    }
    async getProductsFromStoreName(storeName) {
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
                    status: medusa_1.ProductStatus.PUBLISHED,
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
        }
        catch (error) {
            // Handle the error here
            this.logger.error('Error occurred while fetching products from review:', error);
            throw new Error('Failed to fetch products from review.');
        }
    }
    async convertProductPrices(products, customerId = '') {
        const strategy = new price_selection_1.default({
            customerService: this.customerService_,
            productVariantRepository: this.productVariantRepository_,
            logger: this.logger,
            cachedExchangeRateRepository: this.cacheExchangeRateRepository,
        });
        for (const prod of products) {
            for (const variant of prod.variants) {
                const results = await strategy.calculateVariantPrice([{ variantId: variant.id, quantity: 1 }], { customer_id: customerId });
                if (results.has(variant.id))
                    variant.prices = results.get(variant.id).prices;
            }
        }
        return products;
    }
    async convertVariantPrice(variant, customerId = '') {
        const strategy = new price_selection_1.default({
            customerService: this.customerService_,
            productVariantRepository: this.productVariantRepository_,
            logger: this.logger,
            cachedExchangeRateRepository: this.cacheExchangeRateRepository,
        });
        const results = await strategy.calculateVariantPrice([{ variantId: variant.id, quantity: 1 }], { customer_id: customerId });
        if (results.has(variant.id)) {
            variant.prices = results.get(variant.id).prices;
        }
        return variant;
    }
}
ProductService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
/**
 * See SeamlessCache
 *
 * This implementation of SeamlessCache caches product categories together with products,
 * since it's a slow query.
 */
class CategoryCache extends seamless_cache_1.SeamlessCache {
    constructor() {
        var _a;
        super(parseInt((_a = process.env.CATEGORY_CACHE_EXPIRATION_SECONDS) !== null && _a !== void 0 ? _a : '300'));
    }
    async retrieve(params) {
        return super.retrieve(params);
    }
    async getData(productCategoryRepository) {
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
                cat.products = cat.products.filter((p) => p.status == medusa_1.ProductStatus.PUBLISHED && p.store_id);
        }
        // Filter out categories that have no associated products that are published
        const filteredCategories = categories.filter((category) => category.products && category.products.length > 0);
        return filteredCategories;
    }
}
/**
 * See SeamlessCache
 *
 * This implementation of SeamlessCache caches the entire output of getFilteredProducts, since it's a slow
 * query that runs often.
 */
class ProductFilterCache extends seamless_cache_1.SeamlessCache {
    constructor() {
        var _a;
        super(parseInt((_a = process.env.PRODUCT_CACHE_EXPIRATION_SECONDS) !== null && _a !== void 0 ? _a : '300'));
    }
    async retrieveWithKey(key, params) {
        let products = await super.retrieveWithKey(key, params);
        if (params.upperPrice !== 0 && params.lowerPrice >= 0) {
            products = products.filter((product) => {
                var _a, _b, _c;
                const price = (_c = (_b = (_a = product.variants[0]) === null || _a === void 0 ? void 0 : _a.prices.find((p) => p.currency_code === params.filterCurrencyCode)) === null || _b === void 0 ? void 0 : _b.amount) !== null && _c !== void 0 ? _c : 0;
                console.log(params.lowerPrice, price, params.upperPrice);
                return price >= params.lowerPrice && price <= params.upperPrice;
            });
            // Sort the products by price (assuming the price is in the first variant and the first price in each variant)
            products = products.sort((a, b) => {
                var _a, _b, _c, _d, _e, _f;
                const priceA = (_c = (_b = (_a = a.variants[0]) === null || _a === void 0 ? void 0 : _a.prices.find((p) => p.currency_code === params.filterCurrencyCode)) === null || _b === void 0 ? void 0 : _b.amount) !== null && _c !== void 0 ? _c : 0;
                const priceB = (_f = (_e = (_d = b.variants[0]) === null || _d === void 0 ? void 0 : _d.prices.find((p) => p.currency_code === params.filterCurrencyCode)) === null || _e === void 0 ? void 0 : _e.amount) !== null && _f !== void 0 ? _f : 0;
                return priceA - priceB; // Ascending order
            });
        }
        return products;
    }
    async getData(params) {
        let products = [];
        console.log('params', params);
        //get categories from cache
        const productCategories = await categoryCache.retrieve(params.categoryRepository);
        if (params.categoryNames[0] === 'all') {
            //remove products that aren't published
            products = productCategories.flatMap((cat) => cat.products.filter((p) => p.status === medusa_1.ProductStatus.PUBLISHED && p.store_id));
        }
        else {
            // Filter the categories based on the provided category names
            const filteredCategories = productCategories.filter((cat) => params.categoryNames.includes(cat.name.toLowerCase()));
            // Gather all the products into a single list
            products = filteredCategories.flatMap((cat) => cat.products.filter((p) => p.status === medusa_1.ProductStatus.PUBLISHED && p.store_id));
        }
        //remove duplicates
        products = (0, filter_duplicates_1.filterDuplicatesById)(products);
        // Update product pricing
        await params.convertProductPrices(products);
        return products; // Return filtered products
    }
}
// GLOBAL CACHES
const categoryCache = new CategoryCache();
const productFilterCache = new ProductFilterCache();
exports.default = ProductService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9wcm9kdWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQWtDO0FBQ2xDLDZDQVMwQjtBQUMxQixrREFBMEI7QUFRMUIsb0ZBQW1FO0FBR25FLHFDQUEwQztBQUMxQyxvREFBZ0U7QUFDaEUsa0VBQThEO0FBQzlELGtFQUFrRTtBQUNsRSxnRUFBMkQ7QUFDM0Qsd0RBQTBEO0FBbUMxRCxNQUFNLGNBQWUsU0FBUSx1QkFBb0I7SUFTN0MsWUFBWSxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztRQUNsRCxJQUFJLENBQUMseUJBQXlCLEdBQUcsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1FBQ3BFLElBQUksQ0FBQywyQkFBMkI7WUFDNUIsU0FBUyxDQUFDLDRCQUE0QixDQUFDO1FBQzNDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDO1FBQ2xELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxpQ0FBYyxDQUNyQyxJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQywyQkFBMkIsQ0FDbkMsQ0FBQztJQUNOLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUNmLFNBQWlCLEVBQ2pCLE1BQTBCO1FBRTFCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNiLGdDQUFnQyxTQUFTLEtBQUssTUFBTSxFQUFFLENBQ3pELENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELE9BQU8sTUFBTSxDQUFD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