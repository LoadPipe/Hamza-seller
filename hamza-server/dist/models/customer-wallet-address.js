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
exports.CustomerWalletAddress = void 0;
const typeorm_1 = require("typeorm");
const customer_1 = require("./customer");
let CustomerWalletAddress = class CustomerWalletAddress {
};
exports.CustomerWalletAddress = CustomerWalletAddress;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', primary: true }),
    __metadata("design:type", String)
], CustomerWalletAddress.prototype, "wallet_address", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_1.Customer, customer => customer.walletAddresses, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_1.Customer)
], CustomerWalletAddress.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'customer_id' }),
    __metadata("design:type", String)
], CustomerWalletAddress.prototype, "customer_id", void 0);
exports.CustomerWalletAddress = CustomerWalletAddress = __decorate([
    (0, typeorm_1.Entity)()
], CustomerWalletAddress);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItd2FsbGV0LWFkZHJlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL2N1c3RvbWVyLXdhbGxldC1hZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQUErRTtBQUUvRSx5Q0FBcUM7QUFHOUIsSUFBTSxxQkFBcUIsR0FBM0IsTUFBTSxxQkFBcUI7Q0FVakMsQ0FBQTtBQVZZLHNEQUFxQjtBQUU5QjtJQURDLElBQUEsdUJBQWEsRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDOzs2REFDM0I7QUFJdkI7SUFGQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsbUJBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDcEYsSUFBQSxvQkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzhCQUMxQixtQkFBUTt1REFBQztBQUduQjtJQURDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzswREFDN0I7Z0NBVFgscUJBQXFCO0lBRGpDLElBQUEsZ0JBQU0sR0FBRTtHQUNJLHFCQUFxQixDQVVqQyJ9