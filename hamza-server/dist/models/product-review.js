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
exports.ProductReview = void 0;
const medusa_1 = require("@medusajs/medusa");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const utils_1 = require("@medusajs/medusa/dist/utils");
const order_1 = require("./order");
const customer_1 = require("@medusajs/medusa/dist/models/customer");
const product_1 = require("./product");
let ProductReview = class ProductReview extends medusa_1.BaseEntity {
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, 'prev');
    }
};
exports.ProductReview = ProductReview;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ProductReview.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_1.Product)
], ProductReview.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], ProductReview.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductReview.prototype, "customer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_1.Customer)
], ProductReview.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductReview.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_1.Order),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_1.Order)
], ProductReview.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], ProductReview.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], ProductReview.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductReview.prototype, "beforeInsert", null);
exports.ProductReview = ProductReview = __decorate([
    (0, typeorm_1.Entity)()
], ProductReview);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1yZXZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL3Byb2R1Y3QtcmV2aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDZDQUE4QztBQUM5QyxxQ0FPaUI7QUFDakIscURBQTJDO0FBQzNDLHVEQUErRDtBQUMvRCxtQ0FBZ0M7QUFDaEMsb0VBQWlFO0FBQ2pFLHVDQUFvQztBQUc3QixJQUFNLGFBQWEsR0FBbkIsTUFBTSxhQUFjLFNBQVEsbUJBQVU7SUFxQ2pDLFlBQVk7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFBLHdCQUFnQixFQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNKLENBQUE7QUF4Q1ksc0NBQWE7QUFHdEI7SUFGQyxJQUFBLGVBQUssR0FBRTtJQUNQLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztpREFDekI7QUFJbkI7SUFGQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsaUJBQU8sQ0FBQztJQUN4QixJQUFBLG9CQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLENBQUM7OEJBQzFCLGlCQUFPOzhDQUFDO0FBR2pCO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7OzRDQUMvQjtBQUlkO0lBRkMsSUFBQSxlQUFLLEdBQUU7SUFDUCxJQUFBLGdCQUFNLEVBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7O2tEQUNQO0FBSXBCO0lBRkMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFRLENBQUM7SUFDekIsSUFBQSxvQkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzhCQUMxQixtQkFBUTsrQ0FBQztBQUluQjtJQUZDLElBQUEsZUFBSyxHQUFFO0lBQ1AsSUFBQSxnQkFBTSxFQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOzsrQ0FDVjtBQUlqQjtJQUZDLElBQUEsbUJBQVMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxhQUFLLENBQUM7SUFDdEIsSUFBQSxvQkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDOzhCQUMxQixhQUFLOzRDQUFDO0FBS2I7SUFIQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDdkIsSUFBQSxxQkFBRyxFQUFDLENBQUMsQ0FBQztJQUNOLElBQUEscUJBQUcsRUFBQyxDQUFDLENBQUM7OzZDQUNRO0FBR2Y7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7OzhDQUNaO0FBR1I7SUFEUCxJQUFBLHNCQUFZLEdBQUU7Ozs7aURBR2Q7d0JBdkNRLGFBQWE7SUFEekIsSUFBQSxnQkFBTSxHQUFFO0dBQ0ksYUFBYSxDQXdDekIifQ==