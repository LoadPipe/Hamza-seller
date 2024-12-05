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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const customer_wallet_address_1 = require("./customer-wallet-address");
const customer_notification_1 = require("./customer-notification");
let Customer = class Customer extends medusa_1.Customer {
    assignRandomCurrency() {
        //const currencies = ['eth', 'usdt', 'usdc'];
        this.preferred_currency_id = 'usdt'; //currencies[Math.floor(Math.random() * currencies.length)];
    }
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_verified", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => medusa_1.Currency, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'preferred_currency_id' }),
    __metadata("design:type", medusa_1.Currency)
], Customer.prototype, "preferred_currency", void 0);
__decorate([
    (0, typeorm_1.Column)('preferred_currency_id'),
    __metadata("design:type", String)
], Customer.prototype, "preferred_currency_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_wallet_address_1.CustomerWalletAddress, (walletAddress) => walletAddress.customer),
    __metadata("design:type", Array)
], Customer.prototype, "walletAddresses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_notification_1.CustomerNotification, (notification) => notification.customer),
    __metadata("design:type", Array)
], Customer.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Customer.prototype, "assignRandomCurrency", null);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)()
], Customer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL2N1c3RvbWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQU9pQjtBQUNqQiw2Q0FJMEI7QUFDMUIsdUVBQWtFO0FBQ2xFLG1FQUErRDtBQUd4RCxJQUFNLFFBQVEsR0FBZCxNQUFNLFFBQVMsU0FBUSxpQkFBYztJQTJCaEMsb0JBQW9CO1FBQ3hCLDZDQUE2QztRQUM3QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLENBQUMsNERBQTREO0lBQ3JHLENBQUM7Q0FDSixDQUFBO0FBL0JZLDRCQUFRO0FBRWpCO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7OzZDQUN2QjtBQU9yQjtJQUZDLElBQUEsbUJBQVMsRUFBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsaUJBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNqRCxJQUFBLG9CQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQzs4QkFDekIsaUJBQVE7b0RBQUM7QUFHOUI7SUFEQyxJQUFBLGdCQUFNLEVBQUMsdUJBQXVCLENBQUM7O3VEQUNEO0FBTS9CO0lBSkMsSUFBQSxtQkFBUyxFQUNOLEdBQUcsRUFBRSxDQUFDLCtDQUFxQixFQUMzQixDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FDNUM7O2lEQUN3QztBQU16QztJQUpDLElBQUEsbUJBQVMsRUFDTixHQUFHLEVBQUUsQ0FBQyw0Q0FBb0IsRUFDMUIsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQzFDOzsrQ0FDcUM7QUFHOUI7SUFEUCxJQUFBLHNCQUFZLEdBQUU7Ozs7b0RBSWQ7bUJBOUJRLFFBQVE7SUFEcEIsSUFBQSxnQkFBTSxHQUFFO0dBQ0ksUUFBUSxDQStCcEIifQ==