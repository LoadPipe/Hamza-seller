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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const store_1 = require("./store");
let Order = class Order extends medusa_1.Order {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.OneToOne)(() => store_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_1.Store)
], Order.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)('store_id'),
    __metadata("design:type", String)
], Order.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "massmarket_order_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "massmarket_ttl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "massmarket_amount", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], Order.prototype, "bucky_metadata", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)()
], Order);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL29yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQUErRDtBQUMvRCw2Q0FBd0Q7QUFFeEQsbUNBQWdDO0FBR3pCLElBQU0sS0FBSyxHQUFYLE1BQU0sS0FBTSxTQUFRLGNBQVc7Q0FtQnJDLENBQUE7QUFuQlksc0JBQUs7QUFHZDtJQUZDLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsQ0FBQyxhQUFLLENBQUM7SUFDckIsSUFBQSxvQkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDOzhCQUN6QixhQUFLO29DQUFDO0FBR2Q7SUFEQyxJQUFBLGdCQUFNLEVBQUMsVUFBVSxDQUFDOzt1Q0FDRDtBQUdsQjtJQURDLElBQUEsZ0JBQU0sR0FBRTs7a0RBQ29CO0FBRzdCO0lBREMsSUFBQSxnQkFBTSxHQUFFOzs2Q0FDZTtBQUd4QjtJQURDLElBQUEsZ0JBQU0sR0FBRTs7Z0RBQ2tCO0FBRzNCO0lBREMsSUFBQSxnQkFBTSxFQUFDLE9BQU8sQ0FBQzs7NkNBQ3lCO2dCQWxCaEMsS0FBSztJQURqQixJQUFBLGdCQUFNLEdBQUU7R0FDSSxLQUFLLENBbUJqQiJ9