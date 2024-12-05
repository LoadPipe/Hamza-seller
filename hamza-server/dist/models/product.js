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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const store_1 = require("./store");
const product_review_1 = require("./product-review");
let Product = class Product extends medusa_1.Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: '' }),
    __metadata("design:type", String)
], Product.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_review_1.ProductReview, (review) => review.product),
    __metadata("design:type", Array)
], Product.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id', referencedColumnName: 'id' }),
    __metadata("design:type", store_1.Store)
], Product.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "massmarket_prod_id", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], Product.prototype, "bucky_metadata", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)()
], Product);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcHJvZHVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FPaUI7QUFDakIsNkNBRzBCO0FBQzFCLG1DQUFnQztBQUNoQyxxREFBaUQ7QUFHMUMsSUFBTSxPQUFPLEdBQWIsTUFBTSxPQUFRLFNBQVEsZ0JBQWE7Q0FnQnpDLENBQUE7QUFoQlksMEJBQU87QUFFaEI7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQzs7eUNBQ3hCO0FBR2pCO0lBREMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLDhCQUFhLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7O3dDQUNsQztBQUl6QjtJQUZDLElBQUEsbUJBQVMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxhQUFLLENBQUM7SUFDdEIsSUFBQSxvQkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsQ0FBQzs4QkFDckQsYUFBSztzQ0FBQztBQUdkO0lBREMsSUFBQSxnQkFBTSxHQUFFOzttREFDbUI7QUFHNUI7SUFEQyxJQUFBLGdCQUFNLEVBQUMsT0FBTyxDQUFDOzsrQ0FDeUI7a0JBZmhDLE9BQU87SUFEbkIsSUFBQSxnQkFBTSxHQUFFO0dBQ0ksT0FBTyxDQWdCbkIifQ==