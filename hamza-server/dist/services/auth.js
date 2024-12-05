"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const awilix_1 = require("awilix");
const logger_1 = require("../utils/logging/logger");
class AuthService extends medusa_1.AuthService {
    constructor(container) {
        super(container);
        // Assuming you have additional setup or properties to include
        this.logger = (0, logger_1.createLogger)(container, 'AuthService');
    }
    // Unified method implementation
    //TODO: (CLEANUP) is this ever called?
    async authenticate(email, password, wallet_address) {
        var _a, _b, _c, _d;
        this.logger.info(`calling medusa authenticate....${email} ${password}`);
        const authResult = await super.authenticate((_b = (_a = email === null || email === void 0 ? void 0 : email.trim()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : '', (_d = (_c = password === null || password === void 0 ? void 0 : password.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : '');
        this.logger.info(`Auth result: ${JSON.stringify(authResult)}`);
        // Handle the wallet address logic separately, depending on your application's needs
        // This could be adding the wallet address to the user's profile, logging it, etc.
        // For demonstration, just adding it to the result if provided
        if (wallet_address) {
            const extendedResult = {
                ...authResult,
                wallet_address,
            };
            this.logger.info(`Authentication succeeded, wallet address: ${wallet_address}`);
            return extendedResult;
        }
        return authResult;
    }
    async authenticateCustomer(email, password, wallet_address) {
        this.logger.debug('calling medusa authenticate....' + JSON.stringify({ email, password, wallet_address }));
        const authResult = await super.authenticateCustomer(email, password);
        // Handle the wallet address logic separately, depending on your application's needs
        // This could be adding the wallet address to the user's profile, logging it, etc.
        // For demonstration, just adding it to the result if provided
        if (wallet_address) {
            const extendedResult = {
                ...authResult,
                wallet_address,
            };
            this.logger.info(`Authentication succeeded, wallet address: ${wallet_address}`);
            return extendedResult;
        }
        return authResult;
    }
}
AuthService.LIFE_TIME = awilix_1.Lifetime.SINGLETON;
exports.default = AuthService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQTRFO0FBQzVFLG1DQUFrQztBQUVsQyxvREFBZ0U7QUFNaEUsTUFBcUIsV0FBWSxTQUFRLG9CQUFpQjtJQUl0RCxZQUFZLFNBQVM7UUFDakIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pCLDhEQUE4RDtRQUM5RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQWFELGdDQUFnQztJQUNoQyxzQ0FBc0M7SUFDdEMsS0FBSyxDQUFDLFlBQVksQ0FDZCxLQUFhLEVBQ2IsUUFBZ0IsRUFDaEIsY0FBdUI7O1FBRXZCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxLQUFLLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4RSxNQUFNLFVBQVUsR0FBdUIsTUFBTSxLQUFLLENBQUMsWUFBWSxDQUMzRCxNQUFBLE1BQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUksRUFBRSwwQ0FBRSxXQUFXLEVBQUUsbUNBQUksRUFBRSxFQUNsQyxNQUFBLE1BQUEsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLElBQUksRUFBRSwwQ0FBRSxXQUFXLEVBQUUsbUNBQUksRUFBRSxDQUN4QyxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRTlELG9GQUFvRjtRQUNwRixrRkFBa0Y7UUFDbEYsOERBQThEO1FBQzlELElBQUksY0FBYyxFQUFFLENBQUM7WUFDakIsTUFBTSxjQUFjLEdBQStCO2dCQUMvQyxHQUFHLFVBQVU7Z0JBQ2IsY0FBYzthQUNqQixDQUFDO1lBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ1osNkNBQTZDLGNBQWMsRUFBRSxDQUNoRSxDQUFDO1lBQ0YsT0FBTyxjQUFjLENBQUM7UUFDMUIsQ0FBQztRQUVELE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxLQUFLLENBQUMsb0JBQW9CLENBQ3RCLEtBQWEsRUFDYixRQUFnQixFQUNoQixjQUF1QjtRQUV2QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0csTUFBTSxVQUFVLEdBQXVCLE1BQU0sS0FBSyxDQUFDLG9CQUFvQixDQUNuRSxLQUFLLEVBQ0wsUUFBUSxDQUNYLENBQUM7UUFFRixvRkFBb0Y7UUFDcEYsa0ZBQWtGO1FBQ2xGLDhEQUE4RDtRQUM5RCxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ2pCLE1BQU0sY0FBYyxHQUErQjtnQkFDL0MsR0FBRyxVQUFVO2dCQUNiLGNBQWM7YUFDakIsQ0FBQztZQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNaLDZDQUE2QyxjQUFjLEVBQUUsQ0FDaEUsQ0FBQztZQUNGLE9BQU8sY0FBYyxDQUFDO1FBQzFCLENBQUM7UUFFRCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDOztBQTdFTSxxQkFBUyxHQUFHLGlCQUFRLENBQUMsU0FBUyxDQUFDO2tCQURyQixXQUFXIn0=