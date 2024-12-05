"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_checkout_1 = require("./basic-checkout");
const rest_client_1 = require("../../massmarket-client/rest-client");
const typeorm_1 = require("typeorm");
const currency_config_1 = require("../../currency.config");
//TODO: this should actually be a global util
function stringToHex(input) {
    const hexString = input.startsWith('0x') ? input.substring(2) : input;
    return `0x${hexString}`;
}
/**
 * Does massmarket checkout; extends BasicCheckout and adds some stuff of its own that is
 * specific to Massmarket.
 */
class MassMarketCheckoutProcessor extends basic_checkout_1.BasicCheckoutProcessor {
    constructor(container) {
        super(container);
    }
    async doMassMarketCheckouts(storeGroups, orders) {
        var _a, _b, _c;
        this.logger.debug(`prepping ${orders.length} orders for checkout`);
        try {
            //prepare each order for checkout
            for (let n = 0; n < orders.length; n++) {
                const order = orders[n];
                let lineItems = storeGroups[n].items;
                //TODO: is this necessary?
                lineItems = await this.lineItemRepository.find({
                    where: { id: (0, typeorm_1.In)(lineItems.map((i) => i.id)) },
                    relations: ['variant.product', 'order'],
                });
                //TODO: is this necessary?
                orders = await this.orderRepository.find({
                    where: { id: (0, typeorm_1.In)(orders.map((o) => o.id)) },
                    relations: ['store'],
                });
            }
        }
        catch (e) {
            this.logger.error(`Error ${e}`);
        }
        this.logger.debug('prepped orders for checkout');
        //call checkout for each store
        const client = new rest_client_1.MassMarketClient();
        const output = [];
        for (let n = 0; n < storeGroups.length; n++) {
            const group = storeGroups[n];
            //create the input for checkout, for each store group
            const checkoutInputs = [];
            for (const item of group.items) {
                const prod = item.variant.product;
                if ((_a = prod.massmarket_prod_id) === null || _a === void 0 ? void 0 : _a.length) {
                    checkoutInputs.push({
                        productId: prod.massmarket_prod_id,
                        quantity: item.quantity,
                    });
                }
            }
            //get payment currency address
            let currencyAddress = (0, currency_config_1.getCurrencyAddress)(group.currency_code, 11155111);
            if (currencyAddress) {
                if (currencyAddress === '0x0' || currencyAddress === '')
                    currencyAddress = undefined;
            }
            //massmarket checkout for a store group
            const checkout = await client.checkout(stringToHex((_b = group.store) === null || _b === void 0 ? void 0 : _b.massmarket_store_id), stringToHex((_c = group.store) === null || _c === void 0 ? void 0 : _c.massmarket_keycard), currencyAddress, checkoutInputs);
            this.logger.debug('got checkout results:' + JSON.stringify(checkout));
            this.logger.debug(orders.length);
            //save the output
            output.push({
                ...checkout,
                medusaOrderId: orders[n].id,
            });
        }
        return output;
    }
    async updateOrderForMassMarket(checkoutResults) {
        const promises = [];
        for (const r of checkoutResults) {
            this.logger.debug('saving order ' + r.paymentId + ', ' + r.medusaOrderId);
            promises.push(this.orderRepository.save({
                id: r.medusaOrderId,
                massmarket_order_id: r.orderHash,
                massmarket_ttl: r.ttl,
                massmarket_amount: r.amount,
            }));
        }
        this.logger.debug('saving the orders from checkout...');
        await Promise.all(promises);
        this.logger.debug('...saved the orders from checkout');
    }
    async doCheckoutSteps() {
        super.doCheckoutSteps();
        //save/update payments with order ids
        await this.updatePaymentFromOrder(this.payments, this.orders);
        //send checkout to massmarket stores
        //TODO: be able to handle one store checkout failure, while the other succeed
        const checkoutResults = await this.doMassMarketCheckouts(this.paymentGroups, this.orders);
        this.logger.debug(`Got checkout results ${JSON.stringify(checkoutResults)}`);
        //update the order with massmarket-specific stuff
        await this.updateOrderForMassMarket(checkoutResults);
    }
}
exports.default = MassMarketCheckoutProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzc21hcmtldC1jaGVja291dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHJhdGVnaWVzL2NoZWNrb3V0LXByb2Nlc3NvcnMvbWFzc21hcmtldC1jaGVja291dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUE2RTtBQUc3RSxxRUFHNkM7QUFDN0MscUNBQTZCO0FBQzdCLDJEQUEyRDtBQUkzRCw2Q0FBNkM7QUFDN0MsU0FBUyxXQUFXLENBQUMsS0FBYTtJQUM5QixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDdEUsT0FBTyxLQUFLLFNBQVMsRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFJRDs7O0dBR0c7QUFDSCxNQUFNLDJCQUE0QixTQUFRLHVDQUFzQjtJQUU1RCxZQUFZLFNBQVM7UUFDakIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFUyxLQUFLLENBQUMscUJBQXFCLENBQ2pDLFdBQWdDLEVBQ2hDLE1BQWU7O1FBRWYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxNQUFNLENBQUMsTUFBTSxzQkFBc0IsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQztZQUNELGlDQUFpQztZQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBRXJDLDBCQUEwQjtnQkFDMUIsU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFD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