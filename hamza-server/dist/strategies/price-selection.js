"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const price_conversion_1 = require("../utils/price-conversion");
const seamless_cache_1 = require("../utils/cache/seamless-cache");
class PriceSelectionStrategy extends medusa_1.AbstractPriceSelectionStrategy {
    constructor({ customerService, productVariantRepository, logger, cachedExchangeRateRepository, }) {
        super(arguments[0]);
        this.customerService_ = customerService;
        this.productVariantRepository_ = productVariantRepository;
        this.logger = logger;
        this.cachedExchangeRateRepository = cachedExchangeRateRepository;
    }
    async calculateVariantPrice(data, context) {
        //if we have a customer, then we will check for preferred currency
        //const preferredCurrency: string =
        //    await this.getCustomerPreferredCurrency(context.customer_id);
        //get all relevant variants, including preferred currency (if any)
        return await this.getPricesForVariants(data.map((d) => d.variantId) //variant ids
        //preferredCurrency ?? 'usdc'
        );
    }
    /**
     * Gets the given customer's preferred currency code, if the customer id is non-null
     * and valid, and if that customer exists and has a preferred currency. Otherwise null
     * or empty.
     *
     * @param customerId Unique customer id
     * @returns A currency code (string)
     */
    async getCustomerPreferredCurrency(customerId = null) {
        if (customerId) {
            const customer = await this.customerService_.retrieve(customerId);
            return customer === null || customer === void 0 ? void 0 : customer.preferred_currency_id;
        }
        return 'usdc';
    }
    /**
     * If no preferredCurrencyId is not passed in, all found prices for all given variants
     * will be returned. If preferredCurrencyId is passed, only prices with that currency
     * will be returned. Unless that results in 0 prices, in which case again, all prices
     * will be returned instead by default.
     *
     * @param variantIds Array of product variant unique ids
     * @param preferredCurrencyId Optional; a currency code by which to filter.
     * @returns Map of string -> PriceSelectionResult, where the key is the variant id.
     */
    async getPricesForVariants(variantIds, preferredCurrencyId = null) {
        var _a, _b, _c;
        const output = new Map();
        const priceConverter = new price_conversion_1.PriceConverter(this.logger, this.cachedExchangeRateRepository);
        //get the variant objects
        const variants = await variantPriceCache.retrieve({
            ids: variantIds,
            productVariantRepository: this.productVariantRepository_,
        });
        //get the store
        const store = variants[0].product.store;
        //if no preferred currency, just return all prices
        for (const v of variants) {
            let prices = v.prices;
            //convert all currency prices according to base price
            const baseCurrency = store === null || store === void 0 ? void 0 : store.default_currency_code;
            const baseAmount = (_a = prices.find((p) => p.currency_code === baseCurrency)) === null || _a === void 0 ? void 0 : _a.amount;
            if (baseAmount && baseCurrency) {
                for (let n = 0; n < prices.length; n++) {
                    prices[n].amount = await priceConverter.getPrice({
                        baseAmount,
                        baseCurrency,
                        toCurrency: prices[n].currency_code,
                    });
                }
            }
            //if preferred currency, filter out the non-matchers
            /*if (preferredCurrencyId) {
                prices = prices.filter(
                    (p) => p.currency_code == preferredCurrencyId
                );

                //if no matchers, then just return all
                if (!prices.length) prices = v.prices;
            }*/
            if (!prices.length)
                throw new Error('Prices.length is zero');
            //gather and return the output
            const price = prices.find((p) => p.currency_code === store.default_currency_code);
            output.set(v.id, {
                originalPrice: (_b = price === null || price === void 0 ? void 0 : price.amount) !== null && _b !== void 0 ? _b : 0,
                calculatedPrice: (_c = price === null || price === void 0 ? void 0 : price.amount) !== null && _c !== void 0 ? _c : 0,
                originalPriceIncludesTax: false,
                prices: prices,
            });
        }
        return output;
    }
}
exports.default = PriceSelectionStrategy;
class VariantPriceCache extends seamless_cache_1.SeamlessCache {
    constructor() {
        var _a;
        super(parseInt((_a = process.env.VARIANT_PRICE_CACHE_EXPIRATION_SECONDS) !== null && _a !== void 0 ? _a : '300'));
    }
    async retrieve(params) {
        let variants = await super.retrieve(params);
        //choose a way of filtering that best fits the array lengths
        if (variants && params.ids) {
            if (variants.length > params.ids.length) {
                //if short id list, this might be faster
                const outputVariants = [];
                for (let id of params.ids) {
                    const variant = variants.find((v) => v.id === id);
                    if (variant)
                        outputVariants.push(variant);
                }
                variants = outputVariants;
            }
            else {
                //if short variants list, this might be better
                variants = variants.filter((v) => params.ids.includes(v.id));
            }
        }
        return variants;
    }
    async getData(params) {
        return await params.productVariantRepository.find({
            relations: ['product', 'prices', 'product.store'],
        });
    }
}
// GLOBAL CACHES
const variantPriceCache = new VariantPriceCache();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2Utc2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvcHJpY2Utc2VsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBTzBCO0FBSzFCLGdFQUEyRDtBQUMzRCxrRUFBOEQ7QUFROUQsTUFBcUIsc0JBQXVCLFNBQVEsdUNBQThCO0lBTTlFLFlBQVksRUFDUixlQUFlLEVBQ2Ysd0JBQXdCLEVBQ3hCLE1BQU0sRUFDTiw0QkFBNEIsR0FHL0I7UUFDRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztRQUN4QyxJQUFJLENBQUMseUJBQXlCLEdBQUcsd0JBQXdCLENBQUM7UUFDMUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLDRCQUE0QixHQUFHLDRCQUE0QixDQUFDO0lBQ3JFLENBQUM7SUFFRCxLQUFLLENBQUMscUJBQXFCLENBQ3ZCLElBR0csRUFDSCxPQUE4QjtRQUU5QixrRUFBa0U7UUFDbEUsbUNBQW1DO1FBQ25DLG1FQUFtRTtRQUVuRSxrRUFBa0U7UUFDbEUsT0FBTyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWE7UUFDMUMsNkJBQTZCO1NBQ2hDLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNLLEtBQUssQ0FBQyw0QkFBNEIsQ0FDdEMsYUFBcUIsSUFBSTtRQUV6QixJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQ2IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xFLE9BQU8sUUFBUSxhQUFSLFFBQVEs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