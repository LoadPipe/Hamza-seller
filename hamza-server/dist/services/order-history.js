"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const order_history_1 = require("../repositories/order-history");
const order_history_2 = require("../models/order-history");
const logger_1 = require("../utils/logging/logger");
class OrderHistoryService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.orderHistoryRepository_ = order_history_1.OrderHistoryRepository;
        this.logger = (0, logger_1.createLogger)(container, 'OrderHistoryService');
    }
    async create(order, createInput) {
        const item = new order_history_2.OrderHistory();
        item.order_id = order.id;
        item.to_status = createInput.to_status;
        item.to_payment_status = createInput.to_payment_status;
        item.to_fulfillment_status = createInput.to_fulfillment_status;
        item.metadata = createInput.metadata;
        //calculate item title 
        if (item.to_status) {
            item.title = item.to_status.toString();
        }
        else {
            if (item.to_fulfillment_status)
                item.title = item.to_fulfillment_status.toString();
            else
                item.title = item.to_payment_status.toString();
        }
        return this.orderHistoryRepository_.save(item);
    }
    async retrieve(orderId) {
        return this.orderHistoryRepository_.find({ where: { order_id: orderId } });
    }
}
exports.default = OrderHistoryService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItaGlzdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9vcmRlci1oaXN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQW1JO0FBQ25JLGlFQUF1RTtBQUN2RSwyREFBdUQ7QUFFdkQsb0RBQWdFO0FBVWhFLE1BQXFCLG1CQUFvQixTQUFRLCtCQUFzQjtJQUluRSxZQUFZLFNBQVM7UUFDakIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxzQ0FBc0IsQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFZLEVBQUUsV0FBb0M7UUFDM0QsTUFBTSxJQUFJLEdBQWlCLElBQUksNEJBQVksRUFBRSxDQUFDO1FBRTlDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUM7UUFDdkMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQztRQUN2RCxJQUFJLENBQUMscUJBQXFCLEdBQUcsV0FBVyxDQUFDLHFCQUFxQixDQUFDO1FBQy9ELElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUVyQyx1QkFBdUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNDLENBQUM7YUFDSSxDQUFDO1lBQ0YsSUFBSSxJQUFJLENBQUMscUJBQXFCO2dCQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7Z0JBRW5ELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3ZELENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBZTtRQUMxQixPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9FLENBQUM7Q0FDSjtBQXBDRCxzQ0FvQ0MifQ==