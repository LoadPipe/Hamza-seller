"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const config_1 = require("../config");
const switch_checkout_1 = __importDefault(require("./checkout-processors/switch-checkout"));
const basic_checkout_1 = require("./checkout-processors/basic-checkout");
const massmarket_checkout_1 = __importDefault(require("./checkout-processors/massmarket-checkout"));
class CartCompletionStrategy extends medusa_1.AbstractCartCompletionStrategy {
    constructor(deps) {
        super(deps); // Call the superclass constructor if needed and pass any required parameters explicitly if it requires any.
        // Assuming both strategies need the same dependencies as this class, pass them directly.
        this.massMarketProcessor = new massmarket_checkout_1.default(deps);
        this.switchProcessor = new switch_checkout_1.default(deps);
        this.basicProcessor = new basic_checkout_1.BasicCheckoutProcessor(deps);
        // Initialize all services and repositories provided in deps directly
        this.idempotencyKeyService = deps.idempotencyKeyService;
        this.cartService = deps.cartService;
        this.paymentService = deps.paymentService;
        this.productService = deps.productService;
        this.orderService = deps.orderService;
        this.paymentRepository = deps.paymentRepository;
        this.orderRepository = deps.orderRepository;
        this.lineItemRepository = deps.lineItemRepository;
        this.logger = deps.logger;
    }
    async complete(cartId, idempotencyKey, context) {
        const checkoutMode = config_1.Config.checkoutMode;
        this.logger.debug(`CartCompletionStrategy: payment mode is ${checkoutMode}`);
        switch (checkoutMode) {
            case 'MASSMARKET':
                return await this.massMarketProcessor.complete(cartId);
            case 'SWITCH':
                return await this.switchProcessor.complete(cartId);
            case 'DIRECT':
                return await this.basicProcessor.complete(cartId);
            default:
                'FAKE';
                return await this.basicProcessor.complete(cartId);
        }
    }
}
exports.default = CartCompletionStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydC1jb21wbGV0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cmF0ZWdpZXMvY2FydC1jb21wbGV0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkNBUTBCO0FBTzFCLHNDQUFtQztBQUNuQyw0RkFBNEU7QUFDNUUseUVBQThFO0FBQzlFLG9HQUFvRjtBQWVwRixNQUFNLHNCQUF1QixTQUFRLHVDQUE4QjtJQWMvRCxZQUFZLElBQTBCO1FBQ2xDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLDRHQUE0RztRQUV6SCx5RkFBeUY7UUFDekYsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksNkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHlCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSx1Q0FBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2RCxxRUFBcUU7UUFDckUsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUN4RCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDcEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQzFDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUMxQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDdEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNoRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDNUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDOUIsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQ1YsTUFBYyxFQUNkLGNBQThCLEVBQzlCLE9BQXVCO1FBRXZCLE1BQU0sWUFBWSxHQUFHLGVBQU0sQ0FBQyxZQUFZLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFN0UsUUFBUSxZQUFZLEVBQUUsQ0FBQztZQUNuQixLQUFLLFlBQVk7Z0JBQ2IsT0FBTyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQzFDLE1BQU0sQ0FDVCxDQUFDO1lBRU4sS0FBSyxRQUFRO2dCQUNULE9BQU8sTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FDdEMsTUFBTSxDQUNULENBQUM7WUFDTixLQUFLLFFBQVE7Z0JBQ1QsT0FBTyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUNyQyxNQUFNLENBQ1QsQ0FBQztZQUNOO2dCQUNJLE1BQU0sQ0FBQztnQkFDUCxPQUFPLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQ3JDLE1BQU0sQ0FDVCxDQUFDO1FBQ1YsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLHNCQUFzQixDQUFDIn0=