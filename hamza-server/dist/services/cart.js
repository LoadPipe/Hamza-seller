"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const awilix_1 = require("awilix");
const price_conversion_1 = require("../utils/price-conversion");
const logger_1 = require("../utils/logging/logger");
const typeorm_1 = require("typeorm");
class CartService extends medusa_1.CartService {
    constructor(container) {
        super(container);
        this.customerRepository_ = container.customerRepository;
        this.lineItemRepository_ = container.lineItemRepository;
        this.shippingOptionRepository_ = container.shippingOptionRepository;
        this.cartEmailRepository_ = container.cartEmailRepository;
        this.logger = (0, logger_1.createLogger)(container, 'CartService');
        this.priceConverter = new price_conversion_1.PriceConverter(this.logger, container.cachedExchangeRateRepository);
    }
    async retrieve(cartId, options, totalsConfig, saveLineItems = false) {
        var _a, _b, _c;
        //add items & variant prices, and store (for default currency)
        if (options === null || options === void 0 ? void 0 : options.relations) {
            if (!options.relations.includes('items.variant.prices'))
                options.relations.push('items.variant.prices');
            if (!options.relations.includes('items.variant.product.store'))
                options.relations.push('items.variant.product.store');
        }
        else {
            if (!options)
                options = {};
            options.relations = [
                'items.variant.prices',
                'items.variant.product.store',
            ];
        }
        const cart = await super.retrieve(cartId, options, totalsConfig);
        //handle items - mainly currency conversion
        if (cart === null || cart === void 0 ? void 0 : cart.items) {
            //get customer preferred currency
            let userPreferredCurrency = 'usdc';
            if (cart.customer_id) {
                if (cart.customer_id && !cart.customer)
                    cart.customer = await this.customerRepository_.findOne({
                        where: { id: cart.customer_id },
                    });
                userPreferredCurrency =
                    (_b = (_a = cart.customer) === null || _a === void 0 ? void 0 : _a.preferred_currency_id) !== null && _b !== void 0 ? _b : userPreferredCurrency;
            }
            //adjust price for each line item, convert if necessary
            const itemsToSave = [];
            for (let item of cart.items) {
                //detect if currency has changed in line item
                let storeCurrency = (_c = item.variant.product.store) === null || _c === void 0 ? void 0 : _c.default_currency_code;
                const originalCurrency = item.currency_code;
                let originalPrice = item.unit_price;
                item.currency_code = storeCurrency;
                //now detect if price has changed
                let newPrice = item.variant.prices.find((p) => p.currency_code === storeCurrency).amount;
                item.unit_price = newPrice;
                if (storeCurrency != userPreferredCurrency) {
                    newPrice = await this.priceConverter.getPrice({
                        baseAmount: item.unit_price,
                        baseCurrency: storeCurrency,
                        toCurrency: userPreferredCurrency,
                    });
                }
                item.unit_price = newPrice;
                item.currency_code = userPreferredCurrency;
                //if EITHER currency OR price has changed, the item will beupdated
                const priceChanged = originalPrice != item.unit_price;
                const currencyChanged = originalCurrency != item.currency_code;
                if (priceChanged || currencyChanged) {
                    const reason = priceChanged
                        ? currencyChanged
                            ? 'Price and currency have both changed'
                            : 'Price has changed'
                        : 'Currency has changed';
                    this.logger.info(`cart item with currency ${originalCurrency} price ${originalPrice} changing to ${item.currency_code} ${item.unit_price}`);
                    this.logger.debug(`${reason}, updating line item in cart ${cart.id}`);
                    itemsToSave.push(item);
                }
            }
            //if any items to update, update them asynchronously
            try {
                if (saveLineItems && (itemsToSave === null || itemsToSave === void 0 ? void 0 : itemsToSave.length)) {
                    await this.lineItemRepository_.save(itemsToSave);
                }
            }
            catch (error) {
                this.logger.error(`Line items save has errored for cart ${cart.id}`, error);
            }
        }
        //get cart email
        const cartEmail = await this.cartEmailRepository_.findOne({
            where: { id: cartId },
        });
        if (cartEmail)
            cart.email = cartEmail.email_address;
        return cart;
    }
    async recover(customerId, cartId) {
        //get last cart
        const carts = await this.cartRepository_.find({
            where: {
                customer_id: customerId
            },
            order: { updated_at: 'DESC' },
            take: 1,
        });
        let previousCart = (carts === null || carts === void 0 ? void 0 : carts.length) ? carts[0] : null;
        //don't consider previous cart if completed or deleted
        if (previousCart) {
            if (previousCart.deleted_at || previousCart.completed_at)
                previousCart = null;
        }
        //is there also a non-logged-in cart from cookies? 
        let anonCart = null;
        if ((cartId === null || cartId === void 0 ? void 0 : cartId.length) && cartId != (previousCart === null || previousCart === void 0 ? void 0 : previousCart.id)) {
            anonCart = await this.cartRepository_.findOne({
                where: {
                    id: cartId,
                    completed_at: (0, typeorm_1.IsNull)(),
                    deleted_at: (0, typeorm_1.IsNull)()
                }
            });
        }
        //if only anon cart, use that 
        let cart = null;
        if (!previousCart && anonCart) {
            cart = anonCart;
        }
        else {
            //use previous user cart by default
            cart = previousCart;
            //and if there's an anon cart too, merge it in
            if (anonCart) {
                //merge carts
                cart = await this.mergeCarts(previousCart, anonCart);
            }
            return cart;
        }
    }
    async addDefaultShippingMethod(cartId, force = false) {
        const cart = await super.retrieve(cartId, {
            relations: ['shipping_methods'],
        });
        if (cart && (force || cart.shipping_methods.length === 0)) {
            this.logger.debug(`Auto-adding shipping method for cart ${cart.id}`);
            const option = await this.shippingOptionRepository_.findOne({
                where: { provider_id: 'bucky-fulfillment' },
            });
            await this.addShippingMethod(cart.id, option.id);
        }
    }
    async addOrUpdateLineItems(cartId, lineItems, config) {
        var _a;
        const cart = await this.retrieve(cartId, {
            relations: ['customer', 'customer.walletAddresses'],
        });
        //get preferred currency from customer
        const preferredCurrency = (_a = cart === null || cart === void 0 ? void 0 : cart.customer) === null || _a === void 0 ? void 0 : _a.preferred_currency_id;
        //if not an array, make it one
        if (!Array.isArray(lineItems)) {
            lineItems = [lineItems];
        }
        //get all currencies
        const promises = [];
        for (let n = 0; n < lineItems.length; n++) {
            promises.push(this.getCurrencyForLineItem(lineItems[n], preferredCurrency));
        }
        //assign currency results
        const results = await Promise.all(promises);
        for (let n = 0; n < lineItems.length; n++) {
            lineItems[n].currency_code = results[n];
        }
        try {
            //call super
            await super.addOrUpdateLineItems(cartId, lineItems.length === 1 ? lineItems[0] : lineItems, config);
        }
        catch (error) {
            this.logger.error(`Error adding ${lineItems.length} line items to cart ${cartId}`, error);
        }
    }
    async getCurrencyForLineItem(lineItem, preferredCurrency) {
        var _a;
        const variant = await this.productVariantService_.retrieve(lineItem.variant_id, { relations: ['prices'] });
        //find the preferred currency price, or default
        let price = null;
        price = variant.prices.find((p) => p.currency_code === (preferredCurrency !== null && preferredCurrency !== void 0 ? preferredCurrency : 'usdc'));
        //if no preferred, return the first
        return (_a = price === null || price === void 0 ? void 0 : price.currency_code) !== null && _a !== void 0 ? _a : 'usdc';
    }
    async mergeCarts(cart1, cart2) {
        try {
            //make sure both carts contain items 
            if (!(cart2 === null || cart2 === void 0 ? void 0 : cart2.items)) {
                cart2 = await this.cartRepository_.findOne({ where: { id: cart2.id }, relations: ['items'] });
            }
            if (cart2 === null || cart2 === void 0 ? void 0 : cart2.items.length) {
                if (!cart1.items) {
                    cart1 = await this.cartRepository_.findOne({ where: { id: cart1.id }, relations: ['items'] });
                }
                //move cart 2's line items to cart 1
                await this.addOrUpdateLineItems(cart1.id, cart2.items, { validateSalesChannels: false });
            }
        }
        catch (e) {
            this.logger.error('Error merging carts', e);
        }
        return cart1;
    }
}
CartService.LIFE_TIME = awilix_1.Lifetime.SINGLETON; // default, but just to show how to change it
exports.default = CartService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9jYXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBTTBCO0FBRzFCLG1DQUFrQztBQUNsQyxnRUFBMkQ7QUFFM0Qsb0RBQWdFO0FBR2hFLHFDQUFzQztBQUV0QyxNQUFxQixXQUFZLFNBQVEsb0JBQWlCO0lBVXRELFlBQVksU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQztRQUN4RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDO1FBQ3hELElBQUksQ0FBQyx5QkFBeUIsR0FBRyxTQUFTLENBQUMsd0JBQXdCLENBQUM7UUFDcEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQztRQUMxRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGlDQUFjLENBQ3BDLElBQUksQ0FBQyxNQUFNLEVBQ1gsU0FBUyxDQUFDLDRCQUE0QixDQUN6QyxDQUFDO0lBQ04sQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQ1YsTUFBYyxFQUNkLE9BQTBCLEVBQzFCLFlBQXdDLEVBQ3hDLGdCQUF5QixLQUFLOztRQUU5Qiw4REFBOEQ7UUFDOUQsSUFBSSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsU0FBUyxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDO2dCQUNuRCxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMs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