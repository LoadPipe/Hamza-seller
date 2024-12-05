"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const medusa_1 = require("@medusajs/medusa");
const logger_1 = require("../utils/logging/logger");
class PaymentCollectionService extends medusa_1.PaymentCollectionService {
    constructor(container) {
        super(container);
        this.paymentCollectionRepository_ =
            container.paymentCollectionRepository;
        this.logger = (0, logger_1.createLogger)(container, 'PaymentCollectionService');
    }
    async create(data) {
        this.logger.debug(`creating payment collection ${data}`);
        const { store_id, ...rest } = data;
        return await this.paymentCollectionRepository_.save({
            ...rest,
            store_id,
        });
    }
    async update(id, data) {
        // First, find the payment collection that you want to update
        // Then, update the payment collection with the new data
        const updatedPaymentCollection = Object.assign(id, data);
        return await this.paymentCollectionRepository_.save(updatedPaymentCollection);
    }
}
PaymentCollectionService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = PaymentCollectionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3BheW1lbnQtY29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFrQztBQUNsQyw2Q0FHMEI7QUFLMUIsb0RBQWdFO0FBTWhFLE1BQXFCLHdCQUF5QixTQUFRLGlDQUE4QjtJQUtoRixZQUFZLFNBQVM7UUFDakIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyw0QkFBNEI7WUFDN0IsU0FBUyxDQUFDLDJCQUEyQixDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBQSxxQkFBWSxFQUFDLFNBQVMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUNSLElBQWtDO1FBRWxDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLCtCQUErQixJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFbkMsT0FBTyxNQUFNLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUM7WUFDaEQsR0FBRyxJQUFJO1lBQ1AsUUFBUTtTQUNYLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUNSLEVBQVUsRUFDVixJQUFvQztRQUVwQyw2REFBNkQ7UUFDN0Qsd0RBQXdEO1FBQ3hELE1BQU0sd0JBQXdCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekQsT0FBTyxNQUFNLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQy9DLHdCQUF3QixDQUMzQixDQUFDO0lBQ04sQ0FBQzs7QUFqQ00sa0NBQVMsR0FBRyxpQkFBUSxDQUFDLE1BQU0sQ0FBQztrQkFEbEIsd0JBQXdCIn0=