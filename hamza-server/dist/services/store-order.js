"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const awilix_1 = require("awilix");
const typeorm_1 = require("typeorm");
const logger_1 = require("../utils/logging/logger");
const medusa_2 = require("@medusajs/medusa");
const DEFAULT_PAGE_COUNT = 10;
class StoreOrderService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
        this.storeRepository_ = container.storeRepository;
        this.paymentRepository_ = container.paymentRepository;
        this.productVariantRepository_ = container.productVariantRepository;
        this.orderHistoryService_ = container.orderHistoryService;
        this.logger = (0, logger_1.createLogger)(container, 'StoreOrderService');
    }
    async getOrdersForStore(storeId, filter, sort, page, ordersPerPage) {
        var _a, _b;
        //basic query is store id
        const where = { store_id: storeId };
        //apply filter if any
        if (filter) {
            for (let prop in filter) {
                if (filter[prop].in) {
                    where[prop] = (0, typeorm_1.In)(filter[prop].in);
                }
                else if (filter[prop].ne) {
                    where[prop] = (0, typeorm_1.Not)(filter[prop].ne);
                }
                else if (filter[prop].eq) {
                    where[prop] = filter[prop].eq;
                }
                else if (filter[prop].lt) {
                    where[prop] = (0, typeorm_1.LessThan)(filter[prop].lt);
                }
                else if (filter[prop].gt) {
                    where[prop] = (0, typeorm_1.MoreThan)(filter[prop].gt);
                }
                else if (filter[prop].lte) {
                    where[prop] = (0, typeorm_1.LessThanOrEqual)(filter[prop].lte);
                }
                else if (filter[prop].gte) {
                    where[prop] = (0, typeorm_1.MoreThanOrEqual)(filter[prop].gte);
                }
                else {
                    where[prop] = filter[prop];
                }
            }
            if (filter.created_at) {
                if (filter.created_at.gte && filter.created_at.lte) {
                    where['created_at'] = (0, typeorm_1.Between)(new Date(filter.created_at.gte), new Date(filter.created_at.lte));
                }
                else if (filter.created_at.gte) {
                    where['created_at'] = (0, typeorm_1.MoreThanOrEqual)(new Date(filter.created_at.gte));
                }
                else if (filter.created_at.lte) {
                    where['created_at'] = (0, typeorm_1.LessThanOrEqual)(new Date(filter.created_at.lte));
                }
            }
        }
        const totalRecords = await this.orderRepository_.count({
            where: { store_id: storeId },
        });
        // Calculate counts for each status
        const statusCounts = {
            all: totalRecords,
            processing: await this.orderRepository_.count({
                where: {
                    store_id: storeId,
                    fulfillment_status: medusa_2.FulfillmentStatus.NOT_FULFILLED, // Correct casing
                    status: medusa_2.OrderStatus.PENDING, // Correct casing
                },
            }),
            shipped: await this.orderRepository_.count({
                where: {
                    store_id: storeId,
                    fulfillment_status: medusa_2.FulfillmentStatus.SHIPPED,
                },
            }),
            delivered: await this.orderRepository_.count({
                where: {
                    store_id: storeId,
                    fulfillment_status: medusa_2.FulfillmentStatus.FULFILLED,
                    status: medusa_2.OrderStatus.COMPLETED,
                },
            }),
            cancelled: await this.orderRepository_.count({
                where: { store_id: storeId, status: medusa_2.OrderStatus.CANCELED },
            }),
            refunded: await this.orderRepository_.count({
                where: {
                    store_id: storeId,
                    payment_status: medusa_2.PaymentStatus.REFUNDED,
                },
            }),
        };
        const params = {
            where,
            take: ordersPerPage !== null && ordersPerPage !== void 0 ? ordersPerPage : DEFAULT_PAGE_COUNT,
            skip: page * ordersPerPage,
            order: sort && sort.field !== 'customer'
                ? {
                    [sort.field]: sort.direction, // e.g., ASC or DESC
                }
                : undefined,
            relations: ['customer'],
            // relations: ['customer', 'items.variant.product']
        };
        // Get total count of matching record
        //get orders
        const orders = await this.orderRepository_.find(params);
        if ((sort === null || sort === void 0 ? void 0 : sort.field) === 'customer') {
            orders.sort((a, b) => {
                var _a, _b, _c, _d;
                const nameA = (_b = (_a = a.customer) === null || _a === void 0 ? void 0 : _a.last_name) === null || _b === void 0 ? void 0 : _b.toLowerCase();
                const nameB = (_d = (_c = b.customer) === null || _c === void 0 ? void 0 : _c.last_name) === null || _d === void 0 ? void 0 : _d.toLowerCase();
                if (sort.direction === 'ASC') {
                    return nameA.localeCompare(nameB);
                }
                else if (sort.direction === 'DESC') {
                    return nameB.localeCompare(nameA);
                }
            });
        }
        return {
            pageIndex: page,
            pageCount: Math.ceil(totalRecords / ordersPerPage),
            rowsPerPage: ordersPerPage,
            sortedBy: (_a = sort === null || sort === void 0 ? void 0 : sort.field) !== null && _a !== void 0 ? _a : null,
            sortDirection: (_b = sort === null || sort === void 0 ? void 0 : sort.direction) !== null && _b !== void 0 ? _b : 'ASC',
            filtering: filter,
            orders,
            totalRecords,
            statusCount: statusCounts,
        };
    }
    async changeOrderStatus(orderId, newStatus, note) {
        try {
            const order = await this.orderRepository_.findOne({
                where: { id: orderId },
            });
            if (!order) {
                throw new Error(`Order with id ${orderId} not found`);
            }
            const mappedStatus = Object.values(medusa_2.OrderStatus).find((status) => status === newStatus);
            if (!mappedStatus) {
                throw new Error(`Invalid order status: ${newStatus}`);
            }
            order.status = mappedStatus;
            if (note) {
                order.metadata = note;
            }
            // Save the updated order
            await this.orderRepository_.save(order);
            return order;
        }
        catch (error) {
            this.logger.error(`Failed to update order status for order ${orderId}: ${error.message}`);
            throw error;
        }
    }
    async getOrderDetails(orderId) {
        try {
            // Fetch the order with the specific relation
            const order = await this.orderRepository_.findOne({
                where: { id: orderId },
                relations: [
                    'items',
                    'items.variant',
                    'items.variant.product',
                    'customer.walletAddresses',
                    'shipping_address',
                ],
            });
            if (!order) {
                throw new Error(`Order with id ${orderId} not found`);
            }
            return order;
        }
        catch (error) {
            this.logger.error(`Failed to fetch order details for order ${orderId}: ${error.message}`);
            throw error;
        }
    }
}
StoreOrderService.LIFE_TIME = awilix_1.Lifetime.SINGLETON;
exports.default = StoreOrderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUtb3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvc3RvcmUtb3JkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBMEQ7QUFTMUQsbUNBQWtDO0FBQ2xDLHFDQVFpQjtBQUdqQixvREFBZ0U7QUFLaEUsNkNBSTBCO0FBRTFCLE1BQU0sa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0FBZ0M5QixNQUFxQixpQkFBa0IsU0FBUSwrQkFBc0I7SUFVakUsWUFBWSxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztRQUNsRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztRQUNsRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDO1FBQ3RELElBQUksQ0FBQyx5QkFBeUIsR0FBRyxTQUFTLENBQUMsd0JBQXdCLENBQUM7UUFDcEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQztRQUMxRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQixDQUNuQixPQUFlLEVBQ2YsTUFBb0IsRUFDcEIsSUFBUyxFQUNULElBQVksRUFDWixhQUFxQjs7UUFFckIseUJBQXlCO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDO1FBRXBDLHFCQUFxQjtRQUNyQixJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1QsS0FBSyxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7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