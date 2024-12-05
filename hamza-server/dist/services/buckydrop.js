"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const price_conversion_1 = require("../utils/price-conversion");
const bucky_client_1 = require("../buckydrop/bucky-client");
const logger_1 = require("../utils/logging/logger");
const typeorm_1 = require("typeorm");
const SHIPPING_COST_MIN = parseInt((_a = process.env.BUCKY_MIN_SHIPPING_COST_US_CENT) !== null && _a !== void 0 ? _a : '1000');
const SHIPPING_COST_MAX = parseInt((_b = process.env.BUCKY_MAX_SHIPPING_COST_US_CENT) !== null && _b !== void 0 ? _b : '4000');
// TODO: I think this code needs comments its difficult to understand.
class BuckydropService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.productService_ = container.productService;
        this.cartService_ = container.cartService;
        this.orderRepository_ = container.orderRepository;
        this.orderService_ = container.orderService;
        this.customerService_ = container.customerService;
        this.logger = (0, logger_1.createLogger)(container, 'BuckydropService');
        this.priceConverter = new price_conversion_1.PriceConverter(this.logger, container.cachedExchangeRateRepository);
        this.buckyLogRepository = container.buckyLogRepository;
        this.buckyClient = new bucky_client_1.BuckyClient(this.buckyLogRepository);
    }
    async importProductsByKeyword(keyword, storeId, categoryId, collectionId, salesChannelId, count = 10, page = 1, goodsId = null) {
        //retrieve products from bucky and convert them
        const searchResults = await this.buckyClient.searchProducts(keyword, page, count);
        this.logger.debug(`search returned ${searchResults.length} results`);
        let productData = searchResults;
        if (goodsId)
            productData = productData.filter((p) => p.goodsId === goodsId);
        let productInputs = [];
        for (let p of productData) {
            productInputs.push(await this.mapBuckyDataToProductInput(this.buckyClient, p, medusa_1.ProductStatus.PUBLISHED, storeId, categoryId, collectionId, [salesChannelId]));
        }
        //filter out failures
        productInputs = productInputs.filter((p) => (p ? p : null));
        this.logger.debug(`importing ${productInputs.length} products...`);
        //import the products
        const output = (productInputs === null || productInputs === void 0 ? void 0 : productInputs.length)
            ? await this.productService_.bulkImportProducts(storeId, productInputs)
            : [];
        //TODO: best to return some type of report; what succeeded, what failed
        return output;
    }
    async importProductsByLink(goodsLink, storeId, categoryId, collectionId, salesChannelId) {
        //retrieve products from bucky and convert them
        const input = await this.mapBuckyDataToProductInput(this.buckyClient, { goodsLink }, medusa_1.ProductStatus.PUBLISHED, storeId, categoryId, collectionId, [salesChannelId]);
        //import if mapped
        return input
            ? await this.productService_.bulkImportProducts(storeId, [input])
            : [];
    }
    async calculateShippingPriceForCart(cartId) {
        var _a, _b, _c, _d;
        let output = 0;
        let currency = 'usdc';
        let gotPrice = false;
        try {
            //this subtotal is calculated to compare with the shipping cost
            let subtotal = 0;
            const cart = await this.cartService_.retrieve(cartId, {
                relations: [
                    'items.variant.product.store',
                    'items.variant.prices', //TODO: we need prices?
                    'customer',
                    'shipping_address.country',
                ],
            });
            if (!cart)
                throw new Error(`Cart with id ${cartId} not found`);
            if (!((_a = cart === null || cart === void 0 ? void 0 : cart.items) === null || _a === void 0 ? void 0 : _a.length)) {
                return 0;
            }
            //get customer if there is one
            if (!cart.customer) {
                if ((_b = cart.customer_id) === null || _b === void 0 ? void 0 : _b.length) {
                    cart.customer = await this.customerService_.retrieve(cart.customer_id);
                }
            }
            //get currency from customer, or cart if there is no customer
            currency = cart.customer
                ? cart.customer.preferred_currency_id
                : ((_d = (_c = cart === null || cart === void 0 ? void 0 : cart.items[0]) === null || _c === void 0 ? void 0 : _c.currency_code) !== null && _d !== void 0 ? _d : 'usdc');
            /*
            //calculate prices
            const input: IBuckyShippingCostRequest = {
                lang: 'en',
                countryCode: cart.shipping_address.country_code,
                country: cart.shipping_address.country.name,
                provinceCode: cart.shipping_address.province,
                province: cart.shipping_address.province,
                detailAddress:
                    `${cart.shipping_address.address_1 ?? ''} ${cart.shipping_address.address_2 ?? ''}`.trim(),
                postCode: cart.shipping_address.postal_code,
                productList: [],
            };

            //generate input for each product in cart that is bucky
            for (let item of cart.items) {
                if (item.variant.bucky_metadata?.length) {
                    const variantMetadata: any = item.variant.bucky_metadata;
                    const productMetadata: any =
                        item.variant.product.bucky_metadata;
                    input.productList.push({
                        length: variantMetadata.length ?? 100,
                        width: variantMetadata.width ?? 100,
                        height: variantMetadata.height ?? 100,
                        weight: variantMetadata.weight ?? 100,
                        categoryCode: productMetadata.detail.categoryCode,
                    });

                    subtotal += item.unit_price * item.quantity;
                }
            }

            //if (subtotal > 0) {
            /*
            const estimate =
                await this.buckyClient.getShippingCostEstimate(input);

            //convert to usd first
            if (estimate?.data?.total) {
                output = await this.priceConverter.convertPrice(
                    estimate.data.total,
                    'cny',
                    'usdc'
                );
                gotPrice = true;
            }
            */
            output = SHIPPING_COST_MAX; // subtotal;
            output = output < SHIPPING_COST_MIN ? SHIPPING_COST_MIN : output;
            output = output > SHIPPING_COST_MAX ? SHIPPING_COST_MAX : output;
            //convert to final currency
            if (currency != 'usdc')
                output = await this.priceConverter.convertPrice(output, //estimate.data.total,
                'usdc', currency);
            // }
            //if price was not yet converted, or nothing came back, do it now
            /*if (!gotPrice) {
                //this needs to be converted to USDC in order to compare
                if (output <= 0 && subtotal > 0) {
                    subtotal = await this.priceConverter.convertPrice(
                        subtotal,
                        currency,
                        'usdc'
                    );

                    //final calculated price should be
                    output = subtotal;
                    output =
                        output < SHIPPING_COST_MIN ? SHIPPING_COST_MIN : output;
                    output =
                        output > SHIPPING_COST_MAX ? SHIPPING_COST_MAX : output;
                }

                output = await this.priceConverter.convertPrice(
                    output,
                    'usdc',
                    currency
                );
            }
            */
        }
        catch (e) {
            this.logger.error(`Error calculating shipping costs in BuckydropService`, e);
            output = SHIPPING_COST_MIN;
        }
        return output;
    }
    async processPendingOrder(orderId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const order = await this.orderRepository_.findOne({
            where: { id: orderId },
        });
        if (order && (order === null || order === void 0 ? void 0 : order.cart_id) && order.bucky_metadata) {
            //get cart
            const cart = await this.cartService_.retrieve(order.cart_id, {
                relations: ['billing_address.country', 'customer'],
            });
            //get data to send to bucky
            const { variants, quantities } = await this.orderService_.getBuckyProductVariantsFromOrder(order);
            //create list of products
            const productList = [];
            for (let n = 0; n < variants.length; n++) {
                const prodMetadata = variants[n].product.bucky_metadata;
                const varMetadata = variants[n].bucky_metadata;
                productList.push({
                    spuCode: prodMetadata === null || prodMetadata === void 0 ? void 0 : prodMetadata.detail.spuCode,
                    skuCode: varMetadata.skuCode,
                    productCount: quantities[n],
                    platform: (_a = prodMetadata === null || prodMetadata === void 0 ? void 0 : prodMetadata.detail) === null || _a === void 0 ? void 0 : _a.platform,
                    productPrice: (_g = (_d = (_c = (_b = prodMetadata === null || prodMetadata === void 0 ? void 0 : prodMetadata.detail) === null || _b === void 0 ? void 0 : _b.proPrice) === null || _c === void 0 ? void 0 : _c.price) !== null && _d !== void 0 ? _d : (_f = (_e = prodMetadata === null || prodMetadata === void 0 ? void 0 : prodMetadata.detail) === null || _e === void 0 ? void 0 : _e.price) === null || _f === void 0 ? void 0 : _f.price) !== null && _g !== void 0 ? _g : 0,
                    productName: (_h = prodMetadata === null || prodMetadata === void 0 ? void 0 : prodMetadata.detail) === null || _h === void 0 ? void 0 : _h.goodsName,
                });
            }
            //create order via Bucky API
            this.logger.info(`Creating buckydrop order for ${orderId}`);
            const output = await this.buckyClient.createOrder({
                partnerOrderNo: order.id.replace('_', ''),
                //partnerOrderNoName: order.id, //TODO: what go here?
                country: (_j = cart.billing_address.country.name) !== null && _j !== void 0 ? _j : '', //TODO: what format?
                countryCode: (_k = cart.billing_address.country.iso_2) !== null && _k !== void 0 ? _k : '', //TODO: what format?
                province: (_l = cart.billing_address.province) !== null && _l !== void 0 ? _l : '',
                city: (_m = cart.billing_address.city) !== null && _m !== void 0 ? _m : '',
                detailAddress: `${(_o = cart.billing_address.address_1) !== null && _o !== void 0 ? _o : ''}{' '}${(_p = cart.billing_address.address_2) !== null && _p !== void 0 ? _p : ''}`.trim(),
                postCode: cart.billing_address.postal_code,
                contactName: `${(_q = cart.billing_address.first_name) !== null && _q !== void 0 ? _q : ''} ${(_r = cart.billing_address.last_name) !== null && _r !== void 0 ? _r : ''}`.trim(),
                contactPhone: ((_s = cart.billing_address.phone) === null || _s === void 0 ? void 0 : _s.length)
                    ? cart.billing_address.phone
                    : '0809997747',
                email: ((_t = cart.email) === null || _t === void 0 ? void 0 : _t.length) ? cart.email : cart.customer.email,
                orderRemark: '',
                productList,
            });
            this.logger.info(`Created buckydrop order for ${orderId}`);
            //save the output
            order.bucky_metadata = output;
            order.status = (output === null || output === void 0 ? void 0 : output.success)
                ? medusa_1.OrderStatus.PENDING
                : medusa_1.OrderStatus.REQUIRES_ACTION;
            await this.orderRepository_.save(order);
            this.logger.info(`Saved order ${orderId}`);
        }
        else {
            this.logger.warn(`Allegedly pending bucky drop order ${orderId} is either not found, has no cart, or has no buckydrop metadata`);
        }
        return order;
    }
    async reconcileOrderStatus(orderId) {
        var _a, _b, _c, _d;
        try {
            //get order & metadata
            let order = await this.orderService_.retrieve(orderId);
            const buckyData = order.bucky_metadata;
            if (order &&
                (((_a = buckyData === null || buckyData === void 0 ? void 0 : buckyData.data) === null || _a === void 0 ? void 0 : _a.shopOrderNo) || (buckyData === null || buckyData === void 0 ? void 0 : buckyData.shopOrderNo))) {
                //get order details from buckydrop
                const orderDetail = await this.buckyClient.getOrderDetails((_b = buckyData.data.shopOrderNo) !== null && _b !== void 0 ? _b : buckyData.shopOrderNo);
                //get the order status
                if (orderDetail) {
                    const status = (_d = (_c = orderDetail === null || orderDetail === void 0 ? void 0 : orderDetail.data) === null || _c === void 0 ? void 0 : _c.poOrderList[0]) === null || _d === void 0 ? void 0 : _d.orderStatus;
                    //save the tracking data
                    buckyData.tracking = orderDetail;
                    order.bucky_metadata = buckyData;
                    if (status) {
                        //translate the status
                        switch (parseInt(status)) {
                            case 0:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.NOT_FULFILLED, null, orderDetail);
                                break;
                            case 1:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.NOT_FULFILLED, null, orderDetail);
                                break;
                            case 2:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.NOT_FULFILLED, null, orderDetail);
                                break;
                            case 3:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.NOT_FULFILLED, null, orderDetail);
                                break;
                            case 4:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.NOT_FULFILLED, null, orderDetail);
                                break;
                            case 5:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.NOT_FULFILLED, null, orderDetail);
                                break;
                            case 6:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.SHIPPED, null, orderDetail);
                                break;
                            case 7:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.SHIPPED, null, orderDetail);
                                break;
                            case 8:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.CANCELED, medusa_1.FulfillmentStatus.CANCELED, null, orderDetail);
                                break;
                            case 9:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.SHIPPED, null, orderDetail);
                                break;
                            case 10:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.SHIPPED, null, orderDetail);
                                break;
                            case 11:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.PENDING, medusa_1.FulfillmentStatus.SHIPPED, null, orderDetail);
                                break;
                            case 10:
                                order = await this.orderService_.setOrderStatus(order, medusa_1.OrderStatus.COMPLETED, medusa_1.FulfillmentStatus.FULFILLED, null, orderDetail);
                                break;
                        }
                    }
                }
            }
            return order;
        }
        catch (e) {
            this.logger.error(`Error reconciling order status for order ${orderId}`, e);
        }
    }
    async cancelOrder(orderId) {
        var _a, _b, _c, _d;
        try {
            const order = await this.orderService_.retrieve(orderId);
            const buckyData = order.bucky_metadata;
            let cancelOutput = null;
            if (order && buckyData) {
                //get order details from buckydrop
                const shopOrderNo = (_a = buckyData.data.shopOrderNo) !== null && _a !== void 0 ? _a : buckyData.shopOrderNo;
                let purchaseCode = (_c = (_b = buckyData === null || buckyData === void 0 ? void 0 : buckyData.tracking) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.poOrderList.orderCode;
                if (shopOrderNo) {
                    //get PO number from order details
                    const orderDetail = await this.buckyClient.getOrderDetails(shopOrderNo);
                    purchaseCode = (_d = orderDetail === null || orderDetail === void 0 ? void 0 : orderDetail.data) === null || _d === void 0 ? void 0 : _d.poOrderList.orderCode;
                    if (orderDetail)
                        buckyData.tracking = orderDetail;
                    let canceled = false;
                    //first try cancelling purchase order
                    if (purchaseCode) {
                        cancelOutput =
                            await this.buckyClient.cancelPurchaseOrder(purchaseCode);
                        canceled = (cancelOutput === null || cancelOutput === void 0 ? void 0 : cancelOutput.success) === 'true';
                    }
                    //if not canceled yet, try to cancel the shop order
                    if (!canceled) {
                        if (shopOrderNo) {
                            cancelOutput =
                                await this.buckyClient.cancelShopOrder(shopOrderNo);
                            canceled = (cancelOutput === null || cancelOutput === void 0 ? void 0 : cancelOutput.success) === 'true';
                        }
                    }
                    if (cancelOutput) {
                        //save the tracking data
                        order.bucky_metadata = buckyData;
                        buckyData.cancel = cancelOutput;
                        //save the order
                        await this.orderRepository_.save(order);
                    }
                    else {
                        this.logger.warn(`Order ${orderId}: no Buckydrop cancellation was performed`);
                    }
                }
                else {
                    this.logger.warn(`Order ${orderId} has no BD shop order number`);
                }
            }
            else {
                if (!order)
                    this.logger.warn(`Order ${orderId} not found.`);
                else
                    this.logger.warn(`Order ${orderId} is not a Buckydrop order (or has no BD metadata)`);
            }
            return order;
        }
        catch (e) {
            this.logger.error(`Error cancelling order ${orderId}`, e);
        }
    }
    async getOrdersToVerify() {
        var _a, _b;
        const where = {
            bucky_metadata: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
            status: medusa_1.OrderStatus.PENDING,
            payment_status: medusa_1.PaymentStatus.AWAITING,
            fulfillment_status: medusa_1.FulfillmentStatus.NOT_FULFILLED,
        };
        let orders = await this.orderRepository_.find({
            where: where,
        });
        orders =
            (_a = orders === null || orders === void 0 ? void 0 : orders.filter((o) => {
                var _a;
                const tzOffset = o.updated_at.getTimezoneOffset();
                console.log('timezone offset', tzOffset);
                const localDate = new Date(o.updated_at.getTime() - tzOffset * 60000);
                //order must be at least two hours old
                return (Math.floor(localDate.getTime() / 1000) <
                    Math.floor(Date.now() / 1000) -
                        60 *
                            parseInt((_a = process.env
                                .VERIFY_ORDER_PAYMENT_DELAY_MINUTES) !== null && _a !== void 0 ? _a : '120'));
            })) !== null && _a !== void 0 ? _a : [];
        orders =
            (_b = orders === null || orders === void 0 ? void 0 : orders.filter((o) => { var _a; return ((_a = o.bucky_metadata) === null || _a === void 0 ? void 0 : _a.status) === 'pending'; })) !== null && _b !== void 0 ? _b : [];
        return orders;
    }
    async getOrdersToProcess() {
        var _a;
        const options = {
            where: {
                status: medusa_1.OrderStatus.PENDING,
                payment_status: medusa_1.PaymentStatus.CAPTURED,
                fulfillment_status: medusa_1.FulfillmentStatus.NOT_FULFILLED,
                bucky_metadata: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
            },
        };
        const orders = await this.orderRepository_.find(options);
        return ((_a = orders === null || orders === void 0 ? void 0 : orders.filter((o) => { var _a; return ((_a = o.bucky_metadata) === null || _a === void 0 ? void 0 : _a.status) === 'pending'; })) !== null && _a !== void 0 ? _a : []);
    }
    async getOrdersToTrack() {
        var _a;
        const options = {
            where: {
                status: medusa_1.OrderStatus.PENDING,
                payment_status: medusa_1.PaymentStatus.CAPTURED,
                fulfillment_status: (0, typeorm_1.Not)((0, typeorm_1.In)([medusa_1.FulfillmentStatus.CANCELED, medusa_1.FulfillmentStatus.RETURNED])),
                bucky_metadata: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
            },
        };
        const orders = await this.orderRepository_.find(options);
        return ((_a = orders === null || orders === void 0 ? void 0 : orders.filter((o) => { var _a; return ((_a = o.bucky_metadata) === null || _a === void 0 ? void 0 : _a.status) !== 'pending'; })) !== null && _a !== void 0 ? _a : []);
    }
    async mapBuckyDataToProductInput(buckyClient, item, status, storeId, categoryId, collectionId, salesChannels) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        try {
            const productDetails = await buckyClient.getProductDetails(item.goodsLink);
            /*
            const productDetails = {
                success: true,
                data: {
                    goodsId: '727750291125',
                    spuCode: '727750291125',
                    goodsName: 'Student dormitory toothbrushing cup, mouthwash cup, residential school toiletries set, electric toothbrush, tooth utensil, tooth cylinder shelf',
                    goodsLink: 'https://item.taobao.com/item.htm?id=727750291125',
                    shop: { shopId: '117163621', shopName: 'Royal Combine Family Store' },
                    price: { priceCent: 4180, price: 41.8 },
                    proPrice: { priceCent: 2090, price: 20.9 },
                    freight: { priceCent: 0, price: 0 },
                    picUrl: 'https://img.alicdn.com/bao/uploaded/i2/2455411701/O1CN01yHeQkI1OR6gOJtPAu_!!0-item_pic.jpg',
                    platform: 'TB',
                    categoryCode: '121404022',
                    goodsCatName: 'Washing cup',
                    mainItemImgs: [
                        'https://img.alicdn.com/bao/uploaded/i2/2455411701/O1CN01yHeQkI1OR6gOJtPAu_!!0-item_pic.jpg',
                        'https://img.alicdn.com/bao/uploaded/i1/2455411701/O1CN01OqhGTC1OR6gdwdpTJ_!!2455411701.jpg',
                        'https://img.alicdn.com/bao/uploaded/i3/2455411701/O1CN01ej8a8F1OR6gPK6Qi5_!!2455411701.jpg',
                        'https://img.alicdn.com/bao/uploaded/i1/2455411701/O1CN01Ql8rsp1OR6giTpjeG_!!2455411701.jpg',
                        'https://img.alicdn.com/bao/uploaded/i1/2455411701/O1CN01nyX5Vj1OR6ggHEF6w_!!2455411701.jpg'
                    ],
                    productProps: [
                        {
                            propId: 1627207,
                            valueId: 25792702667,
                            propName: 'Color',
                            valueName: 'Round ❤ Upgrade with Handle - Ocean Blue [Loadable Electric Toothbrush]'
                        },
                        {
                            propId: 1627207,
                            valueId: 25792702668,
                            propName: 'Color',
                            valueName: 'Round ❤ Upgrade with Handle - Simple White [Can Put Electric Toothbrush]'
                        },
                        {
                            propId: 1627207,
                            valueId: 25792702669,
                            propName: 'Color',
                            valueName: 'Round ❤ Upgrade with Handle - Cute Pink [Can Put Electric Toothbrush]'
                        },
                        {
                            propId: 1627207,
                            valueId: 26499149914,
                            propName: 'Color',
                            valueName: 'Round ❤ upgrade with handle - blue water blue [can put electric toothbrush]'
                        },
                        {
                            propId: 1627207,
                            valueId: 26499149915,
                            propName: 'Color',
                            valueName: 'Entering 2 - round with handle [blue water + ocean blue]'
                        },
                        {
                            propId: 1627207,
                            valueId: 26499149916,
                            propName: 'Color',
                            valueName: 'Entering two - round with handle [blue water + cherry tree pink]'
                        },
                        {
                            propId: 1627207,
                            valueId: 26499149917,
                            propName: 'Color',
                            valueName: 'Entering 3 - round with handle [blue water blue + ocean blue + cherry tree pink]'
                        }
                    ],
                    skuList: [
                        {
                            props: [
                                {
                                    propId: 1627207,
                                    valueId: 25792702667,
                                    propName: 'Color',
                                    valueName: 'Round ❤ Upgrade with Handle - Ocean Blue [Loadable Electric Toothbrush]'
                                }
                            ],
                            skuCode: '5220066635288',
                            price: { priceCent: 2190, price: 21.9 },
                            quantity: 200,
                            imgUrl: 'https://img.alicdn.com/bao/uploaded/i1/2455411701/O1CN01QRZ7qo1OR6Ywp7vVt_!!2455411701.jpg'
                        }, {
                            props: [
                                {
                                    propId: 1627207,
                                    valueId: 25792702668,
                                    propName: 'Color',
                                    valueName: 'Round ❤ Upgrade with Handle - Simple White [Can Put Electric Toothbrush]'
                                }
                            ],
                            skuCode: '5220066635289',
                            price: { priceCent: 2190, price: 21.9 },
                            quantity: 200,
                            imgUrl: 'https://img.alicdn.com/bao/uploaded/i3/2455411701/O1CN010QTYC51OR6Z6xNjEc_!!2455411701.jpg'
                        }

                    ],
                    repositoryInfo: { quantity: '6800', quantityText: '库存6800件' },
                    beginCount: 0,
                    guaranteeFlag: 0,
                    goodsDetailHtml: '<p><img src="https://img.alicdn.com/imgextra/i4/2455411701/O1CN01PTqAZx1OR6YyPE1Vk_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i2/2455411701/O1CN01FF2vdK1OR6YyqmTLG_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01OqhGTC1OR6gdwdpTJ_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i3/2455411701/O1CN01puks6H1OR6ZaS2N54_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01nyX5Vj1OR6ggHEF6w_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01Ql8rsp1OR6giTpjeG_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01YMgJcK1OR6Yz4jAjM_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i2/2455411701/O1CN01ReNlS71OR6Z0NTaXg_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i4/2455411701/O1CN01bR43Qw1OR6Z06we8X_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i4/2455411701/O1CN01EEe66i1OR6Z3gyR1Q_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i3/2455411701/O1CN01jw1nQd1OR6Ywom6jZ_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01couYQR1OR6Yz4jhzj_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i1/2455411701/O1CN01ctjZc41OR6Z1TfRzp_!!2455411701.jpg"><img src="https://img.alicdn.com/imgextra/i4/2455411701/O1CN01wilFHc1OR6Z8eU4G5_!!2455411701.jpg"></p>',
                    soldOutTag: 1,
                    isSupplier: 0,
                    popularity: 4
                },
                errKey: '',
                code: 0,
                info: 'Success',
                currentTime: 1726058167982
            };*/
            if (!productDetails)
                throw new Error(`No product details were retrieved for product ${item.spuCode}`);
            const metadata = item;
            metadata.detail = productDetails.data;
            const spuCode = (_a = item === null || item === void 0 ? void 0 : item.spuCode) !== null && _a !== void 0 ? _a : (_b = productDetails === null || productDetails === void 0 ? void 0 : productDetails.data) === null || _b === void 0 ? void 0 : _b.spuCode;
            if (!(spuCode === null || spuCode === void 0 ? void 0 : spuCode.length))
                throw new Error('SPU code not found');
            const optionNames = this.getUniqueProductOptionNames(productDetails);
            const tagName = productDetails.data.goodsCatName;
            const variants = await this.mapVariants(productDetails, optionNames);
            //add variant images to the main product images
            const images = (_d = (_c = productDetails === null || productDetails === void 0 ? void 0 : productDetails.data) === null || _c === void 0 ? void 0 : _c.mainItemImgs) !== null && _d !== void 0 ? _d : [];
            for (const v of variants) {
                if (((_e = v.metadata) === null || _e === void 0 ? void 0 : _e.imgUrl) &&
                    !images.find((i) => i === v.metadata.imgUrl))
                    images.push(v.metadata.imgUrl);
            }
            const output = {
                title: (_f = item === null || item === void 0 ? void 0 : item.goodsName) !== null && _f !== void 0 ? _f : (_g = productDetails === null || productDetails === void 0 ? void 0 : productDetails.data) === null || _g === void 0 ? void 0 : _g.goodsName,
                subtitle: (_h = item === null || item === void 0 ? void 0 : item.goodsName) !== null && _h !== void 0 ? _h : (_j = productDetails === null || productDetails === void 0 ? void 0 : productDetails.data) === null || _j === void 0 ? void 0 : _j.goodsName, //TODO: find a better value
                handle: spuCode,
                description: (_l = (_k = productDetails === null || productDetails === void 0 ? void 0 : productDetails.data) === null || _k === void 0 ? void 0 : _k.goodsDetailHtml) !== null && _l !== void 0 ? _l : '',
                is_giftcard: false,
                status: status,
                thumbnail: (_m = item === null || item === void 0 ? void 0 : item.picUrl) !== null && _m !== void 0 ? _m : (_o = productDetails === null || productDetails === void 0 ? void 0 : productDetails.data) === null || _o === void 0 ? void 0 : _o.mainItemImgs[0],
                images,
                collection_id: collectionId,
                weight: Math.round((_p = item === null || item === void 0 ? void 0 : item.weight) !== null && _p !== void 0 ? _p : 100),
                discountable: true,
                store_id: storeId,
                categories: (categoryId === null || categoryId === void 0 ? void 0 : categoryId.length) ? [{ id: categoryId }] : [],
                sales_channels: salesChannels.map((sc) => {
                    return { id: sc };
                }),
                tags: (tagName === null || tagName === void 0 ? void 0 : tagName.length) ? [{ id: tagName, value: tagName }] : [],
                bucky_metadata: metadata,
                options: optionNames.map((o) => {
                    return { title: o };
                }),
                variants,
            };
            if (!((_q = output.variants) === null || _q === void 0 ? void 0 : _q.length))
                throw new Error(`No variants were detected for product ${spuCode}`);
            return output;
        }
        catch (error) {
            this.logger.error('Error mapping Bucky data to product input', error);
            return null;
        }
    }
    async mapVariants(productDetails, optionNames) {
        var _a, _b, _c;
        const variants = [];
        const getVariantDescriptionText = (data) => {
            let output = '';
            if (data.props) {
                for (let prop of data.props) {
                    output += prop.valueName + ' ';
                }
                output = output.trim();
            }
            else {
                output = productDetails.data.goodsName;
            }
            return output;
        };
        if (!((_a = productDetails.data.skuList) === null || _a === void 0 ? void 0 : _a.length)) {
            this.logger.warn('EMPTY SKU LIST');
        }
        for (const variant of productDetails.data.skuList) {
            //get price
            const baseAmount = variant.proPrice
                ? variant.proPrice.priceCent
                : variant.price.priceCent;
            //TODO: get from someplace global
            const currencies = ['eth', 'usdc', 'usdt'];
            const prices = [];
            for (const currency of currencies) {
                prices.push({
                    currency_code: currency,
                    amount: await this.priceConverter.getPrice({
                        baseAmount,
                        baseCurrency: 'cny',
                        toCurrency: currency,
                    }),
                });
            }
            //get option names/values
            const options = [];
            if (variant.props) {
                for (const opt of optionNames) {
                    options.push({
                        value: (_c = (_b = variant.props.find((o) => o.propName === opt)) === null || _b === void 0 ? void 0 : _b.valueName) !== null && _c !== void 0 ? _c : '',
                    });
                }
            }
            variants.push({
                title: getVariantDescriptionText(variant),
                inventory_quantity: variant.quantity,
                allow_backorder: false,
                manage_inventory: true,
                bucky_metadata: variant,
                metadata: { imgUrl: variant.imgUrl },
                prices,
                options: options,
            });
        }
        return variants;
    }
    getUniqueProductOptionNames(productDetails) {
        const output = [];
        for (const variant of productDetails.data.skuList) {
            for (const prop of variant.props) {
                if (!output.find((p) => p === prop.propName)) {
                    output.push(prop.propName);
                }
            }
        }
        return output;
    }
}
exports.default = BuckydropService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja3lkcm9wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2J1Y2t5ZHJvcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FVMEI7QUFLMUIsZ0VBQTJEO0FBQzNELDREQUltQztBQU9uQyxvREFBZ0U7QUFDaEUscUNBTWlCO0FBV2pCLE1BQU0saUJBQWlCLEdBQVcsUUFBUSxDQUN0QyxNQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLG1DQUFJLE1BQU0sQ0FDeEQsQ0FBQztBQUNGLE1BQU0saUJBQWlCLEdBQVcsUUFBUSxDQUN0QyxNQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLG1DQUFJLE1BQU0sQ0FDeEQsQ0FBQztBQUVGLHNFQUFzRTtBQUV0RSxNQUFxQixnQkFBaUIsU0FBUSwrQkFBc0I7SUFXaEUsWUFBWSxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUM7UUFDaEQsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQzFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDO1FBQ2xELElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztRQUM1QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksaUNBQWMsQ0FDcEMsSUFBSSxDQUFDLE1BQU0sRUFDWCxTQUFTLENBQUMsNEJBQTRCLENBQ3pDLENBQUM7UUFDRixJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDO1FBQ3ZE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