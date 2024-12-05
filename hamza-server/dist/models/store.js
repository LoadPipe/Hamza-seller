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
exports.Store = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const user_1 = require("./user");
let Store = class Store extends medusa_1.Store {
    get numberOfFollowers() {
        // Hard-coded value for now
        return 100;
    }
};
exports.Store = Store;
__decorate([
    (0, typeorm_1.OneToOne)(() => user_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_1.User)
], Store.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_1.User, (user) => user.store, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Store.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('owner_id'),
    __metadata("design:type", String)
], Store.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Store.prototype, "escrow_contract_address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Store.prototype, "massmarket_store_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Store.prototype, "store_description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Store.prototype, "store_followers", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Store.prototype, "massmarket_keycard", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Store.prototype, "icon", void 0);
exports.Store = Store = __decorate([
    (0, typeorm_1.Entity)()
], Store);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL3N0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQUEwRTtBQUMxRSw2Q0FBd0Q7QUFDeEQsaUNBQThCO0FBR3ZCLElBQU0sS0FBSyxHQUFYLE1BQU0sS0FBTSxTQUFRLGNBQVc7SUFtQ2xDLElBQUksaUJBQWlCO1FBQ2pCLDJCQUEyQjtRQUMzQixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FDSixDQUFBO0FBdkNZLHNCQUFLO0FBR2Q7SUFGQyxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLENBQUMsV0FBSSxDQUFDO0lBQ3BCLElBQUEsb0JBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQzs4QkFDekIsV0FBSTtvQ0FBQztBQUtiO0lBSEMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLFdBQUksRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUN6QyxRQUFRLEVBQUUsU0FBUztLQUN0QixDQUFDOztvQ0FDYTtBQUlmO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7O21DQUM3QjtBQUdiO0lBREMsSUFBQSxnQkFBTSxFQUFDLFVBQVUsQ0FBQzs7dUNBQ0Q7QUFHbEI7SUFEQyxJQUFBLGdCQUFNLEdBQUU7O3NEQUN3QjtBQUdqQztJQURDLElBQUEsZ0JBQU0sR0FBRTs7a0RBQ29CO0FBRzdCO0lBREMsSUFBQSxnQkFBTSxHQUFFOztnREFDa0I7QUFHM0I7SUFEQyxJQUFBLGdCQUFNLEdBQUU7OzhDQUNnQjtBQUd6QjtJQURDLElBQUEsZ0JBQU0sR0FBRTs7aURBQ21CO0FBRzVCO0lBREMsSUFBQSxnQkFBTSxHQUFFOzttQ0FDSTtnQkFqQ0osS0FBSztJQURqQixJQUFBLGdCQUFNLEdBQUU7R0FDSSxLQUFLLENBdUNqQiJ9