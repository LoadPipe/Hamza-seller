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
import fs from 'fs';
import csv from 'csv-parser';
import * as readline from 'readline';

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

// Define the expected structure of the data
export type csvProductData = {
    product_id?: string;
    category: string; // category handle from DB
    images: string;
    title: string;
    subtitle: string;
    description: string;
    status: ProductStatus; // 'draft' or 'published'
    thumbnail: string;
    discountable: string; // '0' or '1'
    weight: string;
    handle: string; // must be unique from DB and other rows from csv
    variant_id?: string;
    variant: string; // Size[XL] | Color[White] | Gender[Male]
    variant_price: string;
    variant_inventory_quantity: string;
    variant_allow_backorder: string; // '0' or '1'
    variant_manage_inventory: string; // '0' or '1'
    variant_sku?: string;
    variant_barcode?: string;
    variant_ean?: string;
    variant_upc?: string;
    variant_hs_code?: string;
    variant_origin_country?: string;
    variant_mid_code?: string;
    variant_material?: string;
    variant_weight?: string;
    variant_length?: string;
    variant_height?: string;
    variant_width?: string;
    category_id?: string; // optional: created when data is valid, and retrieved from DB
    invalid_error?: string; // optional: created when data is invalid, and indicates the type of error
};

type ProductDetails = {
    productInfo: {
        productId?: string;
        name?: string;
        baseCurrency?: string;
    };
    variants: csvProductData[];
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

const requiredCsvHeadersForProduct = [
    'category',
    'title',
    'subtitle',
    'description',
    'status',
    'thumbnail',
    'weight',
    'discountable',
    'handle',
    'variant',
    'variant_price',
    'variant_inventory_quantity',
    'variant_allow_backorder',
    'variant_manage_inventory',
];

const requiredCsvHeadersForVariant = [
    'handle',
    'variant',
    'variant_price',
    'variant_inventory_quantity',
    'variant_allow_backorder',
    'variant_manage_inventory',
];

const requiredCsvHeadersForVariantUpdate = [
    ...requiredCsvHeadersForVariant.filter(header => header !== 'variant'),
    'variant_id',
];

type CreateProductProductOption_ = CreateProductProductOption & {
    values: string[];
};

export type Price = {
    currency_code: string;
    amount: number;
};

type UpdateProductInput = Omit<Partial<CreateProductInput>, 'variants'> & {
    variants?: UpdateProductProductVariantDTO[];
    id?: string;
};

type CreateProductInput = MedusaCreateProductInput & {
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

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'ProductService');
        this.storeRepository_ = container.storeRepository;
        this.productCategoryRepository_ = container.productCategoryRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.cacheExchangeRateRepository =
            container.cachedExchangeRateRepository;
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

    /**
     *
     * @param rowData - product row data
     * @param csvData - all csv data
     * @returns
     */
    public async convertRowDataToProductDetails (
        rowData: csvProductData,
        csvData: csvProductData[],
        store: Store
    ): Promise<ProductDetails> {

        //get all variant rows with same handle
        let variants = [];
        
        //usually, product row data contains variant data as well
        const hasVariant = this.csvRowHasVariant(
            rowData,
            requiredCsvHeadersForVariant,
            requiredCsvHeadersForVariantUpdate
        );
        
        if (hasVariant) {
            variants.push(rowData);
        }
        
        //grabbing all variants that are the same handle
        variants.push(
            ...csvData.filter(
                (row) => rowData !== row && row.handle && rowData.handle && row.handle === rowData.handle
            )
        );

        // console.log('variantsConvertRowDataToProductDetails: ' + JSON.stringify(variants));

        //if product_id is present, we're updating a product        
        let productDetails: ProductDetails = {
            productInfo: {
                productId: rowData['product_id'] || null,
                name: rowData['title'] || null,
                baseCurrency: store.default_currency_code,
            },
            variants: variants,
        };
        // console.log('productDetails2: ' + JSON.stringify(productDetails));
        return productDetails;
    };

    // generate option names from variantData
    // const optionNames: extractOptionNames[] = [
    //     { title: 'color', values: ['Black', 'White'] },
    //     { title: 'size', values: ['L', 'XL'] },
    //     { title: 'gender', values: ['Male', 'Female'] },
    // ];
    public async extractOptionNames (
        variants: csvProductData[]
    ): Promise<CreateProductProductOption_[] | null> {
        const optionMap: { [key: string]: Set<string> } = {};

        // console.log('POSTCheck5.1.3.2.1');

        variants.forEach((variant) => {
            if (!variant.variant) {
                return;
            }
            const options = variant.variant.includes('|')
                ? variant.variant.split('|').map((option) => option.trim())
                : [variant.variant.trim()];
            options.forEach((option) => {
                const [key, value] = option.split('[');
                const cleanValue = value.replace(']', '');
                if (!optionMap[key]) {
                    optionMap[key] = new Set();
                }
                optionMap[key].add(cleanValue);
            });
        });

        // console.log('POSTCheck5.1.3.2.2');

        if (Object.entries(optionMap).length === 0) {
            return null;
        }

        return Object.entries(optionMap).map(([title, values]) => ({
            title,
            values: Array.from(values),
        }));
    }

    /**
     * optionNames: array of option names i.e. 
     [
        { title: 'color', values: ['Black', 'White'] },
        { title: 'size', values: ['L', 'XL'] },
     ]
     
     * productDetails: array of product items variant with name, price i.e. 
     [
        {
            productInfo: {
                name: 'Some product name',
                baseCurrency: 'cny',
            },
            variants: [
                {name: 'L', price: 100}, 
                {name: 'XL', price: 200}
            ]
        }
    ]
    * @param productDetails 
    * @param optionNames 
    * @returns 
    */
    public async mapVariants (
        productDetails: ProductDetails
    ): Promise<(CreateProductProductVariantInput | UpdateProductProductVariantDTO)[]> {
        const variants = [];
        const currencies = [
            { code: 'eth', symbol: 'ETH' },
            { code: 'usdc', symbol: 'USDC' },
            { code: 'usdt', symbol: 'USDT' },
        ];

        // console.log('POSTCheck5.1.3.1');

        //extracts option values from variantData
        //const option = [ { "value":"L" }, { "value":"Black" }, { "value":"Female" } ]
        const extractOptions = (variantString: string): { value: string; option_id: string }[] => {
            const options = variantString.includes('|') ? variantString.split('|') : [variantString];
            return options.map(option => {
                const value = option.trim().split('[')[1].replace(']', '');
                const option_id = "opt_" + value;
                return { value, option_id };
            });
        };

        // console.log('POSTCheck5.1.3.2.3');

        for (const variant of productDetails.variants) {
            //get price
            const baseAmount = variant.variant_price;
            const convertedPrices = await this.getPricesForVariant(
                baseAmount,
                productDetails.productInfo.baseCurrency
            );

            // console.log('POSTCheck5.1.3.2.4');
            // console.log('convertedPrices: ' + JSON.stringify(convertedPrices));
            //TODO: get from someplace global
            const prices = [];
            for (const currency of currencies) {
                const price = convertedPrices.find(
                    (p) => p.currency_code === currency.code
                );
                // console.log('price: ' + JSON.stringify(price));
                prices.push({
                    currency_code: currency.code,
                    amount: Number(price.amount) * 100,
                });
            }

            // console.log('POSTCheck5.1.3.2.5');

            const options = variant.variant ? extractOptions(variant.variant) : null;
            // console.log('options: ' + JSON.stringify(options));

            // console.log('POSTCheck5.1.3.2.6');

            variants.push({
                id: variant.variant_id || null,
                ...(options && { title: options.map((option) => option.value).join(' | ') }),
                inventory_quantity: variant.variant_inventory_quantity,
                allow_backorder:
                    variant.variant_allow_backorder === '1' ? true : false,
                manage_inventory:
                    variant.variant_manage_inventory === '1' ? true : false,
                sku: variant.variant_sku || null,
                barcode: variant.variant_barcode || null,
                ean: variant.variant_ean || null,
                upc: variant.variant_upc || null,
                hs_code: variant.variant_hs_code || null,
                origin_country: variant.variant_origin_country || null,
                mid_code: variant.variant_mid_code || null,
                material: variant.variant_material || null,
                weight: variant.variant_weight || null,
                length: variant.variant_length || null,
                width: variant.variant_width || null,
                height: variant.variant_height || null,
                ...(prices.length > 0 && { prices }),
                ...(options && { options: options }),
            });

            // console.log('POSTCheck5.1.3.2.7');
        }
        // console.log('variants: ' + JSON.stringify(variants));
        return variants;
    };

    /**
     * Extracts and formats image URLs from a given string of image paths.
     * 
     * @param {string} images - A string containing image paths separated by '|'.
     * @param {string} baseImageUrl - The base URL to prepend to image paths that do not start with 'http'.
     * @returns {Promise<string[]>} A promise that resolves to an array of formatted image URLs.
     * 
     * @example
     * const images = "image1.jpg|http://example.com/image2.jpg|image3.png";
     * const baseImageUrl = "http://mybaseurl.com/";
     * extractImages(images, baseImageUrl).then((result) => {
     *     console.log(result);
     *     // Output: [
     *     //   "http://mybaseurl.com/image1.jpg",
     *     //   "http://example.com/image2.jpg",
     *     //   "http://mybaseurl.com/image3.png"
     *     // ]
     * });
     */
    public async extractImages (images: string, baseImageUrl: string): Promise<string[]> {
        const images_ = images.split('|').map((option) => {
            if (option.trim().startsWith('http')) {
                return option.trim();
            } else {
                return baseImageUrl + option.trim();
            }
        });
        return images_;
    }
    
    public async convertCsvDataToUpdateProductInput (
        rowData: csvProductData,
        csvData: csvProductData[],
        store: Store,
        collectionId: string,
        salesChannelIds: string[],
        baseImageUrl: string
    ): Promise<UpdateProductInput> {
        let images: string[] = [];
        let thumbnail: string = '';

        // const productDetails: {
        //     productInfo: {
        //         productId: string;
        //         name: string;
        //         baseCurrency: string;
        //     };
        //     variants: { variantId: string; variantData: string; price: number }[];
        // } = {
        //     productInfo: {
        //         productId: rowData['product_id']
        //         name: rowData['title'],
        //         baseCurrency: 'cny',
        //     },
        //     variants: [
        //         { variantid: rowData['variant_id'], variantData: 'Size[L]|Color[Black] | Gender[Female]', price: rowData['variant_price'] },
        //         { variantid: rowData['variant_id'], variantData: 'Size[L] | Color[Black]|Gender[Male]', price: rowData['variant_price'] },
        //     ],
        // };

        // console.log('POSTCheck5.1.3.1');

        const productDetails: ProductDetails =
            await this.convertRowDataToProductDetails(rowData, csvData, store);
        
        // console.log('POSTCheck5.1.3.2');
        
        // console.log('productDetails: ' + JSON.stringify(productDetails));

        const optionNames: (CreateProductProductOption_[] | null) = await this.extractOptionNames(productDetails.variants);
        // console.log('optionNames: ' + JSON.stringify(optionNames));

        // console.log('POSTCheck5.1.3.3');

        const variants: UpdateProductProductVariantDTO[] = (await this.mapVariants(productDetails)) as UpdateProductProductVariantDTO[];
        // console.log('variants: ' + JSON.stringify(variants));

        // console.log('POSTCheck5.1.3.4');
        
        if (rowData['images'] && rowData['images'].trim() !== '') {
            const images = await this.extractImages(rowData['images'], baseImageUrl);
            // console.log('images: ' + JSON.stringify(images));
        }

        // console.log('POSTCheck5.1.3.5');

        if (rowData['thumbnail'] && rowData['thumbnail'].trim() !== '') {
            const thumbnail = rowData['thumbnail'].startsWith('http')
                ? rowData['thumbnail']
                : baseImageUrl + rowData['thumbnail'];
        }

        // console.log('POSTCheck5.1.3.6');
        
        const output: UpdateProductInput = {
            ...(rowData['product_id'] && { id: rowData['product_id'].trim() }),
            ...(rowData['title'] && { title: rowData['title'] }),
            ...(rowData['subtitle'] && { subtitle: rowData['subtitle'] }),
            ...(rowData['handle'] && { handle: rowData['handle'] }),
            ...(rowData['description'] && { description: rowData['description'] }),
            is_giftcard: false,
            ...(rowData['status'] && { status: rowData['status'] as ProductStatus }),
            ...(thumbnail && thumbnail.trim() !== '' && { thumbnail: thumbnail }),
            ...(images && images.length > 0 && { images: images }),
            collection_id: collectionId,
            ...(rowData['weight'] && { weight: Math.round(Number(rowData['weight'])) }),
            ...(rowData['discountable'] && { discountable: rowData['discountable'] === '1' ? true : false }),
            ...(rowData['category_id'] && { categories: [{ id: rowData['category_id'] }] }),
            ...(salesChannelIds && salesChannelIds.length > 0 && { sales_channels: salesChannelIds.map((sc) => { return { id: sc }; }) }),
            ...(optionNames && optionNames.length > 0 && { options: optionNames }),
            ...(variants && variants.length > 0 && { variants: variants }),
        };
        
        // console.log('POSTCheck5.1.3.7');

        // console.log('Converting data to UpdateProductInput:', JSON.stringify(output));
        // console.log('Converting data to Variants:', JSON.stringify(variants));
        // console.log('Converting data to optionNames:', JSON.stringify(optionNames));

        return output;
    };

    public async processProductUpdate(product: UpdateProductInput, existingProducts: Product[]): Promise<Product | null> {
        const productId = product.id;

        try {
            // Check if the product already exists by product ID
            const existingProduct = existingProducts.find(
                (p) => p.id === productId
            );

            // Update existing product
            if (existingProduct) {
                this.updateProduct(existingProduct.id, product as UpdateProductInput);
                this.logger.info(`Updated product with product ID: ${productId}`);
                return existingProduct;
            }

            // If the product does not exist, create a new one
            this.logger.info(`Product with ID: ${productId} does not exist, creating new product.`);
            return null;
        } catch (error) {
            this.logger.error(`Error processing product with product ID: ${productId}`, error);
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
                    .filter(product => product.id)
                    .map(product => this.productRepository_.findOne({
                        where: { id: product.id },
                        relations: ['variants'],
                    }))
            );

            const updatedProducts = await Promise.all(
                productData.map((product) => this.processProductUpdate(product, existingProducts))
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
            this.logger.error(
                'Error in updating products from CSV: ',
                error
            );
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
    ): Promise<Product | null> {
        try {
            const where: any = { store_id: storeId, id: productId };

            const product = await this.productRepository_.findOne({
                where: where,
                relations: ['variants', 'variants.prices', 'categories'],
            });

            if (!product) {
                throw new Error(
                    `Product with ID ${productId} not found for store ${storeId}`
                );
            }

            return product;
        } catch (e) {
            console.error(`Error querying product by ID: ${e.message}`);
            throw e; // Rethrow the error for the caller to handle
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
     * parses a csv file, and returns the rows as an array
     * @param filePath 
     * @returns 
     */
    async parseCsvFile(filePath: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const fileRows: any[] = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    fileRows.push(row);
                })
                .on('end', () => {
                    fs.unlinkSync(filePath);
                    resolve(fileRows);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    /**
     * validates a csv file, and returns an error message if the file is invalid
     * @param filePath 
     * @param requiredCsvHeadersForProduct 
     * @returns 
     */
    async validateCsv(
        filePath: string,
        requiredCsvHeadersForProduct: string[]
    ): Promise<{ success: boolean; message: string }> {
        const validationErrors = [];
        const fileRows = [];

        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity,
        });

        for await (const line of rl) {
            fileRows.push(line);
        }

        const rowCount = fileRows.length;

        if (rowCount < 2) {
            validationErrors.push({
                error: 'CSV file must contain more than 2 rows',
            });
        } else {
            const headerRow = fileRows[0].split(',');

            // skip validation for header rows if this is an update csv
            if (!headerRow.includes('product_id') && !headerRow.includes('variant_id')) {
                const missingHeaders = requiredCsvHeadersForProduct.filter(
                    (header) => !headerRow.includes(header)
                );
                if (missingHeaders.length > 0) {
                    validationErrors.push({
                        error: `Missing headers in header row: ${missingHeaders.join(', ')}`,
                    });
                }
            }
        }
        return {
            success: validationErrors.length === 0,
            message: validationErrors.map((err) => err.error).join(', '),
        };
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

    /**
     * validates csv data, and returns an object with the validation results
     * @param data 
     * @param requiredCsvHeadersForProduct 
     * @param requiredCsvHeadersForVariant 
     * @returns 
     */
    async validateCsvData(
        data: csvProductData[],
        requiredCsvHeadersForProduct: string[],
        requiredCsvHeadersForVariant: string[],
        requiredCsvHeadersForVariantUpdate: string[],
        requiredCsvHeadersForProductUpdate: string[]
    ): Promise<{
        createSuccess: boolean;
        createMessage: string;
        createValidData: csvProductData[];
        createInvalidData: csvProductData[];
        updateSuccess: boolean;
        updateMessage: string;
        updateValidData: csvProductData[];
        updateInvalidData: csvProductData[];
    }> {
        const createInvalidData: csvProductData[] = [];
        const createValidData: csvProductData[] = [];
        const updateInvalidData: csvProductData[] = [];
        const updateValidData: csvProductData[] = [];
        
        const fieldHasData = (field: string) => field && field.trim() !== '';

        // split data into create rows and update rows
        const createRows = [];
        const updateRows = [];
        for (const row of data) {
            const isVariant = this.csvRowIsVariantOnly(
                row,
                requiredCsvHeadersForVariant,
                requiredCsvHeadersForProduct,
                requiredCsvHeadersForVariantUpdate,
                requiredCsvHeadersForProductUpdate
            );
            if (isVariant) {
                if (!fieldHasData(row['variant_id'])) {
                    createRows.push(row);
                } else {
                    updateRows.push(row);
                }
            } else {
                if (!fieldHasData(row['product_id'])) {
                    createRows.push(row);
                } else {
                    updateRows.push(row);
                }
            }
        }

        // console.log('createRows: ' + JSON.stringify(createRows));
        // console.log('updateRows: ' + JSON.stringify(updateRows));

        // create row and update row validations are different, so we need to validate each row separately
        // validate create rows
        if (createRows.length > 0) {
            for (const row of createRows) {
                const validationError = await this.validateCsvRow(
                    data,
                    row,
                    requiredCsvHeadersForProduct,
                    requiredCsvHeadersForVariant,
                    requiredCsvHeadersForVariantUpdate,
                    requiredCsvHeadersForProductUpdate,
                    true
                );
                if (validationError) {
                    row['invalid_error'] = validationError;
                    createInvalidData.push(row);
                } else {
                    createValidData.push(row);
                }
            }
        }
        
        // validate update rows
        if (updateRows.length > 0) {
            for (const row of updateRows) {
                const validationError = await this.validateCsvRow(
                    data,
                    row,
                    requiredCsvHeadersForProduct,
                    requiredCsvHeadersForVariant,
                    requiredCsvHeadersForVariantUpdate,
                    requiredCsvHeadersForProductUpdate,
                    false
                );
                if (validationError) {
                    row['invalid_error'] = validationError;
                    updateInvalidData.push(row);
                } else {
                    updateValidData.push(row);
                }
            }
        }

        let createSuccess = false;
        let createMessage = '';
        if (createRows.length > 0) {
        createSuccess = createValidData.length > 0;
        createMessage =
            createInvalidData.length > 0
                ? 'Contains SOME valid data'
                : 'Contains valid data';
        } else {
            createMessage = 'There are no product rows to create.';
        }

        let updateSuccess = false;
        let updateMessage = '';
        if (updateRows.length > 0) {
            updateSuccess = updateValidData.length > 0;
            updateMessage =
                updateInvalidData.length > 0
                    ? 'Contains SOME valid data'
                    : 'Contains valid data';
        } else {
            updateMessage = 'There are no product rows for updating.';
        }

        return {
            createSuccess,
            createMessage: createMessage !== '' ? createMessage : 'Contains invalid data',
            createValidData,
            createInvalidData,
            updateSuccess,
            updateMessage: updateMessage !== '' ? updateMessage : 'Contains invalid data',
            updateValidData,
            updateInvalidData,
        };
    }

    /**
     * Determines if a row is a variant. This means it ONLY contains variant content and NO product content.
     * @param row - The CSV row data to check.
     * @param requiredCsvHeadersForVariant - The required CSV headers for a variant.
     * @param requiredCsvHeadersForProduct - The required CSV headers for a product.
     * @param requiredCsvHeadersForVariantUpdate - The required CSV headers for a variant update.
     * @param requiredCsvHeadersForProductUpdate - The required CSV headers for a product update.
     * @returns {boolean} - Returns true if the row is a variant only, otherwise false.
     */
    csvRowIsVariantOnly(
        row: csvProductData,
        requiredCsvHeadersForVariant: string[],
        requiredCsvHeadersForProduct: string[],
        requiredCsvHeadersForVariantUpdate: string[],
        requiredCsvHeadersForProductUpdate: string[]
    ): boolean {
        const headerForVariant = row['variant_id'] ? requiredCsvHeadersForVariantUpdate : requiredCsvHeadersForVariant;
        const headerForProduct = row['product_id'] ? requiredCsvHeadersForProductUpdate : requiredCsvHeadersForProduct;

        // console.log('START--------------------------------');
        // console.log('variantTEST: ' + headerForVariant.every((header) => row[header]));
        // console.log('productTEST: ' + headerForProduct.every(
        //     (header) =>
        //         !row[header] || headerForVariant.includes(header)));
        // console.log('END--------------------------------');

        return headerForVariant.every((header) => row[header]) &&
            headerForProduct.every(
                (header) =>
                    !row[header] || headerForVariant.includes(header));
    }

    /**
     * Determines if a row has variant data. This checks if the row contains variant data, but not necessarily variant only.
     * @param row - The CSV row data to check.
     * @param requiredCsvHeadersForVariant - The required CSV headers for a variant.
     * @param requiredCsvHeadersForVariantUpdate - The required CSV headers for a variant update.
     * @returns {boolean} - Returns true if the row has variant data, otherwise false.
     */
    csvRowHasVariant(
        row: csvProductData,
        requiredCsvHeadersForVariant: string[],
        requiredCsvHeadersForVariantUpdate: string[],
    ): boolean {
        const headerForVariant = row['variant_id'] ? requiredCsvHeadersForVariantUpdate : requiredCsvHeadersForVariant;
        return headerForVariant.every((header) => row[header]);
    }

    /**
     * filters out rows that don't have the required headers for product
     * @param data 
     * @param requiredCsvHeadersForProduct 
     * @param requiredCsvHeadersForVariant 
     * @returns 
     */
    async filterCsvProductRows(
        data: csvProductData[],
        requiredCsvHeadersForProduct: string[],
        requiredCsvHeadersForVariant: string[],
        requiredCsvHeadersForProductUpdate: string[],
        requiredCsvHeadersForVariantUpdate: string[]
    ): Promise<csvProductData[]> {
        return data.filter(
            (item) =>
                !this.csvRowIsVariantOnly(
                    item,
                    requiredCsvHeadersForVariant,
                    requiredCsvHeadersForProduct,
                    requiredCsvHeadersForVariantUpdate,
                    requiredCsvHeadersForProductUpdate
                )
        );
    }

    /**
     * validates a row, and returns an error message if the row is invalid
     * @param data 
     * @param row 
     * @param requiredCsvHeadersForProduct 
     * @param requiredCsvHeadersForVariant 
     * @param isCreate - true if the row is a create row, false if the row is an update row
     * @returns 
     */
    async validateCsvRow(
        data: csvProductData[],
        row: csvProductData,
        requiredCsvHeadersForProduct: string[],
        requiredCsvHeadersForVariant: string[],
        requiredCsvHeadersForVariantUpdate: string[],
        requiredCsvHeadersForProductUpdate: string[],
        isCreate: boolean
    ): Promise<string | null> {
        // determine if this is a product row or variant
        // then, validate accordingly.
        const isVariant = this.csvRowIsVariantOnly(
            row,
            requiredCsvHeadersForVariant,
            requiredCsvHeadersForProduct,
            requiredCsvHeadersForVariantUpdate,
            requiredCsvHeadersForProductUpdate
        );
        // console.log('isVariant: ' + isVariant);

        if (isVariant) {
            if (!isCreate && !row['variant_id']) {
                return 'required variant_id missing data';
            }

            if (isCreate && requiredCsvHeadersForVariant.some((header) => !row[header])) {
                return 'required variant fields missing data';
            }
            return await this.validateCsvVariantRow(row, data, isCreate);
        } else {
            if (!isCreate && !row['product_id']) {
                return 'required product_id missing data';
            }

            if (isCreate && requiredCsvHeadersForProduct.some((header) => !row[header])) {
                const missingHeader = requiredCsvHeadersForProduct.find((header) => !row[header]);
                return 'required product fields missing data: ' + missingHeader;
            }

            return await this.validateCsvProductRow(
                row,
                data,
                requiredCsvHeadersForProduct,
                requiredCsvHeadersForVariant,
                requiredCsvHeadersForProductUpdate,
                requiredCsvHeadersForVariantUpdate,
                isCreate
            );
        }
    }

    /**
     * validates a product row, and returns an error message if the row is invalid
     * @param row 
     * @param data 
     * @param requiredCsvHeadersForProduct 
     * @param requiredCsvHeadersForVariant 
     * @returns 
     */
    async validateCsvProductRow(
        row: csvProductData,
        data: csvProductData[],
        requiredCsvHeadersForProduct: string[],
        requiredCsvHeadersForVariant: string[],
        requiredCsvHeadersForProductUpdate: string[],
        requiredCsvHeadersForVariantUpdate: string[],
        isCreate: boolean
    ): Promise<string | null> {
        //validate product_id
        if (!isCreate && row['product_id'] && row['product_id'].trim() !== '') {
            const product = await this.getProductById(row['product_id']);
            // console.log('product: ' + JSON.stringify(product));
            if (!product) {
                return 'product id does not exist';
            }
        }

        if (isCreate && row['category'] && row['category'].trim() !== '') {
            const categoryId = await this.validateCategory(row['category']);
            if (!categoryId) {
                return 'category handle does not exist';
            }

            row['category_id'] = categoryId;
        }

        if (isCreate && row['status'] && row['status'].trim() !== '') {
            if (![ProductStatus.DRAFT, ProductStatus.PUBLISHED].includes(row['status'])) {
                return 'status is not valid, status must be draft or published';
            }
        }

        if (isCreate && row['weight'] && row['weight'].trim() !== '') {
            if (!Number.isInteger(Number(row['weight']))) {
                return 'weight must be a whole number';
            }
        }

        if (isCreate && row['discountable'] && row['discountable'].trim() !== '') {
            if (!['0', '1'].includes(row['discountable'])) {
                return 'discountable must be a 0 or 1';
            }
        }

        if (isCreate && row['variant_price'] && row['variant_price'].trim() !== '') {
            if (!Number.isInteger(Number(row['variant_price']))) {
                return 'variant price must be a whole number';
            }
        }

        if (isCreate && row['variant_inventory_quantity'] && row['variant_inventory_quantity'].trim() !== '') {
            if (!Number.isInteger(Number(row['variant_inventory_quantity']))) {
                return 'variant inventory quantity must be a whole number';
            }
        }

        if (isCreate && row['variant_allow_backorder'] && row['variant_allow_backorder'].trim() !== '') {
            if (!['0', '1'].includes(row['variant_allow_backorder'])) {
                return 'variant allow backorder must be a 0 or 1';
            }
        }

        if (isCreate && row['variant_manage_inventory'] && row['variant_manage_inventory'].trim() !== '') {
            if (!['0', '1'].includes(row['variant_manage_inventory'])) {
                return 'variant manage inventory must be a 0 or 1';
            }
        }

        if (isCreate && row['handle'] && row['handle'].trim() !== '') {
            const product = await this.getProductByHandle(row['handle']);
            if (product) {
                return 'product handle must be unique';
            }

            // check if handle is unique from other product rows
            const productRows = await this.filterCsvProductRows(
                data,
                requiredCsvHeadersForProduct,
                requiredCsvHeadersForVariant,
                requiredCsvHeadersForProductUpdate,
                requiredCsvHeadersForVariantUpdate
            );
            const handleExistsInProducts = productRows.some(
                (item) => item !== row && item['handle'] === row['handle']
            );
            if (handleExistsInProducts) {
                return 'handle must be unique from other product rows';
            }
        }

        // check if thumbnail is a valid url
        // if (!row['thumbnail'].startsWith('http')) {
        //     return 'thumbnail must be a valid url';
        // }

        // check if thumbnail is a valid image
        // if (
        //     !row['thumbnail'].endsWith('.jpg') &&
        //     !row['thumbnail'].endsWith('.png') &&
        //     !row['thumbnail'].endsWith('.jpeg') &&
        //     !row['thumbnail'].endsWith('.svg') &&
        //     !row['thumbnail'].endsWith('.gif')
        // ) {
        //     return 'thumbnail must be a valid image';
        // }

        await this.validateCsvVariantRow(row, data, row['variant_id'] ? true : false);

        return null;
    }

    /**
     * validates a variant row, and returns an error message if the row is invalid
     * @param row 
     * @param data 
     * @param isCreate 
     * @returns 
     */
    async validateCsvVariantRow(
        row: csvProductData,
        data: csvProductData[],
        isCreate: boolean
    ): Promise<string | null> {
        //if isCreate is true validate variant_id
        if (isCreate && row['variant_id'] && row['variant_id'].trim() !== '') {
            const productVariant = await this.productVariantService_.getVariantById(row['variant_id']);
            if (!productVariant) {
                return 'variant id does not exist';
            }
        }

        // START: check if barcode is unique
        if (
            !isCreate || 
            (isCreate && row['variant_barcode'] && row['variant_barcode'].trim() !== '')
        ) {
            if (row['variant_barcode'] && row['variant_barcode'].trim() !== '') {
                const productVariantBarcode =
                    await this.productVariantService_.getVariantByBarcode(
                        row['variant_barcode']
                    );
                if (productVariantBarcode) {
                    return 'barcode must be unique';
                }

                const barcodeExistsInVariants = data.some(
                    (item) =>
                        item !== row &&
                        item['variant_barcode'] === row['variant_barcode']
                );
                if (barcodeExistsInVariants) {
                    return 'barcode must be unique from other rows';
                }
            }
        }
        // END: check if barcode is unique

        // START: check if sku is unique
        if (
            !isCreate || 
            (isCreate && row['variant_sku'] && row['variant_sku'].trim() !== '')
        ) {
            if (row['variant_sku'] && row['variant_sku'].trim() !== '') {
                const productVariantSku =
                    await this.productVariantService_.getVariantBySku(
                        row['variant_sku']
                    );
                if (productVariantSku) {
                    return 'sku must be unique';
                }

                const skuExistsInVariants = data.some(
                    (item) =>
                        item !== row && item['variant_sku'] === row['variant_sku']
                );
                if (skuExistsInVariants) {
                    return 'sku must be unique from other rows';
                }
            }
        }
        // END: check if sku is unique

        // START: check if upc is unique
        if (
            !isCreate || 
            (isCreate && row['variant_upc'] && row['variant_upc'].trim() !== '')
        ) {
            if (row['variant_upc'] && row['variant_upc'].trim() !== '') {
                const productVariantUpc =
                    await this.productVariantService_.getVariantByUpc(
                        row['variant_upc']
                    );
                if (productVariantUpc) {
                    return 'upc must be unique';
                }

                const upcExistsInVariants = data.some(
                    (item) =>
                        item !== row && item['variant_upc'] === row['variant_upc']
                );
                if (upcExistsInVariants) {
                    return 'upc must be unique from other rows';
                }
            }
        }
        // END: check if upc is unique

        // START: check if ean is unique
        if (
            !isCreate || 
            (isCreate && row['variant_ean'] && row['variant_ean'].trim() !== '')
        ) {
            if (row['variant_ean'] && row['variant_ean'].trim() !== '') {
                const productVariantEan =
                    await this.productVariantService_.getVariantByEan(
                        row['variant_ean']
                    );
                if (productVariantEan) {
                    return 'ean must be unique';
                }

                const eanExistsInVariants = data.some(
                    (item) =>
                        item !== row && item['variant_ean'] === row['variant_ean']
                );
                if (eanExistsInVariants) {
                    return 'ean must be unique from other rows';
                }
            }
        }
        // END: check if ean is unique

        if (
            !isCreate || 
            (isCreate && row['variant_price'] && row['variant_price'].trim() !== '')
        ) {
            if (!Number.isInteger(Number(row['variant_price']))) {
                return 'variant price must be a whole number';
            }
        }

        if (
            !isCreate || 
            (isCreate && row['variant_inventory_quantity'] && row['variant_inventory_quantity'].trim() !== '')
        ) {
            if (!Number.isInteger(Number(row['variant_inventory_quantity']))) {
                return 'variant inventory quantity must be a whole number';
            }
        }
        
        if (
            !isCreate || 
            (isCreate && row['variant_allow_backorder'] && row['variant_allow_backorder'].trim() !== '')
        ) {
            if (!['0', '1'].includes(row['variant_allow_backorder'])) {
                return 'variant allow backorder must be a 0 or 1';
            }
        }

        if (
            !isCreate || 
            (isCreate && row['variant_manage_inventory'] && row['variant_manage_inventory'].trim() !== '')
        ) {
            if (!['0', '1'].includes(row['variant_manage_inventory'])) {
                return 'variant manage inventory must be a 0 or 1';
            }
        }

        return null;
    }

    /**
     * gets the prices for a variant
     * @param baseAmount 
     * @param baseCurrency 
     * @returns 
     */
    async getPricesForVariant(
        baseAmount: string,
        baseCurrency: string
    ): Promise<Price[]> {
        //TODO: get from someplace global
        const currencies = ['eth', 'usdc', 'usdt'];
        const prices = [];

        // console.log("baseCurrency: " + baseCurrency);
        // console.log("baseAmount: " + baseAmount);

        for (const currency of currencies) {
            const price = await this.priceConverter_.getPrice({
                baseAmount: Number(baseAmount),
                baseCurrency: baseCurrency,
                toCurrency: currency,
            });
            // console.log("price: " + price);
            prices.push({
                currency_code: currency,
                amount: price,
            });
        }
        //console.log(prices);
        //this.logger.debug(prices);
        return prices;
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
