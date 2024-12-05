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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const store_1 = require("./store");
const role_1 = require("./role");
// For a simple solution, we're not going to extend (User Entity roles) from Medusa's User Entity
// `admin` will have all permissions
// `member` will have limited permissions; they will act as vendors
// Vendors will only have access to their own products
// TODO: https://docs.medusajs.com/modules/users/backend/rbac
let User = class User extends medusa_1.User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_1.Role, (role) => role.users),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", role_1.Role)
], User.prototype, "team_role", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => store_1.Store, (store) => store.owner),
    __metadata("design:type", store_1.Store)
], User.prototype, "owned_store", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_1.Store)
], User.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "wallet_address", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FPaUI7QUFDakIsNkNBQXNEO0FBRXRELG1DQUFnQztBQUNoQyxpQ0FBOEI7QUFDOUIsaUdBQWlHO0FBQ2pHLG9DQUFvQztBQUNwQyxtRUFBbUU7QUFDbkUsc0RBQXNEO0FBQ3RELDZEQUE2RDtBQUV0RCxJQUFNLElBQUksR0FBVixNQUFNLElBQUssU0FBUSxhQUFVO0NBdUJuQyxDQUFBO0FBdkJZLG9CQUFJO0FBR2I7SUFGQyxJQUFBLGVBQUssR0FBRTtJQUNQLElBQUEsZ0JBQU0sRUFBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7cUNBQ0o7QUFHdkI7SUFEQyxJQUFBLGdCQUFNLEdBQUU7O3NDQUNRO0FBSWpCO0lBRkMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLFdBQUksRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUMzQyxJQUFBLG9CQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7OEJBQ3JCLFdBQUk7dUNBQVE7QUFHdkI7SUFEQyxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLENBQUMsYUFBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDOzhCQUNoQyxhQUFLO3lDQUFDO0FBSXBCO0lBRkMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLGFBQUssQ0FBQztJQUN0QixJQUFBLG9CQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUM7OEJBQzFCLGFBQUs7bUNBQUM7QUFHYjtJQURDLElBQUEsZ0JBQU0sR0FBRTs7NENBQ2M7ZUFwQmQsSUFBSTtJQURoQixJQUFBLGdCQUFNLEdBQUU7R0FDSSxJQUFJLENBdUJoQiJ9