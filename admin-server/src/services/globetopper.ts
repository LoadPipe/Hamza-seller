import {
    TransactionBaseService,
    ProductStatus,
    ProductVariant,
} from '@medusajs/medusa';
import ProductService, {
    //UpdateProductInput,
    UpdateProductProductVariantDTO,
} from '../services/product';
import { Product } from '../models/product';
import { PriceConverter } from '../utils/price-conversion';
import {
    CreateProductProductVariantInput,
    CreateProductInput as MedusaCreateProductInput,
} from '@medusajs/medusa/dist/types/product';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { createLogger, ILogger } from '../utils/logging/logger';
import { GlobetopperClient } from '../globetopper/globetopper-client';
import SmtpMailService from './smtp-mail';
import { ExternalApiLogRepository } from '../repositories/external-api-log';
import { LineItem } from '../models/line-item';

const PRODUCT_EXTERNAL_SOURCE: string = 'globetopper';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
    external_source: string;
    external_metadata?: Record<string, unknown>;
};

export default class GlobetopperService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly productService_: ProductService;
    protected readonly smtpMailService_: SmtpMailService;
    protected readonly priceConverter: PriceConverter;
    protected readonly apiClient: GlobetopperClient;
    protected readonly externalApiLogRepository_: typeof ExternalApiLogRepository;
    public static readonly EXTERNAL_SOURCE: string = PRODUCT_EXTERNAL_SOURCE;

    constructor(container) {
        super(container);
        this.productService_ = container.productService;
        this.smtpMailService_ = container.smtpMailService;
        this.externalApiLogRepository_ = container.externalApiLogRepository;
        this.logger = createLogger(container, 'GlobetopperService');
        this.priceConverter = new PriceConverter(
            this.logger,
            container.cachedExchangeRateRepository
        );
        this.apiClient = new GlobetopperClient(
            this.logger,
            this.externalApiLogRepository_
        );
    }

    /**
     * @deprecated Use import instead.
     */
    public async import_old(
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannelId: string,
        currencyCode: string = 'USD'
    ): Promise<Product[]> {
        try {
            //get products in two API calls
            const gtProducts = await this.apiClient.searchProducts(
                undefined,
                currencyCode
            );
            const gtCatalogue = await this.apiClient.getCatalog();

            const productInputs: (CreateProductInput & { store_id: string })[] =
                [];

            //sort the output
            const gtRecords = gtProducts.records.sort(
                (a, b) => (a?.operator?.id ?? 0) < (b?.operator?.id ?? 0)
            );

            const gtCat = gtCatalogue.records.sort(
                (a, b) =>
                    (a?.topup_product_id ?? 0) < (b?.topup_product_id ?? 0)
            );

            //create product inputs for each product
            for (let record of gtRecords) {
                const productDetails = gtCat.find(
                    (r) => r.topup_product_id == (record?.operator?.id ?? 0)
                );

                if (productDetails) {
                    productInputs.push(
                        await this.mapDataToInsertProductInput(
                            record,
                            productDetails,
                            ProductStatus.PUBLISHED,
                            storeId,
                            categoryId,
                            collectionId,
                            [salesChannelId]
                        )
                    );
                }
            }

            this.logger.debug(`importing ${productInputs.length} products`);

            //insert products into DB
            const products = await this.productService_.bulkImportProducts(
                storeId,
                productInputs
            );

            return products;
        } catch (e: any) {
            this.logger.error('Error importing GlobeTopper products', e);
        }

        return [];
    }

    public async import(
        storeId: string,
        behavior: string,
        categoryId: string,
        collectionId: string,
        salesChannelId: string,
        currencyCode: string = 'USD'
    ): Promise<Product[]> {
        return [];
    }

    public async processPointOfSale(
        orderId: string,
        firstName: string,
        lastName: string,
        email: string,
        items: LineItem[]
    ): Promise<any[]> {
        const promises: Promise<any>[] = [];

        this.logger.info(
            `Processing gift cards point of sale for ${orderId} with items ${items?.length}`
        );

        //make a list of promises
        for (let n = 0; n < items.length; n++) {
            const quantity = items[n].quantity ?? 1;
            const variant = items[n].variant;
            const gtOrderId = items[n].external_order_id;

            //account for quantity of each
            for (let i = 0; i < quantity; i++) {
                /*
                There is a decision to be made here: if there are 3 $5 XYZ cards, 
                should we make it just 1 $15 one? I'm going to go with a no for now, 
                but we can come back to this. 
                (If they truly are gifts, buyer might intend 3 different ones for 3 different people)

                We could get more granular but then we'd specialize in gift cards. Maybe better to see 
                how well they sell first
                */
                promises.push(
                    this.purchaseItem(
                        gtOrderId,
                        firstName,
                        lastName,
                        email,
                        variant
                    )
                );
            }
        }

        //here you have an array of outputs, 1 for each variant
        const purchaseOutputs = promises.length
            ? await Promise.all(promises)
            : [];

        // send email(s)
        // handle balance - notify site admin if balance is below threshold
        // update order

        /*
        EXAMPLE OF data.records[n]: 
        ---------------------------
        record 0:  {
            trans_id: 13421585,
            extra_fields: {
                'Redemption URL': 'https://spend.playground.runa.io/4fc4edf7-c78e-4e68-b415-bcfc5b0bea17',
                'Expiration Date': '2025-03-10'
            },
            meta_fields: [
                { attribute: [Object], content: '3.00' },
                { attribute: [Object], content: 'Todd-Royal' },
                { attribute: [Object], content: 'Barsoooom' },
                {
                attribute: [Object],
                content: '0x1542612fee591ed35c05a3e980bab325265c06a3@evm.blockchain'
                },
                { attribute: [Object], content: '1' },
                { attribute: [Object], content: '123456' },
                { attribute: [Object], content: null },
                { attribute: [Object], content: null }
            ],
            operator_transid: null,
            operator_card_serial: null,
            operator_card_num: null,
            operator_card_notes: null,
            source: 'API',
            remote_ip: '10.42.216.0',
            msisdn: '123456',
            operator: {
                id: 824,
                name: 'Google Play UK',
                sku: null,
                phone: '1xxxxxxxxxx',
                metadata: [],
                country: {
                iso2: 'GB',
                iso3: 'GBR',
                name: 'United Kingdom',
                dial_code: '+44-xxx-xxx-xxxx',
                currency: [Object]
                }
            },
            value: {
                BillerID: 14973,
                name: 'Google Play UK',
                description: null,
                notes: null,
                currency: { code: 'GBP', name: 'Pound Sterling' },
                display: '3.00 - 500.00 by 0.10',
                operator: {
                id: 824,
                name: 'Google Play UK',
                sku: null,
                phone: '1xxxxxxxxxx',
                metadata: [],
                country: [Object]
                },
                min: '3.00',
                max: '500.00',
                increment: '0.10',
                is_a_range: true,
                locval: 3.8305800000000003,
                type: { id: 2, name: 'Pin' },
                category: { id: 6, name: 'Gift Card', description: 'Digital Gift Cards' },
                discount: '5.00000',
                fees: [],
                request_attributes: [
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object]
                ],
                additional_details: [],
                user_display: '3.00 - 500.00 by 0.10',
                delivered_value: ''
            },
            recharge_amount: 3,
            owner_recharge_amount: '3.00',
            owner_currency: { code: 'USD', name: 'US Dollar' },
            exchange_rate: '1.2768600000',
            final_amount: 3.8305859519644523,
            final_tax: 0,
            promo_discount: 0,
            create_date: '2024-12-10 10:21:12',
            settle_date: '2024-12-10 10:21:14',
            status: 0,
            status_description: 'Success',
            payment: { id: 8, abbreviation: 'CASH', name: 'Cash' },
            country: {
                iso2: 'GB',
                iso3: 'GBR',
                name: 'United Kingdom',
                dial_code: '+44-xxx-xxx-xxxx',
                currency: { code: 'GBP', name: 'Pound Sterling' }
            },
            currency: { code: 'GBP', name: 'Pound Sterling' },
            user_id: 22803,
            commissions: [
                {
                agent_id: 22803,
                credit: '0.19153',
                debit: '0.00000',
                date: '2024-12-10 10:21:14',
                type: 'COMMISSION',
                related_id: '13421585',
                description: 'Pay Commission',
                new_balance: '1401.08875',
                owner_credit: '0.19153',
                owner_debit: '0.00000',
                owner_new_balance: '1,401.08875',
                owner_currency: [Object]
                }
            ],
            ownerFees: [],
            summary: {
                TotalFaceValue: 3,
                TotalSurcharges: 0,
                TotalFees: 0,
                TotalDiscounts: 0.19,
                TotalCustomerCostUSD: 3.64
            }
            }

        */

        // stub to build email content
        if (purchaseOutputs?.length)
            await this.sendPostPurchaseEmail(purchaseOutputs, email);

        //TODO: what to do with the outputs now?
        return purchaseOutputs ?? [];
    }

    private async purchaseItem(
        orderId: number,
        firstName: string,
        lastName: string,
        email: string,
        variant: ProductVariant
    ): Promise<any> {
        const output = await this.apiClient.purchase({
            productID: variant.product.external_id,
            amount: variant.external_metadata?.amount?.toString(),
            first_name: firstName,
            last_name: lastName,
            email,
            order_id: orderId,
        });

        if (variant?.metadata?.imgUrl) {
            output.data.thumbnail = variant.metadata.imgUrl;
        }
        return output.data;
    }

    private async sendPostPurchaseEmail(purchases: any, email: string) {
        let emailBody: string = '';

        for (const purchase of purchases) {
            const cardInfo: string[] = [];
            const record: any = purchase.records[0];

            for (const field in record.extra_fields) {
                let extraFieldContent: string = '';
                const fieldValue: string = record.extra_fields[field];

                switch (field) {
                    case 'Barcode Image URL':
                    case 'Brand Logo':
                        extraFieldContent = `<img src="${fieldValue}" />`;
                        break;
                    case 'Redemption URL':
                    case 'Barcode URL':
                    case 'Admin Barcode URL':
                        extraFieldContent = `<a href="${fieldValue}">`;
                        extraFieldContent += fieldValue;
                        extraFieldContent += '</a>';
                        break;
                    default:
                        extraFieldContent = fieldValue;
                }

                extraFieldContent = `${field}: ${extraFieldContent}`;
                cardInfo.push(extraFieldContent);
            }

            //get thumbnail image to display, if there is one
            let thumbnailImgHtml = '';
            if (purchase.thumbnail) {
                thumbnailImgHtml = `
                            <div style="margin-bottom: 1rem;">
                                <img class="item-image" 
                                src="${purchase.thumbnail}"
                                alt="gift card thumbnail"
                                />
                            </div>
                            `;
            }

            //combine all into email body
            emailBody += `${thumbnailImgHtml}<b>${purchase.records[0]?.operator?.name}</b><br/>${cardInfo.join('<br /><br />\n')}`;
            console.log(
                `Globetopper gift card email info for customer ${email}:\n${emailBody}`
            );
        }

        await this.smtpMailService_.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Gift Card Purchase from Hamza',
            templateName: 'gift-card-purchase',
            mailData: {
                body: emailBody,
            },
        });
    }

    private async mapDataToInsertProductInput(
        item: any,
        productDetail: any,
        status: ProductStatus,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannels: string[]
    ): Promise<CreateProductInput> {
        try {
            /*
        {
            "name": "Airbnb AU",
            "description": null,
            "notes": null,
            "display": [
                "100.00"
            ],
            "user_display": "100.00",
            "operator": {
                "id": 3046,
                "name": "Airbnb AU",
                "sku": null,
                "phone": "1xxxxxxxxxx",
                "metadata": [],
                "country": {
                "iso2": "AU",
                "iso3": "AUS",
                "name": "Australia",
                "dial_code": "+61-x-xxxx-xxxx",
                "currency": {
                    "code": "AUD",
                    "name": "Australian Dollar"
                }
                }
            },
            "min": "100.00",
            "max": "100.00",
            "increment": "0.00",
            "is_a_range": false,
            "locval": [67.39],
            "type": {
                "id": 2,
                "name": "Pin"
            },
            "category": {
                "id": 6,
                "name": "Gift Card",
                "description": "Digital Gift Cards"
            },
            "discount": [
                {
                "id": 22983,
                "display": "100.00",
                "discount": 0
                },
                {
                "id": "*",
                "display": "*",
                "discount": "1.95000"
                }
            ],
            "fees": [],
            "request_attributes": [
                {
                "name": "amount",
                "label": "Amount",
                "description": null,
                "required": true
                },
                {
                "name": "email",
                "label": "Email Address",
                "description": null,
                "required": true
                },
                {
                "name": "first_name",
                "label": "First Name",
                "description": null,
                "required": true
                },
                {
                "name": "last_name",
                "label": "Last Name",
                "description": null,
                "required": true
                },
                {
                "name": "notif_email",
                "label": "Notification Email",
                "description": "The email address to which a notification should be sent.",
                "required": false
                },
                {
                "name": "notif_tele",
                "label": "Notification SMS",
                "description": "The telephone number to which a notification should be sent.",
                "required": false
                },
                {
                "name": "order_id",
                "label": "Order ID",
                "description": null,
                "required": true
                },
                {
                "name": "quantity",
                "label": "Quantity",
                "description": null,
                "required": true
                }
            ],
            "additional_details": [
                {
                "id": 22983,
                "value": "100.00",
                "meta_data": []
                }
            ],
            "delivered_value": "100.000"
        };
      
      
      CATALOG: 
      {
        "id": 21,
        "topup_product_id": 1426,
        "status": "Published",
        "brand": "Amazon UAE",
        "reward_format": "Code",
        "reward_example": null,
        "card_image": "https://crm.globetopper.com/brandImages/60ede95dd5a4f.jpg",
        "usage": "Online",
        "expiration": "10 years from the date of issue",
        "brand_description": "Amazon Gift Card is the perfect way to give your loved ones exactly what they're hoping for, even if you don't know what it is. Recipients can choose from millions of items storewide. Amazon Gift Card stored value never expires, so they can buy something immediately or wait for that sale of a lifetime.\n\nAmazon Gift Card United Arab Emirates can ONLY be used on www.amazon.ae",
        "redemption_instruction": "Login into your Amazon Account.\nClick \"Apply a Gift Card to Your Account\".\nEnter your claim code and click \"Apply to Your Account\".",
        "brand_disclaimer": null,
        "term_and_conditions": "https://www.amazon.ae/gp/help/customer/display.html?nodeId=201936990",
        "restriction_and_policies": null,
        "brand_additional_information": null,
        "dashboard_display": true,
        "currency": "Arab Emirates Dirham",
        "country": "United Arab Emirates",
        "iso2": "AE",
        "iso3": "ARE",
        "value_type": "Variable",
        "denomination": "50.00 - 1,000.00 by 0.00"
        }
      */

            const externalId = item?.operator?.id;

            if (!externalId) throw new Error('SPU code not found');
            const variants = await this.mapVariants(item, productDetail);

            const output: CreateProductInput = this.mapProductDataToInput(
                item,
                productDetail,
                status,
                variants,
                externalId,
                storeId,
                categoryId,
                collectionId,
                salesChannels,
                null
            ) as CreateProductInput;
            /*
            //add variant images to the main product images
            const images = []; //TODO: get images
            const description = this.buildDescription(productDetail);
            const handle = this.buildHandle(item, externalId);

            const output = {
                title: item?.name,
                subtitle: this.getSubtitle(productDetail),
                handle,
                description,
                is_giftcard: false,
                status: status as ProductStatus,
                thumbnail: item?.picUrl ?? productDetail?.card_image,
                images,
                collection_id: collectionId,
                weight: Math.round(item?.weight ?? 100),
                discountable: true,
                store_id: storeId,
                external_id: externalId,
                external_source: PRODUCT_EXTERNAL_SOURCE,
                external_metadata: productDetail,
                categories: categoryId?.length ? [{ id: categoryId }] : [],
                sales_channels: salesChannels.map((sc) => {
                    return { id: sc };
                }),
                options: [{ title: 'Amount' }],
                variants,
            };
            */

            if (!output.variants?.length)
                throw new Error(
                    `No variants were detected for product ${externalId}`
                );

            return output;
        } catch (error) {
            this.logger.error(
                'Error mapping Globetopper data to product input',
                error
            );
            return null;
        }
    }

    private async mapDataToUpdateProductInput(
        item: any,
        productDetail: any,
        status: ProductStatus,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannels: string[],
        existingProduct: Product
    ): Promise<any> {
        try {
            const externalId = item?.operator?.id;

            if (!externalId) throw new Error('SPU code not found');
            // const updatedVariants = await this.mapVariantsForUpdate(item, productDetail, existingProduct)

            const output: any = this.mapProductDataToInput(
                item,
                productDetail,
                status,
                null,
                externalId,
                storeId,
                categoryId,
                collectionId,
                salesChannels,
                existingProduct
            ) as any;
            /*
            const images = [];
            const description = this.buildDescription(productDetail);
            const handle = this.buildHandle(item, externalId);

            const updatePayload: UpdateProductInput = {
                id: existingProduct.id,
                title: item?.name,
                subtitle: this.getSubtitle(productDetail),
                handle,
                description,
                is_giftcard: false,
                status: status as ProductStatus,
                thumbnail: item?.picUrl ?? productDetail?.card_image,
                images,
                collection_id: collectionId,
                weight: Math.round(item?.weight ?? 100),
                discountable: true,
                store_id: storeId,
                external_id: externalId,
                external_source: PRODUCT_EXTERNAL_SOURCE,
                external_metadata: productDetail,
                categories: categoryId?.length ? [{ id: categoryId }] : [],
                sales_channels: salesChannels.map((sc) => ({ id: sc })),
                // variants: updatedVariants,
            };
            */

            return output;
        } catch (error) {
            this.logger.error(
                'Error mapping Globetopper data to UpdateProductInput',
                error
            );
            return {};
        }
    }

    private async mapVariants(
        item: any,
        productDetail: any
    ): Promise<CreateProductProductVariantInput[]> {
        const variants = [];
        const variantPrices = this.getVariantPrices(item);
        variantPrices.sort((a, b) => a - b);

        for (let index = 0; index < variantPrices.length; index++) {
            const variantPrice = variantPrices[index];
            variants.push({
                title: item?.name,
                inventory_quantity: 9999,
                allow_backorder: false,
                manage_inventory: true,
                external_id: item?.operator?.id,
                external_source: PRODUCT_EXTERNAL_SOURCE,
                external_metadata: { amount: variantPrice.toFixed(2) },
                metadata: { imgUrl: productDetail?.card_image },
                prices: [
                    {
                        currency_code: 'usdc',
                        amount: Math.floor(variantPrice * 100),
                    },
                    {
                        currency_code: 'usdt',
                        amount: Math.floor(variantPrice * 100),
                    },
                    {
                        currency_code: 'eth',
                        amount: await this.priceConverter.getPrice({
                            baseAmount: Math.floor(variantPrice * 100),
                            baseCurrency: 'usdc',
                            toCurrency: 'eth',
                        }),
                    },
                ],
                options: [{ value: variantPrice.toFixed(2) }],
                variant_rank: index,
            });
        }

        return variants;
    }

    private getVariantPrices(item: any): number[] {
        const targetPrices: number[] = [
            1, 3, 5, 10, 25, 50, 100, 250, 500, 1000,
        ];
        const output: number[] = [];

        const findClosest = (
            target: number,
            lastNumber: number,
            increment: number
        ) => {
            let current = lastNumber;
            if (increment === 0) increment = 0.01;

            for (let n = lastNumber; n <= target; n += increment) {
                current = n;
            }

            return target - current <= current + increment - target
                ? current
                : current + increment;
        };

        const min = parseFloat(item.min);
        const max = parseFloat(item.max);
        const increment = parseFloat(item.increment);
        for (let n = 0; n < targetPrices.length; n++) {
            const price: number = targetPrices[n];
            if (price < min) {
                if (!output.find((i) => i === min)) {
                    output.push(min);
                }
            }

            const next: any = findClosest(
                price,
                output[output.length - 1],
                increment
            );
            if (!output.find((i) => i === next) && next <= max) {
                output.push(parseFloat(next.toFixed(2)));
            }

            if (price > max) {
                if (!output.find((i) => i === max)) output.push(max);
                break;
            }
        }

        return output;
    }

    private async mapVariantsForUpdate(
        item: any,
        productDetail: any,
        existingProduct: Product
    ): Promise<UpdateProductProductVariantDTO[]> {
        const variantPrices = this.getVariantPrices(item);
        variantPrices.sort((a, b) => a - b);

        const minPrice: number = parseFloat(item.min);
        const maxPrice: number = parseFloat(item.max);

        const updatedVariants: UpdateProductProductVariantDTO[] = [];
        const existingVariants = existingProduct.variants || [];

        let variantRank = 0;
        for (const variantPrice of variantPrices) {
            const isWithinRange =
                variantPrice >= minPrice && variantPrice <= maxPrice;
            if (!isWithinRange) {
                const variantToDelete = existingVariants.find(
                    (ev) =>
                        ev.external_metadata?.amount === variantPrice.toFixed(2)
                );
                if (variantToDelete) {
                    this.logger.info(
                        `Variant with price ${variantPrice} does not meet allowed rules; variant ${variantToDelete.id} will be deleted.`
                    );
                }
                continue;
            }

            const existingVariant = existingVariants.find(
                (ev) => ev.external_metadata?.amount === variantPrice.toFixed(2)
            );

            const updatedVariant: UpdateProductProductVariantDTO = {
                id: existingVariant?.id,
                title: item?.name,
                inventory_quantity: existingVariant?.inventory_quantity ?? 9999,
                allow_backorder: false,
                manage_inventory: true,
                // product_id: existingProduct.id,
                // external_id: item?.operator?.id,
                // external_source: PRODUCT_EXTERNAL_SOURCE,
                // external_metadata: { amount: variantPrice.toFixed(2) },
                metadata: {
                    ...existingVariant?.metadata,
                    imgUrl: productDetail?.card_image,
                },
                prices: [
                    {
                        currency_code: 'usdc',
                        amount: Math.floor(variantPrice * 100),
                    },
                    {
                        currency_code: 'usdt',
                        amount: Math.floor(variantPrice * 100),
                    },
                    {
                        currency_code: 'eth',
                        amount: await this.priceConverter.getPrice({
                            baseAmount: Math.floor(variantPrice * 100),
                            baseCurrency: 'usdc',
                            toCurrency: 'eth',
                        }),
                    },
                ],
                options: [
                    {
                        value: variantPrice.toFixed(2),
                        option_id:
                            existingProduct?.options?.[0]?.id ?? 'option_id',
                    },
                ],
            };

            updatedVariants.push(updatedVariant);
            variantRank++;
        }
        return updatedVariants;
    }

    private buildDescription(productDetail: any): string {
        const formatSection = (title: string, content: string): string => {
            if (content && content.trim() !== '') {
                return `<h2>${title}</h2><p>${content}</p>`;
            }
            return '';
        };

        let description = '';
        description += formatSection(
            'Brand Description: ',
            productDetail.brand_description
        );
        description += formatSection(
            'Redemption Instructions: ',
            productDetail.redemption_instruction
        );
        description += formatSection(
            'Disclaimer: ',
            productDetail.brand_disclaimer
        );
        description += formatSection(
            'Terms & Conditions: ',
            productDetail.term_and_conditions
        );
        description += formatSection(
            'Restriction & Policies: ',
            productDetail.restriction_and_policies
        );
        description += formatSection(
            'Additional Information: ',
            productDetail.brand_additional_information
        );

        return description;
    }

    private buildHandle(item: any, externalId: string): string {
        let handle = item?.name
            ?.trim()
            ?.toLowerCase()
            ?.replace(/[^a-zA-Z0-9 ]/g, '')
            ?.replaceAll(' ', '-');
        handle = `gc-${handle}-${externalId}`;
        return item;
    }

    private getSubtitle(productDetail: any): string {
        return productDetail.brand_description;
    }

    private mapProductDataToInput(
        item: any,
        productDetail: any,
        status: ProductStatus,
        variants: any,
        externalId: string,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannels: string[],
        existingProduct: Product
    ): any {
        const images = []; //TODO: get images
        const description = this.buildDescription(productDetail);
        const handle = this.buildHandle(item, externalId);

        const output: any = {
            id: existingProduct?.id,
            title: item?.name,
            subtitle: this.getSubtitle(productDetail),
            handle,
            description,
            is_giftcard: false,
            status: status as ProductStatus,
            thumbnail: item?.picUrl ?? productDetail?.card_image,
            images,
            collection_id: collectionId,
            weight: Math.round(item?.weight ?? 100),
            discountable: true,
            store_id: storeId,
            external_id: externalId,
            external_source: PRODUCT_EXTERNAL_SOURCE,
            external_metadata: productDetail,
            categories: categoryId?.length ? [{ id: categoryId }] : [],
            sales_channels: salesChannels.map((sc) => {
                return { id: sc };
            }),
            options: [{ title: 'Amount' }],
        };

        if (variants) output.variants = variants;
        return output;
    }
}
