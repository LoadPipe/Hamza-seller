"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const medusa_1 = require("@medusajs/medusa");
const logger_1 = require("../utils/logging/logger");
class RegionService extends medusa_1.RegionService {
    constructor(container) {
        super(container);
        this.logger = (0, logger_1.createLogger)(container, 'RegionService');
    }
    async retrieve(regionId, config) {
        return super.retrieve(regionId, config);
    }
    async retrieveByCountryCode(code, config) {
        return super.retrieve(code, config);
    }
    async list(selector, config) {
        const regions = await super.list(selector, config);
        for (let r of regions) {
            r.countries = r.countries.filter(c => c.iso_2 != 'en');
        }
        return regions;
    }
    async listAndCount(selector, config) {
        return super.listAndCount(selector, config);
    }
}
RegionService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = RegionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9yZWdpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWtDO0FBQ2xDLDZDQVEwQjtBQU8xQixvREFBZ0U7QUFLaEUsTUFBTSxhQUFjLFNBQVEsc0JBQW1CO0lBSTNDLFlBQVksU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLHFCQUFZLEVBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQWdCLEVBQUUsTUFBMkI7UUFDeEQsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQXNCLEVBQUUsTUFBMkI7UUFDM0UsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUEyQixFQUFFLE1BQTJCO1FBQy9ELE1BQU0sT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkQsS0FBSyxJQUFJLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNwQixDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQTtRQUMxRCxDQUFDO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBNkMsRUFBRSxNQUEyQjtRQUN6RixPQUFPLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hELENBQUM7O0FBMUJNLHVCQUFTLEdBQUcsaUJBQVEsQ0FBQyxNQUFNLENBQUM7QUE2QnZDLGtCQUFlLGFBQWEsQ0FBQyJ9