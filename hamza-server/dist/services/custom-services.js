"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
class HelloService extends medusa_1.TransactionBaseService {
    constructor(container, options) {
        super(container, options); // Explicitly passing container and options
        try {
            this.loggedInUser_ = container.loggedInUser;
        }
        catch (e) { }
    }
}
exports.default = HelloService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2N1c3RvbS1zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDZDQUswQjtBQUUxQixNQUFNLFlBQWEsU0FBUSwrQkFBc0I7SUFHN0MsWUFBWSxTQUFTLEVBQUUsT0FBTztRQUMxQixLQUFLLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsMkNBQTJDO1FBRXRFLElBQUksQ0FBQztZQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztRQUNoRCxDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBLENBQUM7SUFDbEIsQ0FBQztDQUNKO0FBRUQsa0JBQWUsWUFBWSxDQUFDIn0=