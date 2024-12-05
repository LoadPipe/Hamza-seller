"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const medusa_1 = require("@medusajs/medusa");
class UserService extends medusa_1.UserService {
    constructor(container) {
        super(container);
        this.storeRepository_ = container.storeRepository;
        try {
            this.loggedInUser_ = container.loggedInUser;
        }
        catch (e) {
            // avoid errors when backend first runs
        }
    }
    async update(userId, update) {
        return super.update(userId, update);
    }
}
UserService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWtDO0FBQ2xDLDZDQUEwRTtBQVcxRSxNQUFNLFdBQVksU0FBUSxvQkFBaUI7SUFLdkMsWUFBWSxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztRQUVsRCxJQUFJLENBQUM7WUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUM7UUFDaEQsQ0FBQztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDVCx1Q0FBdUM7UUFDM0MsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUNSLE1BQWMsRUFDZCxNQUVDO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDOztBQXRCTSxxQkFBUyxHQUFHLGlCQUFRLENBQUMsTUFBTSxDQUFDO0FBd0N2QyxrQkFBZSxXQUFXLENBQUMifQ==