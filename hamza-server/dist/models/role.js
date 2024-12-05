"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const utils_1 = require("@medusajs/medusa/dist/utils");
const permission_1 = require("./permission");
const user_1 = require("./user");
const store_1 = require("./store");
let Role = class Role extends medusa_1.BaseEntity {
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, 'role');
    }
};
exports.Role = Role;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => permission_1.Permission),
    (0, typeorm_1.JoinTable)({
        name: 'role_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Role.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_1.User, (user) => user.team_role),
    (0, typeorm_1.JoinColumn)({ name: 'id', referencedColumnName: 'role_id' }),
    __metadata("design:type", Array)
], Role.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_1.Store, (store) => store.roles),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_1.Store)
], Role.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Role.prototype, "beforeInsert", null);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)()
], Role);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcm9sZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FVaUI7QUFDakIsNkNBQThDO0FBQzlDLHVEQUErRDtBQUMvRCw2Q0FBMEM7QUFDMUMsaUNBQThCO0FBQzlCLG1DQUFnQztBQUd6QixJQUFNLElBQUksR0FBVixNQUFNLElBQUssU0FBUSxtQkFBVTtJQStCeEIsWUFBWTtRQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUEsd0JBQWdCLEVBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0osQ0FBQTtBQWxDWSxvQkFBSTtBQUViO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDOztrQ0FDZjtBQUliO0lBRkMsSUFBQSxlQUFLLEdBQUU7SUFDUCxJQUFBLGdCQUFNLEVBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7O3NDQUNWO0FBY2pCO0lBWkMsSUFBQSxvQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLHVCQUFVLENBQUM7SUFDNUIsSUFBQSxtQkFBUyxFQUFDO1FBQ1AsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixVQUFVLEVBQUU7WUFDUixJQUFJLEVBQUUsU0FBUztZQUNmLG9CQUFvQixFQUFFLElBQUk7U0FDN0I7UUFDRCxpQkFBaUIsRUFBRTtZQUNmLElBQUksRUFBRSxlQUFlO1lBQ3JCLG9CQUFvQixFQUFFLElBQUk7U0FDN0I7S0FDSixDQUFDOzt5Q0FDd0I7QUFJMUI7SUFGQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsV0FBSSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQy9DLElBQUEsb0JBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsU0FBUyxFQUFFLENBQUM7O21DQUM5QztBQUlkO0lBRkMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLGFBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUM5QyxJQUFBLG9CQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUM7OEJBQzFCLGFBQUs7bUNBQUM7QUFHTDtJQURQLElBQUEsc0JBQVksR0FBRTs7Ozt3Q0FHZDtlQWpDUSxJQUFJO0lBRGhCLElBQUEsZ0JBQU0sR0FBRTtHQUNJLElBQUksQ0FrQ2hCIn0=