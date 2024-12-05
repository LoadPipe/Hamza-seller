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
exports.OrderHistory = void 0;
const typeorm_1 = require("typeorm");
const utils_1 = require("@medusajs/medusa/dist/utils");
let OrderHistory = class OrderHistory extends typeorm_1.BaseEntity {
    constructor() {
        super();
        if (!this.id)
            this.beforeInsert();
    }
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, 'hist');
    }
};
exports.OrderHistory = OrderHistory;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], OrderHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", String)
], OrderHistory.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title' }),
    __metadata("design:type", String)
], OrderHistory.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_status' }),
    __metadata("design:type", String)
], OrderHistory.prototype, "to_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_payment_status' }),
    __metadata("design:type", String)
], OrderHistory.prototype, "to_payment_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_fulfillment_status' }),
    __metadata("design:type", String)
], OrderHistory.prototype, "to_fulfillment_status", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], OrderHistory.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderHistory.prototype, "beforeInsert", null);
exports.OrderHistory = OrderHistory = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [])
], OrderHistory);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItaGlzdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvb3JkZXItaGlzdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FNaUI7QUFDakIsdURBQStEO0FBUXhELElBQU0sWUFBWSxHQUFsQixNQUFNLFlBQWEsU0FBUSxvQkFBVTtJQUN4QztRQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUF3Qk8sWUFBWTtRQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUEsd0JBQWdCLEVBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0osQ0FBQTtBQS9CWSxvQ0FBWTtBQU9yQjtJQURDLElBQUEsdUJBQWEsR0FBRTs7d0NBQ0w7QUFHWDtJQURDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQzs7OENBQ1o7QUFHakI7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7OzJDQUNaO0FBR2Q7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7OytDQUNaO0FBR2xCO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLENBQUM7O3VEQUNaO0FBRzFCO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLENBQUM7OzJEQUNaO0FBRzlCO0lBREMsSUFBQSxnQkFBTSxFQUFDLE9BQU8sQ0FBQzs7OENBQ21CO0FBRzNCO0lBRFAsSUFBQSxzQkFBWSxHQUFFOzs7O2dEQUdkO3VCQTlCUSxZQUFZO0lBRHhCLElBQUEsZ0JBQU0sR0FBRTs7R0FDSSxZQUFZLENBK0J4QiJ9