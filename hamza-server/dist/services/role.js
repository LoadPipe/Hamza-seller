"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
class RoleService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        this.roleRpository_ = container.roleRepository;
        this.permissionService_ = container.permissionService;
        this.userService_ = container.userService;
    }
    async retrieve(id) {
        // for simplicity, we retrieve all relations
        // however, it's best to supply the relations
        // as an optional method parameter
        const roleRepo = this.manager_.withRepository(this.roleRpository_);
        return roleRepo.findOne({
            where: {
                id,
            },
            relations: ['permissions', 'store', 'users'],
        });
    }
    async create(data) {
        return this.atomicPhase_(async (manager) => {
            // omitting validation for simplicity
            const { permissions: permissionsData = [] } = data;
            delete data.permissions;
            const roleRepo = manager.withRepository(this.roleRpository_);
            const role = roleRepo.create(data);
            role.permissions = [];
            for (const permissionData of permissionsData) {
                role.permissions.push(await this.permissionService_.create(permissionData));
            }
            const result = await roleRepo.save(role);
            return await this.retrieve(result.id);
        });
    }
    async associateUser(role_id, user_id) {
        return this.atomicPhase_(async () => {
            // omitting validation for simplicity
            await this.userService_.update(user_id, {
                role_id,
            });
            return await this.retrieve(role_id);
        });
    }
}
exports.default = RoleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9yb2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQTBEO0FBa0IxRCxNQUFNLFdBQVksU0FBUSwrQkFBc0I7SUFLNUMsWUFBWSxTQUErQjtRQUN2QyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDO1FBQy9DLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUMsaUJBQWlCLENBQUM7UUFDdEQsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDO0lBQzlDLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQVU7UUFDckIsNENBQTRDO1FBQzVDLDZDQUE2QztRQUM3QyxrQ0FBa0M7UUFDbEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ25FLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQztZQUNwQixLQUFLLEVBQUU7Z0JBQ0gsRUFBRTthQUNMO1lBQ0QsU0FBUyxFQUFFLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7U0FDL0MsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBbUI7UUFDNUIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUN2QyxxQ0FBcUM7WUFDckMsTUFBTSxFQUFFLFdBQVcsRUFBRSxlQUFlLEdBQUcsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ25ELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUV4QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM3RCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRW5DLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBRXRCLEtBQUssTUFBTSxjQUFjLElBQUksZUFBZSxFQUFFLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUNqQixNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQ3ZELENBQUM7WUFDTixDQUFDO1lBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXpDLE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQWUsRUFBRSxPQUFlO1FBQ2hELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNoQyxxQ0FBcUM7WUFDckMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BDLE9BQU87YUFDVixDQUFDLENBQUM7WUFFSCxPQUFPLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQUVELGtCQUFlLFdBQVcsQ0FBQyJ9