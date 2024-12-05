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
exports.CartEmail = void 0;
const typeorm_1 = require("typeorm");
let CartEmail = class CartEmail extends typeorm_1.BaseEntity {
};
exports.CartEmail = CartEmail;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], CartEmail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_address' }),
    __metadata("design:type", String)
], CartEmail.prototype, "email_address", void 0);
exports.CartEmail = CartEmail = __decorate([
    (0, typeorm_1.Entity)('cart_email')
], CartEmail);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydC1lbWFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvY2FydC1lbWFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBb0U7QUFHN0QsSUFBTSxTQUFTLEdBQWYsTUFBTSxTQUFVLFNBQVEsb0JBQVU7Q0FPeEMsQ0FBQTtBQVBZLDhCQUFTO0FBR2xCO0lBREMsSUFBQSx1QkFBYSxHQUFFOztxQ0FDTDtBQUdYO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxDQUFDOztnREFDWjtvQkFOYixTQUFTO0lBRHJCLElBQUEsZ0JBQU0sRUFBQyxZQUFZLENBQUM7R0FDUixTQUFTLENBT3JCIn0=