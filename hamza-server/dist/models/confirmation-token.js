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
exports.ConfirmationToken = void 0;
const typeorm_1 = require("typeorm");
const customer_1 = require("./customer");
let ConfirmationToken = class ConfirmationToken {
};
exports.ConfirmationToken = ConfirmationToken;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], ConfirmationToken.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ConfirmationToken.prototype, "email_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ConfirmationToken.prototype, "redeemed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 3 }),
    __metadata("design:type", Number)
], ConfirmationToken.prototype, "expiration_hours", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_1.Customer, (customer) => customer.walletAddresses, {
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_1.Customer)
], ConfirmationToken.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'customer_id' }),
    __metadata("design:type", String)
], ConfirmationToken.prototype, "customer_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ConfirmationToken.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ConfirmationToken.prototype, "updated_at", void 0);
exports.ConfirmationToken = ConfirmationToken = __decorate([
    (0, typeorm_1.Entity)({ name: 'confirmation_token' })
], ConfirmationToken);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlybWF0aW9uLXRva2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy9jb25maXJtYXRpb24tdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBU2lCO0FBR2pCLHlDQUFzQztBQUcvQixJQUFNLGlCQUFpQixHQUF2QixNQUFNLGlCQUFpQjtDQTJCN0IsQ0FBQTtBQTNCWSw4Q0FBaUI7QUFFMUI7SUFEQyxJQUFBLHVCQUFhLEdBQUU7O2dEQUNGO0FBR2Q7SUFEQyxJQUFBLGdCQUFNLEdBQUU7O3dEQUNhO0FBR3RCO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDOzttREFDVDtBQUdsQjtJQURDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQzs7MkRBQ0U7QUFNekI7SUFKQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsbUJBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUMvRCxRQUFRLEVBQUUsS0FBSztLQUNsQixDQUFDO0lBQ0QsSUFBQSxvQkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzhCQUMxQixtQkFBUTttREFBQztBQUduQjtJQURDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOztzREFDN0I7QUFHcEI7SUFEQyxJQUFBLDBCQUFnQixFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzhCQUM5QixJQUFJO3FEQUFDO0FBR2pCO0lBREMsSUFBQSwwQkFBZ0IsRUFBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQzs4QkFDOUIsSUFBSTtxREFBQzs0QkExQlIsaUJBQWlCO0lBRDdCLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxDQUFDO0dBQzFCLGlCQUFpQixDQTJCN0IifQ==