"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const medusa_1 = require("@medusajs/medusa");
const medusa_core_utils_1 = require("medusa-core-utils");
class NotificationDataService extends medusa_1.TransactionBaseService {
    constructor({ cartService, claimService, fulfillmentService, fulfillmentProviderService, giftCardService, lineItemService, orderService, productVariantService, returnService, storeService, swapService, totalsService, userService, }) {
        super(arguments[0]);
        this.cartService_ = cartService;
        this.claimService_ = claimService;
        this.fulfillmentService_ = fulfillmentService;
        this.fulfillmentProviderService_ = fulfillmentProviderService;
        this.giftCardService_ = giftCardService;
        this.lineItemService_ = lineItemService;
        this.orderService_ = orderService;
        this.productVariantService_ = productVariantService;
        this.returnService_ = returnService;
        this.storeService_ = storeService;
        this.swapService_ = swapService;
        (this.totalsService_ = totalsService),
            (this.userService_ = userService);
    }
    async fetchData(event, data, attachmentGenerator) {
        const noun = event.split('.')[0];
        switch (noun) {
            case 'batch':
                return await this.getBatchData(event, data, attachmentGenerator);
            case 'claim':
                return await this.getClaimData(event, data, attachmentGenerator);
            case 'customer':
                return this.getCustomerData(event, data, attachmentGenerator);
            case 'gift_card':
                return await this.getGiftCardData(event, data, attachmentGenerator);
            case 'invite':
                return this.getInviteData(event, data, attachmentGenerator);
            case 'order':
                return await this.getOrderData(event, data, attachmentGenerator);
            case 'restock-notification':
                return await this.getRestockNotificationData(event, data, attachmentGenerator);
            case 'swap':
                return await this.getSwapData(event, data, attachmentGenerator);
            case 'user':
                return this.getUserData(event, data, attachmentGenerator);
            default:
                return {};
        }
    }
    async getBatchData(event, data, attachmentGenerator) {
        const job = await this.batchJobService_.retrieve(data.id);
        if (!job.created_by)
            return;
        const user = await this.userService_.retrieve(job.created_by);
        if (!user)
            return;
        return { ...data, ...job, email: user.email };
    }
    async getClaimData(event, data, attachmentGenerator) {
        const verb = event.split('.')[1];
        const claim = await this.claimService_.retrieve(data.id, {
            relations: ['order', 'order.items', 'order.shipping_address'],
        });
        const locale = await this.extractLocale(claim.order);
        const shipment = verb == 'shipment_created'
            ? await this.fulfillmentService_.retrieve(data.fulfillment_id, {
                relations: ['tracking_links'],
            })
            : null;
        return {
            locale,
            email: claim.order.email,
            claim,
            order: claim.order,
            fulfillment: shipment,
            tracking_links: shipment.tracking_links,
            tracking_number: shipment.tracking_numbers.join(', '),
        };
    }
    getCustomerData(event, data, attachmentGenerator) {
        return data;
    }
    async getGiftCardData(event, data, attachmentGenerator) {
        var _a, _b;
        const giftCard = await this.giftCardService_.retrieve(data.id, {
            relations: ['region', 'order'],
        });
        const taxRate = giftCard.region.tax_rate / 100;
        const locale = giftCard.order
            ? await this.extractLocale(giftCard.order)
            : null;
        const email = giftCard.order
            ? giftCard.order.email
            : giftCard.metadata.email;
        return {
            ...giftCard,
            locale,
            email,
            display_value: `${this.humanPrice_(giftCard.value * 1 + taxRate, giftCard.region.currency_code)} ${giftCard.region.currency_code}`,
            message: ((_a = giftCard.metadata) === null || _a === void 0 ? void 0 : _a.message) ||
                ((_b = giftCard.metadata) === null || _b === void 0 ? void 0 : _b.personal_message),
        };
    }
    getInviteData(event, data, attachmentGenerator) {
        return { ...data, email: data.user_email };
    }
    async getOrderData(event, data, attachmentGenerator) {
        const verb = event.split('.')[1];
        if (verb === 'refund_created') {
            const order = await this.orderService_.retrieveWithTotals(data.id, {
                select: ['total'],
                relations: ['refunds', 'items'],
            });
            const refund = order.refunds.find((refund) => refund.id === data.refund_id);
            return {
                order,
                refund,
                refund_amount: `${this.humanPrice_(refund.amount, order.currency_code)} ${order.currency_code}`,
                email: order.email,
            };
        }
        else {
            const order = await this.orderService_.retrieve(data.id, {
                select: [
                    'shipping_total',
                    'discount_total',
                    'tax_total',
                    'refunded_total',
                    'gift_card_total',
                    'subtotal',
                    'total',
                ],
                relations: [
                    'customer',
                    'billing_address',
                    'shipping_address',
                    'discounts',
                    'discounts.rule',
                    'shipping_methods',
                    'shipping_methods.shipping_option',
                    'payments',
                    'fulfillments',
                    'returns',
                    'gift_cards',
                    'gift_card_transactions',
                ],
            });
            const currencyCode = order.currency_code.toUpperCase();
            const locale = await this.extractLocale(order);
            if (verb === 'return_requested' ||
                verb === 'items_returned' ||
                verb === 'return_action_required') {
                const returnRequest = await this.returnService_.retrieve(data.return_id, {
                    relations: [
                        'items',
                        'items.item',
                        'items.item.tax_lines',
                        'items.item.variant',
                        'items.item.variant.product',
                        'shipping_method',
                        'shipping_method.tax_lines',
                        'shipping_method.shipping_option',
                    ],
                });
                const allItems = await this.lineItemService_.list({ id: returnRequest.items.map(({ item_id }) => item_id) }, { relations: ['tax_lines'] });
                // Calculate which items are in the return
                let items = await Promise.all(returnRequest.items.map(async (i) => {
                    const found = allItems.find((oi) => oi.id === i.item_id);
                    found.quantity = i.quantity;
                    found.thumbnail = this.normalizeThumbUrl_(found.thumbnail);
                    found.totals =
                        await this.totalsService_.getLineItemTotals(found, order, {
                            include_tax: true,
                            use_tax_lines: true,
                        });
                    found.price = `${this.humanPrice_(found.totals.total, currencyCode)} ${currencyCode}`;
                    found.tax_lines = found.totals.tax_lines;
                    return found;
                }));
                const item_subtotal = items.reduce((acc, next) => acc + next.totals.total, 0);
                let shippingTotal = 0;
                if (returnRequest.shipping_method) {
                    const base = returnRequest.shipping_method.price;
                    shippingTotal =
                        base +
                            returnRequest.shipping_method.tax_lines.reduce((acc, next) => {
                                return Math.round(acc + base * (next.rate / 100));
                            }, 0);
                }
                return {
                    locale,
                    has_shipping: !!returnRequest.shipping_method,
                    email: order.email,
                    items,
                    subtotal: `${this.humanPrice_(item_subtotal, currencyCode)} ${currencyCode}`,
                    shipping_total: `${this.humanPrice_(shippingTotal, currencyCode)} ${currencyCode}`,
                    refund_amount: `${this.humanPrice_(returnRequest.refund_amount, currencyCode)} ${currencyCode}`,
                    return_request: {
                        ...returnRequest,
                        refund_amount: `${this.humanPrice_(returnRequest.refund_amount, currencyCode)} ${currencyCode}`,
                    },
                    order,
                    date: returnRequest.updated_at.toDateString(),
                };
            }
            else {
                const taxRate = order.tax_rate / 100;
                let items = await Promise.all(order.items.map(async (i) => {
                    i.totals = await this.totalsService_.getLineItemTotals(i, order, {
                        include_tax: true,
                        use_tax_lines: true,
                    });
                    i.thumbnail = this.normalizeThumbUrl_(i.thumbnail);
                    i.discounted_price = `${this.humanPrice_(i.totals.total / i.quantity, currencyCode)} ${currencyCode}`;
                    i.price = `${this.humanPrice_(i.totals.original_total / i.quantity, currencyCode)} ${currencyCode}`;
                    return i;
                }));
                let discounts = [];
                if (order.discounts) {
                    discounts = order.discounts.map((discount) => {
                        return {
                            is_giftcard: false,
                            code: discount.code,
                            descriptor: `${discount.rule.value}${discount.rule.type === 'percentage'
                                ? '%'
                                : ` ${currencyCode}`}`,
                        };
                    });
                }
                let giftCards = [];
                if (order.gift_cards) {
                    giftCards = order.gift_cards.map((gc) => {
                        return {
                            is_giftcard: true,
                            code: gc.code,
                            descriptor: `${gc.value} ${currencyCode}`,
                        };
                    });
                    discounts.concat(giftCards);
                }
                return {
                    ...order,
                    locale,
                    has_discounts: order.discounts.length,
                    has_gift_cards: order.gift_cards.length,
                    date: order.created_at.toDateString(),
                    items,
                    discounts,
                    subtotal: `${this.humanPrice_(order.subtotal * (1 + taxRate), currencyCode)} ${currencyCode}`,
                    gift_card_total: `${this.humanPrice_(order.gift_card_total * (1 + taxRate), currencyCode)} ${currencyCode}`,
                    tax_total: `${this.humanPrice_(order.tax_total, currencyCode)} ${currencyCode}`,
                    discount_total: `${this.humanPrice_(order.discount_total * (1 + taxRate), currencyCode)} ${currencyCode}`,
                    shipping_total: `${this.humanPrice_(order.shipping_total * (1 + taxRate), currencyCode)} ${currencyCode}`,
                    total: `${this.humanPrice_(order.total, currencyCode)} ${currencyCode}`,
                };
            }
        }
    }
    async getRestockNotificationData(event, data, attachmentGenerator) {
        const variant = await this.productVariantService_.retrieve(data.variant_id, {
            relations: ['product'],
        });
        const thumb = variant.product.thumbnail
            ? this.normalizeThumbUrl_(variant.product.thumbnail)
            : null;
        return {
            product: {
                ...variant.product,
                thumbnail: thumb,
            },
            variant,
            variant_id: data.variant_id,
            emails: data.emails,
        };
    }
    async getSwapData(event, data, attachmentGenerator) {
        const store = await this.storeService_.retrieve();
        const swap = await this.swapService_.retrieve(data.id, {
            relations: [
                'additional_items',
                'additional_items.tax_lines',
                'return_order',
                'return_order.items',
                'return_order.items.item',
                'return_order.shipping_method',
                'return_order.shipping_method.shipping_option',
            ],
        });
        const returnRequest = swap.return_order;
        const items = await this.lineItemService_.list({
            id: returnRequest.items.map(({ item_id }) => item_id),
        }, {
            relations: ['tax_lines'],
        });
        returnRequest.items = returnRequest.items.map((item) => {
            const found = items.find((i) => i.id === item.item_id);
            return {
                ...item,
                item: found,
            };
        });
        const swapLink = store.swap_link_template.replace(/\{cart_id\}/, swap.cart_id);
        const order = await this.orderService_.retrieve(swap.order_id, {
            select: ['total'],
            relations: [
                'items',
                'items.tax_lines',
                'discounts',
                'discounts.rule',
                'shipping_address',
                'swaps',
                'swaps.additional_items',
                'swaps.additional_items.tax_lines',
            ],
        });
        const cart = await this.cartService_.retrieve(swap.cart_id, {
            select: [
                'total',
                'tax_total',
                'discount_total',
                'shipping_total',
                'subtotal',
            ],
        });
        const currencyCode = order.currency_code.toUpperCase();
        const decoratedItems = await Promise.all(cart.items.map(async (i) => {
            const totals = await this.totalsService_.getLineItemTotals(i, cart, {
                include_tax: true,
            });
            return {
                ...i,
                totals,
                tax_lines: totals.tax_lines,
                price: `${this.humanPrice_(totals.original_total / i.quantity, currencyCode)} ${currencyCode}`,
                discounted_price: `${this.humanPrice_(totals.total / i.quantity, currencyCode)} ${currencyCode}`,
            };
        }));
        const returnTotal = decoratedItems.reduce((acc, next) => {
            const { total } = next.totals;
            if (next.is_return && next.variant_id) {
                return acc + -1 * total;
            }
            return acc;
        }, 0);
        const additionalTotal = decoratedItems.reduce((acc, next) => {
            const { total } = next.totals;
            if (!next.is_return) {
                return acc + total;
            }
            return acc;
        }, 0);
        const refundAmount = swap.return_order.refund_amount;
        const locale = await this.extractLocale(order);
        return {
            locale,
            swap,
            order,
            return_request: returnRequest,
            date: swap.updated_at.toDateString(),
            swap_link: swapLink,
            email: order.email,
            items: decoratedItems.filter((di) => !di.is_return),
            return_items: decoratedItems.filter((di) => di.is_return),
            return_total: `${this.humanPrice_(returnTotal, currencyCode)} ${currencyCode}`,
            refund_amount: `${this.humanPrice_(refundAmount, currencyCode)} ${currencyCode}`,
            additional_total: `${this.humanPrice_(additionalTotal, currencyCode)} ${currencyCode}`,
        };
    }
    getUserData(event, data, attachmentGenerator) {
        return data;
    }
    async fetchAttachments(event, data, attachmentGenerator) {
        switch (event) {
            case 'swap.created':
            case 'order.return_requested': {
                let attachments = [];
                const { shipping_method, shipping_data } = data.return_request;
                if (shipping_method) {
                    const provider = shipping_method.shipping_option.provider_id;
                    const lbl = await this.fulfillmentProviderService_.retrieveDocuments(provider, shipping_data, 'label');
                    attachments = attachments.concat(lbl.map((d) => ({
                        name: 'return-label',
                        base64: d.base_64,
                        type: d.type,
                    })));
                }
                if (attachmentGenerator &&
                    attachmentGenerator.createReturnInvoice) {
                    const base64 = await attachmentGenerator.createReturnInvoice(data.order, data.return_request.items);
                    attachments.push({
                        name: 'invoice',
                        base64,
                        type: 'application/pdf',
                    });
                }
                return attachments;
            }
            default:
                return [];
        }
    }
    processItems_(items, taxRate, currencyCode) {
        return items.map((i) => {
            return {
                ...i,
                thumbnail: this.normalizeThumbUrl_(i.thumbnail),
                price: `${this.humanPrice_(i.unit_price * (1 + taxRate), currencyCode)} ${currencyCode}`,
            };
        });
    }
    humanPrice_(amount, currency) {
        if (!amount) {
            return '0.00';
        }
        const normalized = (0, medusa_core_utils_1.humanizeAmount)(amount, currency);
        return normalized.toFixed(medusa_core_utils_1.zeroDecimalCurrencies.includes(currency.toLowerCase()) ? 0 : 2);
    }
    normalizeThumbUrl_(url) {
        if (!url) {
            return null;
        }
        if (url.startsWith('http')) {
            return url;
        }
        else if (url.startsWith('//')) {
            return `https:${url}`;
        }
        return url;
    }
    async extractLocale(fromOrder) {
        if (fromOrder.cart_id) {
            try {
                const cart = await this.cartService_.retrieve(fromOrder.cart_id, {
                    select: ['id', 'context'],
                });
                if (cart.context && cart.context.locale) {
                    return cart.context.locale;
                }
            }
            catch (err) {
                this.logger.error(err);
                this.logger.warn('Failed to gather context for order');
                return null;
            }
        }
        return null;
    }
}
NotificationDataService.identifier = 'notificationDataService';
NotificationDataService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = NotificationDataService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLWRhdGEtaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9ub3RpZmljYXRpb24tZGF0YS1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWtDO0FBQ2xDLDZDQUFrRTtBQUNsRSx5REFBMEU7QUFtQjFFLE1BQU0sdUJBQXdCLFNBQVEsK0JBQXNCO0lBb0J4RCxZQUFZLEVBQ1IsV0FBVyxFQUNYLFlBQVksRUFDWixrQkFBa0IsRUFDbEIsMEJBQTBCLEVBQzFCLGVBQWUsRUFDZixlQUFlLEVBQ2YsWUFBWSxFQUNaLHFCQUFxQixFQUNyQixhQUFhLEVBQ2IsWUFBWSxFQUNaLFdBQVcsRUFDWCxhQUFhLEVBQ2IsV0FBVyxHQUNkO1FBQ0csS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQztRQUM5QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsMEJBQTBCLENBQUM7UUFDOUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztRQUN4QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxxQkFBcUIsQ0FBQztRQUNwRCxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztRQUNwQyxJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO1lBQ2pDLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLG1CQUFtQjtRQUM1QyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLFFBQVEsSUFBSSxFQUFFLENBQUM7WUFDWCxLQUFLLE9BQU87Z0JBQ1IsT0FBTyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQzFCLEtBQUssRUFDTCxJQUFJLEVBQ0osbUJBQW1CLENBQ3RCLENBQUM7WUFDTixLQUFLLE9BQU87Z0JBQ1IsT0FBTyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQzFCLEtBQUssRUFDTCxJQUFJLEVBQ0osbUJBQW1CLENBQ3RCLENBQUM7WUFDTixLQUFLLFVBQVU7Z0JBQ1gsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNsRSxLQUFLLFdBQVc7Z0JBQ1osT0FBTyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQzdCLEtBQUssRUFDTCxJQUFJLEVBQ0osbUJBQW1CLENBQ3RCLENBQUM7WUFDTixLQUFLLFFBQVE7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNoRSxLQUFLLE9BQU87Z0JBQ1IsT0FBTyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQzFCLEtBQUssRUFDTCxJQUFJLEVBQ0osbUJBQW1CLENBQ3RCLENBQUM7WUFDTixLQUFLLHNCQUFzQjtnQkFDdkIsT0FBTyxNQUFNLElBQUksQ0FBQywwQkFBMEIsQ0FDeEMsS0FBSyxFQUNMLElBQUksRUFDSixtQkFBbUIsQ0FDdEIsQ0FBQztZQUNOLEtBQUssTUFBTTtnQkFDUCxPQUFPLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDcEUsS0FBSyxNQUFNO2dCQUNQLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDOUQ7Z0JBQ0ksT0FBTyxFQUFFLENBQUM7UUFDbEIsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsbUJBQW1CO1FBQy9DLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVO1lBQUUsT0FBTztRQUM1QixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFDbEIsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxtQkFBbUI7UUFDL0MsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDckQsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSx3QkFBd0IsQ0FBQztTQUNoRSxDQUFDLENBQUM7UUFDSCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JELE1BQU0sUUFBUSxHQUNWLElBQUksSUFBSSxrQkFBa0I7WUFDdEIsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUMzRCxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQzthQUNoQyxDQUFDO1lBQ0YsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNmLE9BQU87WUFDSCxNQUFNO1lBQ04sS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSztZQUN4QixLQUFLO1lBQ0wsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO1lBQ2xCLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLGNBQWMsRUFBRSxRQUFRLENBQUMsY0FBYztZQUN2QyxlQUFlLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDeEQsQ0FBQztJQUNOLENBQUM7SUFFRCxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxtQkFBbUI7UUFDNUMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxtQkFBbUI7O1FBQ2xELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQzNELFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUM7U0FDakMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQy9DLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLO1lBQ3pCLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUMxQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1gsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUs7WUFDeEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSztZQUN0QixDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDOUIsT0FBTztZQUNILEdBQUcsUUFBUTtZQUNYLE1BQU07WUFDTixLQUFLO1lBQ0wsYUFBYSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxPQUFPLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtZQUNsSSxPQUFPLEVBQ0gsQ0FBQSxNQUFBLFFBQVEsQ0FBQyxRQUFRLDBDQUFFLE9BQU87aUJBQzFCLE1BQUEsUUFBUSxDQUFDLFFBQVEsMENBQUUsZ0JBQWdCLENBQUE7U0FDMUMsQ0FBQztJQUNOLENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxtQkFBbUI7UUFDMUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxtQkFBbUI7UUFDL0MsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLElBQUksS0FBSyxnQkFBZ0IsRUFBRSxDQUFDO1lBQzVCLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO2dCQUMvRCxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pCLFNBQVMsRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7YUFDbEMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQzdCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQzNDLENBQUM7WUFDRixPQUFPO2dCQUNILEtBQUs7Z0JBQ0wsTUFBTTtnQkFDTixhQUFhLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7Z0JBQy9GLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSzthQUNyQixDQUFDO1FBQ04sQ0FBQzthQUFNLENBQUM7WUFDSixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JELE1BQU0sRUFBRTtvQkFDSixnQkFBZ0I7b0JBQ2hCLGdCQUFnQjtvQkFDaEIsV0FBVztvQkFDWCxnQkFBZ0I7b0JBQ2hCLGlCQUFpQjtvQkFDakIsVUFBVTtvQkFDVixPQUFPO2lCQUNWO2dCQUNELFNBQVMsRUFBRTtvQkFDUCxVQUFVO29CQUNWLGlCQUFpQjtvQkFDakIsa0JBQWtCO29CQUNsQixXQUFXO29CQUNYLGdCQUFnQjtvQkFDaEIsa0JBQWtCO29CQUNsQixrQ0FBa0M7b0JBQ2xDLFVBQVU7b0JBQ1YsY0FBYztvQkFDZCxTQUFTO29CQUNULFlBQVk7b0JBQ1osd0JBQXdCO2lCQUMzQjthQUNKLENBQUMsQ0FBQztZQUNILE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkQsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9DLElBQ0ksSUFBSSxLQUFLLGtCQUFrQjtnQkFDM0IsSUFBSSxLQUFLLGdCQUFnQjtnQkFDekIsSUFBSSxLQUFLLHdCQUF3QixFQUNuQyxDQUFDO2dCQUNDLE1BQU0sYUFBYSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQ3BELElBQUksQ0FBQyxTQUFTLEVBQ2Q7b0JBQ0ksU0FBUyxFQUFFO3dCQUNQLE9BQU87d0JBQ1AsWUFBWTt3QkFDWixzQkFBc0I7d0JBQ3RCLG9CQUFvQjt3QkFDcEIsNEJBQTRCO3dCQUM1QixpQkFBaUI7d0JBQ2pCLDJCQUEyQjt3QkFDM0IsaUNBQWlDO3FCQUNwQztpQkFDSixDQUNKLENBQUM7Z0JBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUM3QyxFQUFFLEVBQUUsRUFBRSxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQ3pELEVBQUUsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FDL0IsQ0FBQztnQkFDRiwwQ0FBMEM7Z0JBQzFDLElBQUksS0FBSyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDekIsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNoQyxNQUFNLEtBQUssR0FBUSxRQUFRLENBQUMsSUFBSSxDQUM1QixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUM5QixDQUFDO29CQUNGLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztvQkFDNUIsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQ3JDLEtBQUssQ0FBQyxTQUFTLENBQ2xCLENBQUM7b0JBQ0YsS0FBSyxDQUFDLE1BQU07d0JBQ1IsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUN2QyxLQUFLLEVBQ0wsS0FBSyxFQUNMOzRCQUNJLFdBQVcsRUFBRSxJQUFJOzRCQUNqQixhQUFhLEVBQUUsSUFBSTt5QkFDdEIsQ0FDSixDQUFDO29CQUNOLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUM3QixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFDbEIsWUFBWSxDQUNmLElBQUksWUFBWSxFQUFFLENBQUM7b0JBQ3BCLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7b0JBQ3pDLE9BQU8sS0FBSyxDQUFDO2dCQUNqQixDQUFDLENBQUMsQ0FDTCxDQUFDO2dCQUNGLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQzlCLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUN0QyxDQUFDLENBQ0osQ0FBQztnQkFDRixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksYUFBYSxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUNoQyxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztvQkFDakQsYUFBYTt3QkFDVCxJQUFJOzRCQUNKLGFBQWEsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDMUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0NBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUNiLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUNqQyxDQUFDOzRCQUNOLENBQUMsRUFDRCxDQUFDLENBQ0osQ0FBQztnQkFDVixDQUFDO2dCQUNELE9BQU87b0JBQ0gsTUFBTTtvQkFDTixZQUFZLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxlQUFlO29CQUM3QyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7b0JBQ2xCLEtBQUs7b0JBQ0wsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFO29CQUM1RSxjQUFjLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsSUFBSSxZQUFZLEVBQUU7b0JBQ2xGLGFBQWEsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsSUFBSSxZQUFZLEVBQUU7b0JBQy9GLGNBQWMsRUFBRTt3QkFDWixHQUFHLGFBQWE7d0JBQ2hCLGFBQWEsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsSUFBSSxZQUFZLEVBQUU7cUJBQ2xHO29CQUNELEtBQUs7b0JBQ0wsSUFBSSxFQUFFLGFBQWEsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFO2lCQUNoRCxDQUFDO1lBQ04sQ0FBQztpQkFBTSxDQUFDO2dCQUNKLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO2dCQUNyQyxJQUFJLEtBQUssR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ3pCLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFNLEVBQUUsRUFBRTtvQkFDN0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQ2xELENBQUMsRUFDRCxLQUFLLEVBQ0w7d0JBQ0ksV0FBVyxFQUFFLElBQUk7d0JBQ2pCLGFBQWEsRUFBRSxJQUFJO3FCQUN0QixDQUNKLENBQUM7b0JBQ0YsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNuRCxDQUFDLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFLENBQUM7b0JBQ3RHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFLENBQUM7b0JBQ3BHLE9BQU8sQ0FBQyxDQUFDO2dCQUNiLENBQUMsQ0FBQyxDQUNMLENBQUM7Z0JBQ0YsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUNuQixJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDbEIsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7d0JBQ3pDLE9BQU87NEJBQ0gsV0FBVyxFQUFFLEtBQUs7NEJBQ2xCLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTs0QkFDbkIsVUFBVSxFQUFFLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssWUFBWTtnQ0FDcEUsQ0FBQyxDQUFDLEdBQUc7Z0NBQ0wsQ0FBQyxDQUFDLElBQUksWUFBWSxFQUNsQixFQUFFO3lCQUNULENBQUM7b0JBQ04sQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFDRCxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7Z0JBQ25CLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUNuQixTQUFTLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTt3QkFDcEMsT0FBTzs0QkFDSCxXQUFXLEVBQUUsSUFBSTs0QkFDakIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJOzRCQUNiLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLElBQUksWUFBWSxFQUFFO3lCQUM1QyxDQUFDO29CQUNOLENBQUMsQ0FBQyxDQUFDO29CQUNILFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2hDLENBQUM7Z0JBQ0QsT0FBTztvQkFDSCxHQUFHLEtBQUs7b0JBQ1IsTUFBTTtvQkFDTixhQUFhLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO29CQUNyQyxjQUFjLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNO29CQUN2QyxJQUFJLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUU7b0JBQ3JDLEtBQUs7b0JBQ0wsU0FBUztvQkFDVCxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFO29CQUM3RixlQUFlLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFO29CQUMzRyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFO29CQUMvRSxjQUFjLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFO29CQUN6RyxjQUFjLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFO29CQUN6RyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFO2lCQUMxRSxDQUFDO1lBQ04sQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLDBCQUEwQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsbUJBQW1CO1FBQzdELE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FDdEQsSUFBSSxDQUFDLFVBQVUsRUFDZjtZQUNJLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQztTQUN6QixDQUNKLENBQUM7UUFFRixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVM7WUFDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNwRCxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRVgsT0FBTztZQUNILE9BQU8sRUFBRTtnQkFDTCxHQUFHLE9BQU8sQ0FBQyxPQUFPO2dCQUNsQixTQUFTLEVBQUUsS0FBSzthQUNuQjtZQUNELE9BQU87WUFDUCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ3RCLENBQUM7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLG1CQUFtQjtRQUM5QyxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ25ELFNBQVMsRUFBRTtnQkFDUCxrQkFBa0I7Z0JBQ2xCLDRCQUE0QjtnQkFDNUIsY0FBYztnQkFDZCxvQkFBb0I7Z0JBQ3BCLHlCQUF5QjtnQkFDekIsOEJBQThCO2dCQUM5Qiw4Q0FBOEM7YUFDakQ7U0FDSixDQUFDLENBQUM7UUFFSCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBRXhDLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FDMUM7WUFDSSxFQUFFLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDeEQsRUFDRDtZQUNJLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQztTQUMzQixDQUNKLENBQUM7UUFFRixhQUFhLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDbkQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkQsT0FBTztnQkFDSCxHQUFHLElBQUk7Z0JBQ1AsSUFBSSxFQUFFLEtBQUs7YUFDZCxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUM3QyxhQUFhLEVBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FDZixDQUFDO1FBRUYsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQzNELE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNqQixTQUFTLEVBQUU7Z0JBQ1AsT0FBTztnQkFDUCxpQkFBaUI7Z0JBQ2pCLFdBQVc7Z0JBQ1gsZ0JBQWdCO2dCQUNoQixrQkFBa0I7Z0JBQ2xCLE9BQU87Z0JBQ1Asd0JBQXdCO2dCQUN4QixrQ0FBa0M7YUFDckM7U0FDSixDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDeEQsTUFBTSxFQUFFO2dCQUNKLE9BQU87Z0JBQ1AsV0FBVztnQkFDWCxnQkFBZ0I7Z0JBQ2hCLGdCQUFnQjtnQkFDaEIsVUFBVTthQUNiO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUV2RCxNQUFNLGNBQWMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQ3RELENBQUMsRUFDRCxJQUFJLEVBQ0o7Z0JBQ0ksV0FBVyxFQUFFLElBQUk7YUFDcEIsQ0FDSixDQUFDO1lBRUYsT0FBTztnQkFDSCxHQUFHLENBQUM7Z0JBQ0osTUFBTTtnQkFDTixTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7Z0JBQzNCLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxJQUFJLFlBQVksRUFBRTtnQkFDOUYsZ0JBQWdCLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsSUFBSSxZQUFZLEVBQUU7YUFDbkcsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUNMLENBQUM7UUFFRixNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBUSxFQUFFLElBQVMsRUFBRSxFQUFFO1lBQzlELE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzlCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3BDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUM1QixDQUFDO1lBQ0QsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFTixNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBUSxFQUFFLElBQVMsRUFBRSxFQUFFO1lBQ2xFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2xCLE9BQU8sR0FBRyxHQUFHLEtBQUssQ0FBQztZQUN2QixDQUFDO1lBQ0QsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFTixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQztRQUVyRCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0MsT0FBTztZQUNILE1BQU07WUFDTixJQUFJO1lBQ0osS0FBSztZQUNMLGNBQWMsRUFBRSxhQUFhO1lBQzdCLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRTtZQUNwQyxTQUFTLEVBQUUsUUFBUTtZQUNuQixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7WUFDbEIsS0FBSyxFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNuRCxZQUFZLEVBQUUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUN6RCxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsSUFBSSxZQUFZLEVBQUU7WUFDOUUsYUFBYSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFO1lBQ2hGLGdCQUFnQixFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFO1NBQ3pGLENBQUM7SUFDTixDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsbUJBQW1CO1FBQ3hDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxtQkFBbUI7UUFDbkQsUUFBUSxLQUFLLEVBQUUsQ0FBQztZQUNaLEtBQUssY0FBYyxDQUFDO1lBQ3BCLEtBQUssd0JBQXdCLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBQ3JCLE1BQU0sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztnQkFDL0QsSUFBSSxlQUFlLEVBQUUsQ0FBQztvQkFDbEIsTUFBTSxRQUFRLEdBQ1YsZUFBZSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7b0JBRWhELE1BQU0sR0FBRyxHQUNMLE1BQU0sSUFBSSxDQUFDLDJCQUEyQixDQUFDLGlCQUFpQixDQUNwRCxRQUFRLEVBQ1IsYUFBYSxFQUNiLE9BQU8sQ0FDVixDQUFDO29CQUVOLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUM1QixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNaLElBQUksRUFBRSxjQUFjO3dCQUNwQixNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU87d0JBQ2pCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSTtxQkFDZixDQUFDLENBQUMsQ0FDTixDQUFDO2dCQUNOLENBQUM7Z0JBRUQsSUFDSSxtQkFBbUI7b0JBQ25CLG1CQUFtQixDQUFDLG1CQUFtQixFQUN6QyxDQUFDO29CQUNDLE1BQU0sTUFBTSxHQUNSLE1BQU0sbUJBQW1CLENBQUMsbUJBQW1CLENBQ3pDLElBQUksQ0FBQyxLQUFLLEVBQ1YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQzVCLENBQUM7b0JBQ04sV0FBVyxDQUFDLElBQUksQ0FBQzt3QkFDYixJQUFJLEVBQUUsU0FBUzt3QkFDZixNQUFNO3dCQUNOLElBQUksRUFBRSxpQkFBaUI7cUJBQzFCLENBQUMsQ0FBQztnQkFDUCxDQUFDO2dCQUVELE9BQU8sV0FBVyxDQUFDO1lBQ3ZCLENBQUM7WUFDRDtnQkFDSSxPQUFPLEVBQUUsQ0FBQztRQUNsQixDQUFDO0lBQ0wsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFlBQVk7UUFDdEMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDbkIsT0FBTztnQkFDSCxHQUFHLENBQUM7Z0JBQ0osU0FBUyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUMvQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsWUFBWSxDQUFDLElBQUksWUFBWSxFQUFFO2FBQzNGLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxXQUFXLENBQUMsTUFBTSxFQUFFLFFBQVE7UUFDeEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ1YsT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUVELE1BQU0sVUFBVSxHQUFHLElBQUEsa0NBQWMsRUFBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEQsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUNyQix5Q0FBcUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNqRSxDQUFDO0lBQ04sQ0FBQztJQUVELGtCQUFrQixDQUFDLEdBQUc7UUFDbEIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1AsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ3pCLE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQzthQUFNLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzlCLE9BQU8sU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUMxQixDQUFDO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTO1FBQ3pCLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQztnQkFDRCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUN6QyxTQUFTLENBQUMsT0FBTyxFQUNqQjtvQkFDSSxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO2lCQUM1QixDQUNKLENBQUM7Z0JBRUYsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ3RDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQy9CLENBQUM7WUFDTCxDQUFDO1lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQztnQkFDdkQsT0FBTyxJQUFJLENBQUM7WUFDaEIsQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOztBQW5sQk0sa0NBQVUsR0FBRyx5QkFBeUIsQ0FBQztBQUN2QyxpQ0FBUyxHQUFHLGlCQUFRLENBQUMsTUFBTSxDQUFDO0FBcWxCdkMsa0JBQWUsdUJBQXVCLENBQUMifQ==