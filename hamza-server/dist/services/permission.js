"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
class PermissionService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.permissionRepository_ = container.permissionRepository;
    }
    async create(data) {
        // omitting validation for simplicity
        return this.atomicPhase_(async (manager) => {
            const permissionRepo = manager.withRepository(this.permissionRepository_);
            const permission = permissionRepo.create(data);
            const result = await permissionRepo.save(permission);
            return result;
        });
    }
}
exports.default = PermissionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9wZXJtaXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQTBEO0FBVTFELE1BQU0saUJBQWtCLFNBQVEsK0JBQXNCO0lBR2xELFlBQVksU0FBK0I7UUFDdkMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsb0JBQW9CLENBQUM7SUFDaEUsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBbUI7UUFDNUIscUNBQXFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDdkMsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FDekMsSUFBSSxDQUFDLHFCQUFxQixDQUM3QixDQUFDO1lBQ0YsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUvQyxNQUFNLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFckQsT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxpQkFBaUIsQ0FBQyJ9