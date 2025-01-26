import { Lifetime } from 'awilix';
import {
    ProductService as MedusaProductService,
    Store,
    ProductStatus,
		Product,
} from '@medusajs/medusa';
import {
		CreateProductProductVariantInput,
} from '@medusajs/medusa/dist/types/product';
import { StoreRepository } from '../repositories/store';
import ProductCategoryRepository from '@medusajs/medusa/dist/repositories/product-category';
import { CachedExchangeRateRepository } from '../repositories/cached-exchange-rate';
import CustomerService from './customer';
import ProductVariantService from './product-variant';
import { ProductVariantRepository } from '../repositories/product-variant';
import SalesChannelRepository from '@medusajs/medusa/dist/repositories/sales-channel';
import ProductCollectionRepository from '@medusajs/medusa/dist/repositories/product-collection';
import { createLogger, ILogger } from '../utils/logging/logger';
import { PriceConverter } from '../utils/price-conversion';
import ProductService, {
    CreateProductProductOption_,
    Price,
    UpdateProductProductVariantDTO,
    CreateProductInput,
    UpdateProductInput,
} from './product';
import fs from 'fs';
import csv from 'csv-parser';
import * as readline from 'readline';

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

export const requiredCsvHeadersForProduct = [
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

export const requiredCsvHeadersForVariant = [
	'handle',
	'variant',
	'variant_price',
	'variant_inventory_quantity',
	'variant_allow_backorder',
	'variant_manage_inventory',
];

export const requiredCsvHeadersForVariantUpdate = [
	...requiredCsvHeadersForVariant.filter((header) => header !== 'variant'),
	'variant_id',
];

export const requiredCsvHeadersForProductUpdate = [
	...requiredCsvHeadersForProduct.filter((header) => header !== 'variant'),
	'product_id',
];

class ProductCsvService extends MedusaProductService {
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
	protected readonly productService_: ProductService;

	constructor(container) {
			super(container);
			this.logger = createLogger(container, 'ProductCsvService');
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
			this.productService_ = container.productService;
			this.priceConverter_ = new PriceConverter(
					this.logger,
					this.cacheExchangeRateRepository
			);
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
					if (
							!headerRow.includes('product_id') &&
							!headerRow.includes('variant_id')
					) {
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
					createMessage:
							createMessage !== '' ? createMessage : 'Contains invalid data',
					createValidData,
					createInvalidData,
					updateSuccess,
					updateMessage:
							updateMessage !== '' ? updateMessage : 'Contains invalid data',
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
			const headerForVariant = row['variant_id']
					? requiredCsvHeadersForVariantUpdate
					: requiredCsvHeadersForVariant;
			const headerForProduct = row['product_id']
					? requiredCsvHeadersForProductUpdate
					: requiredCsvHeadersForProduct;
			const productSpecificHeaders = headerForProduct.filter(
					(header) => !headerForVariant.includes(header)
			);

			// Check if all headers in headerForVariant are present in the row
			const hasAllVariantHeaders = headerForVariant.every((header) =>
					typeof row[header] === 'string'
							? row[header].trim() !== ''
							: row[header] !== undefined
			);

			// Check if none of the product-specific headers are present in the row
			const hasNoProductSpecificHeaders = productSpecificHeaders.every(
					(header) =>
							typeof row[header] === 'string'
									? row[header].trim() === ''
									: row[header] === undefined
			);

			return (
					headerForVariant.every((header) => row[header]) &&
					headerForProduct.every(
							(header) => !row[header] || headerForVariant.includes(header)
					)
			);
			// The row is variant-only if it has all variant headers and no product-specific headers
			// this.logger.debug('row: ' + JSON.stringify(row));
			// this.logger.debug('hasAllVariantHeaders: ' + hasAllVariantHeaders);
			// this.logger.debug('hasNoProductSpecificHeaders: ' + hasNoProductSpecificHeaders);
			// this.logger.debug('isVariantOnly: ' + (hasAllVariantHeaders && hasNoProductSpecificHeaders));
			// this.logger.debug('--------------------------------');
			return hasAllVariantHeaders && hasNoProductSpecificHeaders;
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
		requiredCsvHeadersForVariantUpdate: string[]
	): boolean {
			const headerForVariant = row['variant_id']
					? requiredCsvHeadersForVariantUpdate
					: requiredCsvHeadersForVariant;
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
			const filteredData = data.filter((row) => {
					return !this.csvRowIsVariantOnly(
							row,
							requiredCsvHeadersForVariant,
							requiredCsvHeadersForProduct,
							requiredCsvHeadersForVariantUpdate,
							requiredCsvHeadersForProductUpdate
					);
			});
			// this.logger.debug('data: ' + JSON.stringify(data));
			// this.logger.debug('filteredData: ' + JSON.stringify(filteredData));
			return filteredData;
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

					if (
							isCreate &&
							requiredCsvHeadersForVariant.some((header) => !row[header])
					) {
							return 'required variant fields missing data';
					}
					return await this.validateCsvVariantRow(row, data, isCreate);
			} else {
					if (!isCreate && !row['product_id']) {
							return 'required product_id missing data';
					}

					if (
							isCreate &&
							requiredCsvHeadersForProduct.some((header) => !row[header])
					) {
							const missingHeader = requiredCsvHeadersForProduct.find(
									(header) => !row[header]
							);
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
					const product = await this.productService_.getProductById(row['product_id']);
					// console.log('product: ' + JSON.stringify(product));
					if (!product) {
							return 'product id does not exist';
					}
			}

			if (isCreate && row['category'] && row['category'].trim() !== '') {
					const categoryId = await this.productService_.validateCategory(row['category']);
					if (!categoryId) {
							return 'category handle does not exist';
					}

					row['category_id'] = categoryId;
			}

			if (isCreate && row['status'] && row['status'].trim() !== '') {
					if (
							![ProductStatus.DRAFT, ProductStatus.PUBLISHED].includes(
									row['status']
							)
					) {
							return 'status is not valid, status must be draft or published';
					}
			}

			if (isCreate && row['weight'] && row['weight'].trim() !== '') {
					if (!Number.isInteger(Number(row['weight']))) {
							return 'weight must be a whole number';
					}
			}

			if (
					isCreate &&
					row['discountable'] &&
					row['discountable'].trim() !== ''
			) {
					if (!['0', '1'].includes(row['discountable'])) {
							return 'discountable must be a 0 or 1';
					}
			}

			if (
					isCreate &&
					row['variant_price'] &&
					row['variant_price'].trim() !== ''
			) {
					if (!Number.isInteger(Number(row['variant_price']))) {
							return 'variant price must be a whole number';
					}
			}

			if (
					isCreate &&
					row['variant_inventory_quantity'] &&
					row['variant_inventory_quantity'].trim() !== ''
			) {
					if (!Number.isInteger(Number(row['variant_inventory_quantity']))) {
							return 'variant inventory quantity must be a whole number';
					}
			}

			if (
					isCreate &&
					row['variant_allow_backorder'] &&
					row['variant_allow_backorder'].trim() !== ''
			) {
					if (!['0', '1'].includes(row['variant_allow_backorder'])) {
							return 'variant allow backorder must be a 0 or 1';
					}
			}

			if (
					isCreate &&
					row['variant_manage_inventory'] &&
					row['variant_manage_inventory'].trim() !== ''
			) {
					if (!['0', '1'].includes(row['variant_manage_inventory'])) {
							return 'variant manage inventory must be a 0 or 1';
					}
			}

			if (isCreate && row['handle'] && row['handle'].trim() !== '') {
					const product = await this.productService_.getProductByHandle(row['handle']);
					if (product) {
							return (
									'database contains the same product handle (' +
									row['handle'] +
									'), please try a new one'
							);
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
							// this.logger.debug('productRows: ' + JSON.stringify(productRows));
							return (
									'The handle (' +
									row['handle'] +
									') must be unique from other product rows in the CSV.'
							);
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

			await this.validateCsvVariantRow(
					row,
					data,
					row['variant_id'] ? true : false
			);

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
					const productVariant =
							await this.productVariantService_.getVariantById(
									row['variant_id']
							);
					if (!productVariant) {
							return 'variant id does not exist';
					}
			}

			// START: check if barcode is unique
			if (
					!isCreate ||
					(isCreate &&
							row['variant_barcode'] &&
							row['variant_barcode'].trim() !== '')
			) {
					if (
							row['variant_barcode'] &&
							row['variant_barcode'].trim() !== ''
					) {
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
											item !== row &&
											item['variant_sku'] === row['variant_sku']
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
											item !== row &&
											item['variant_upc'] === row['variant_upc']
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
											item !== row &&
											item['variant_ean'] === row['variant_ean']
							);
							if (eanExistsInVariants) {
									return 'ean must be unique from other rows';
							}
					}
			}
			// END: check if ean is unique

			if (
					!isCreate ||
					(isCreate &&
							row['variant_price'] &&
							row['variant_price'].trim() !== '')
			) {
					if (!Number.isInteger(Number(row['variant_price']))) {
							return 'variant price must be a whole number';
					}
			}

			if (
					!isCreate ||
					(isCreate &&
							row['variant_inventory_quantity'] &&
							row['variant_inventory_quantity'].trim() !== '')
			) {
					if (!Number.isInteger(Number(row['variant_inventory_quantity']))) {
							return 'variant inventory quantity must be a whole number';
					}
			}

			if (
					!isCreate ||
					(isCreate &&
							row['variant_allow_backorder'] &&
							row['variant_allow_backorder'].trim() !== '')
			) {
					if (!['0', '1'].includes(row['variant_allow_backorder'])) {
							return 'variant allow backorder must be a 0 or 1';
					}
			}

			if (
					!isCreate ||
					(isCreate &&
							row['variant_manage_inventory'] &&
							row['variant_manage_inventory'].trim() !== '')
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
	public async mapVariants(
		productDetails: ProductDetails
	): Promise<
		(CreateProductProductVariantInput | UpdateProductProductVariantDTO)[]
	> {
		const variants = [];
		const currencies = [
				{ code: 'eth', symbol: 'ETH' },
				{ code: 'usdc', symbol: 'USDC' },
				{ code: 'usdt', symbol: 'USDT' },
		];

		// console.log('POSTCheck5.1.3.1');

		//extracts option values from variantData
		//const option = [ { "value":"L" }, { "value":"Black" }, { "value":"Female" } ]
		const extractOptions = (
				variantString: string
		): { value: string }[] => {
				const options = variantString.includes('|')
						? variantString.split('|')
						: [variantString];
				return options.map((option) => {
						const value = option.trim().split('[')[1].replace(']', '');
						return { value };
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

				const options = variant.variant
						? extractOptions(variant.variant)
						: null;
				// console.log('options: ' + JSON.stringify(options));

				// console.log('POSTCheck5.1.3.2.6');

				variants.push({
						id: variant.variant_id || null,
						...(options && {
								title: options.map((option) => option.value).join(' | '),
						}),
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
	}

	/**
			 *
			 * @param rowData - product row data
			 * @param csvData - all csv data
			 * @returns
			 */
	public async convertRowDataToProductDetails(
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
						(row) =>
								rowData !== row &&
								row.handle &&
								rowData.handle &&
								row.handle === rowData.handle
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
	}

	// generate option names from variantData
	// const optionNames: extractOptionNames[] = [
	//     { title: 'color', values: ['Black', 'White'] },
	//     { title: 'size', values: ['L', 'XL'] },
	//     { title: 'gender', values: ['Male', 'Female'] },
	// ];
	public async extractOptionNames(
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
	public async extractImages(
		images: string,
		baseImageUrl: string
	): Promise<string[]> {
		const images_ = images.split('|').map((option) => {
				if (option.trim().startsWith('http')) {
						return option.trim();
				} else {
						return baseImageUrl + option.trim();
				}
		});
		return images_;
	}

	public async convertCsvDataToCreateProductInput(
		rowData: csvProductData,
		csvData: csvProductData[],
		store: Store,
		collectionId: string,
		salesChannelIds: string[],
		baseImageUrl: string
	): Promise<CreateProductInput> {
			// const productDetails: {
			//     productInfo: {
			//         name: string;
			//         baseCurrency: string;
			//     };
			//     variants: { variantData: string; price: number }[];
			// } = {
			//     productInfo: {
			//         name: rowData['title'],
			//         baseCurrency: 'cny',
			//     },
			//     variants: [
			//         { variantData: 'Size[L]|Color[Black] | Gender[Female]', price: rowData['variant_price'] },
			//         { variantData: 'Size[L] | Color[Black]|Gender[Male]', price: rowData['variant_price'] },
			//         { variantData: 'Size[L] | Color[White] | Gender[Female]', price: rowData['variant_price'] },
			//         { variantData: 'Size[L] | Color[White] | Gender[Male]', price: rowData['variant_price'] },
			//         { variantData: 'Size[XL] | Color[Black] | Gender[Female]', price: rowData['variant_price'] },
			//         { variantData: 'Size[XL] | Color[Black] | Gender[Male]', price: rowData['variant_price'] },
			//         { variantData: 'Size[XL] | Color[White] | Gender[Female]', price: rowData['variant_price'] },
			//         { variantData: 'Size[XL] | Color[White] | Gender[Male]', price: rowData['variant_price'] },
			//     ],
			// };
			const productDetails: ProductDetails =
					await this.convertRowDataToProductDetails(rowData, csvData, store);

			const optionNames = await this.extractOptionNames(productDetails.variants);
			// console.log('optionNames: ' + JSON.stringify(optionNames));

			const variants = await this.mapVariants(productDetails);
			// console.log('variants: ' + JSON.stringify(variants));

			const images = await this.extractImages(rowData['images'], baseImageUrl);
			// console.log('images: ' + JSON.stringify(images));

			const thumbnail = rowData['thumbnail'].startsWith('http')
					? rowData['thumbnail']
					: baseImageUrl + rowData['thumbnail'];

			const output = {
					title: rowData['title'],
					subtitle: rowData['subtitle'],
					handle: rowData['handle'],
					description: rowData['description'],
					is_giftcard: false,
					status: rowData['status'] as ProductStatus,
					thumbnail: thumbnail,
					images: images,
					collection_id: collectionId,
					weight: Math.round(Number(rowData['weight']) ?? 100),
					discountable: rowData['discountable'] === '1' ? true : false,
					store_id: store.id,
					categories: [{ id: rowData['category_id'] }],
					sales_channels: salesChannelIds.map((sc) => {
							return { id: sc };
					}),
					options: optionNames,
					variants,
			} as CreateProductInput;

			// console.log('Converting data to CreateProductInput:', JSON.stringify(output));
			// console.log('Converting data to Variants:', JSON.stringify(variants));
			// console.log('Converting data to optionNames:', JSON.stringify(optionNames));

			if (!output.variants?.length)
					throw new Error(
							`No variants were detected for product ${output.handle}`
					);

			return output;
	};

	public async convertCsvDataToUpdateProductInput(
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

		const optionNames: CreateProductProductOption_[] | null =
				await this.extractOptionNames(productDetails.variants);
		// console.log('optionNames: ' + JSON.stringify(optionNames));

		// console.log('POSTCheck5.1.3.3');

		const variants: UpdateProductProductVariantDTO[] =
				(await this.mapVariants(
						productDetails
				)) as UpdateProductProductVariantDTO[];
		// console.log('variants: ' + JSON.stringify(variants));

		// console.log('POSTCheck5.1.3.4');

		if (rowData['images'] && rowData['images'].trim() !== '') {
				const images = await this.extractImages(
						rowData['images'],
						baseImageUrl
				);
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
				...(rowData['description'] && {
						description: rowData['description'],
				}),
				is_giftcard: false,
				...(rowData['status'] && {
						status: rowData['status'] as ProductStatus,
				}),
				...(thumbnail &&
						thumbnail.trim() !== '' && { thumbnail: thumbnail }),
				...(images && images.length > 0 && { images: images }),
				collection_id: collectionId,
				...(rowData['weight'] && {
						weight: Math.round(Number(rowData['weight'])),
				}),
				...(rowData['discountable'] && {
						discountable: rowData['discountable'] === '1' ? true : false,
				}),
				...(rowData['category_id'] && {
						categories: [{ id: rowData['category_id'] }],
				}),
				...(salesChannelIds &&
						salesChannelIds.length > 0 && {
								sales_channels: salesChannelIds.map((sc) => {
										return { id: sc };
								}),
						}),
				...(optionNames &&
						optionNames.length > 0 && { options: optionNames }),
				...(variants && variants.length > 0 && { variants: variants }),
		};

		// console.log('POSTCheck5.1.3.7');

		// console.log('Converting data to UpdateProductInput:', JSON.stringify(output));
		// console.log('Converting data to Variants:', JSON.stringify(variants));
		// console.log('Converting data to optionNames:', JSON.stringify(optionNames));

		return output;
	}

	public async convertCreateCsvData(
		store: Store,
		collectionId: string,
		salesChannelId: string,
		baseImageUrl: string,
		data: csvProductData[]
	): Promise<{
			success: boolean;
			message: string;
			jsonData?: CreateProductInput[];
	}> {
			let productInputs: CreateProductInput[] = [];

			// TODO: get collectionId and salesChannelId from database
			// const collectionId = 'pcol_01HRVF8HCVY8B00RF5S54THTPC';
			// const salesChannelId = 'sc_01JE2GP93F1P0621E4ZCKK1AYR';

			/**
			 * Validate the see if there are product rows.
			 * This is only for create instance.
			 */
			const productRows = await this.filterCsvProductRows(
					data,
					requiredCsvHeadersForProduct,
					requiredCsvHeadersForVariant,
					requiredCsvHeadersForProductUpdate,
					requiredCsvHeadersForVariantUpdate
			);
			if (productRows.length === 0) {
					return {
							success: false,
							message:
									'Your spreadsheet does not contain any create product rows',
					};
			}

			// convert row to CreateDataInput
			for (let p of productRows) {
					// console.log('p: ' + JSON.stringify(p));
					productInputs.push(
							await convertCsvDataToCreateProductInput(
									p,
									data,
									store,
									collectionId,
									[salesChannelId],
									baseImageUrl
							)
					);
			}

			return {
					success: true,
					message: 'data converted successfully',
					jsonData: productInputs,
			};
	};

	public async convertUpdateCsvData(
			store: Store,
			collectionId: string,
			salesChannelId: string,
			baseImageUrl: string,
			data: csvProductData[]
	): Promise<{
			success: boolean;
			message: string;
			variantOnly: boolean;
			jsonData?: (UpdateProductInput | UpdateProductProductVariantDTO)[];
	}> {
			let productInputs: UpdateProductInput[] = [];
			let variantInputs: UpdateProductProductVariantDTO[] = [];

			// TODO: get collectionId and salesChannelId from database
			// const collectionId = 'pcol_01HRVF8HCVY8B00RF5S54THTPC';
			// const salesChannelId = 'sc_01JE2GP93F1P0621E4ZCKK1AYR';

			// console.log('data: ' + JSON.stringify(data));
			// console.log('POSTCheck5.1.1');

			/**
			 * Validate the see if there are product rows.
			 * This is only for create instance.
			 */
			const productRows = await this.filterCsvProductRows(
					data,
					requiredCsvHeadersForProduct,
					requiredCsvHeadersForVariant,
					requiredCsvHeadersForProductUpdate,
					requiredCsvHeadersForVariantUpdate
			);

			// console.log('productRows: ' + JSON.stringify(productRows));

			// console.log('POSTCheck5.1.2');

			// if update is only a bunch of variants, we'll need to update variants only, not the product
			if (productRows.length === 0) {
					for (let d of data) {
							//TODO: handle variant only update
							variantInputs
									.push
									// await convertCsvDataToUpdateVariantInput(d)
									();
					}

					// console.log('variantInputs: ' + JSON.stringify(variantInputs));

					return {
							success: true,
							message: 'data converted successfully',
							variantOnly: true,
							jsonData: variantInputs,
					};
			}

			// console.log('POSTCheck5.1.3');

			// convert row to CreateDataInput
			// console.log('productRows: ' + JSON.stringify(productRows));

			for (let p of productRows) {
					// console.log('p: ' + JSON.stringify(p));
					productInputs.push(
							await convertCsvDataToUpdateProductInput(
									p,
									data,
									store,
									collectionId,
									salesChannelId ? [salesChannelId] : null,
									baseImageUrl
							)
					);
			}

			// console.log('POSTCheck5.1.4');

			// console.log('productInputs2: ' + JSON.stringify(productInputs));

			// console.log('productInputs: ' + JSON.stringify(productInputs));

			return {
					success: productInputs.length > 0,
					message:
							productInputs.length > 0
									? 'data converted successfully'
									: 'No data converted',
					variantOnly: false,
					jsonData: productInputs,
			};
	};

	public async createProducts(
			store: Store,
			collection_id: string,
			sales_channel_id: string,
			baseImageUrl: string,
			productInputs: csvProductData[]
	): Promise<{
			success: boolean;
			message: string;
			products?: Product[];
	}> {
			const convertCreateCsvDataOutput: {
					success: boolean;
					message: string;
					jsonData?: CreateProductInput[];
			} = await convertCreateCsvData(
					store,
					collection_id,
					sales_channel_id,
					baseImageUrl,
					productInputs
			);
			// console.log('convertCsvDataOutput: ' + JSON.stringify(convertCreateCsvDataOutput));

			if (!convertCreateCsvDataOutput.success) {
					return {
							success: false,
							message: convertCreateCsvDataOutput.message,
					};
			}

			const products: Product[] = await this.productService_.bulkImportProducts(
					store.id,
					convertCreateCsvDataOutput.jsonData
			);

			if (products.length === 0) {
					return {
							success: false,
							message: 'No products were imported',
					};
			}

			return {
					success: true,
					message: 'Products imported successfully',
					products: products,
			};
	};

	public async updateProducts(
			store: Store,
			collection_id: string,
			sales_channel_id: string,
			baseImageUrl: string,
			productInputs: csvProductData[]
	): Promise<{
			success: boolean;
			message: string;
			products?: Product[];
	}> {
			// console.log('POSTCheck5.1');

			const convertUpdateCsvDataOutput: {
					success: boolean;
					message: string;
					jsonData?: (UpdateProductInput | UpdateProductProductVariantDTO)[];
			} = await convertUpdateCsvData(
					store,
					collection_id,
					sales_channel_id,
					baseImageUrl,
					productInputs
			);
			// console.log('convertCsvDataOutput: ' + JSON.stringify(convertUpdateCsvDataOutput));

			// console.log('POSTCheck5.2');

			if (!convertUpdateCsvDataOutput.success) {
					return {
							success: false,
							message: convertUpdateCsvDataOutput.message,
					};
			}

			const products: Product[] = await this.productService_.bulkUpdateProducts(
					store.id,
					convertUpdateCsvDataOutput.jsonData as UpdateProductInput[]
			);

			if (products.length === 0) {
					return {
							success: false,
							message: 'No products were updated',
					};
			}

			// console.log('POSTCheck5.3');

			return {
					success: true,
					message: 'Products updated successfully',
					products: products,
			};
	};
}

export default ProductCsvService;