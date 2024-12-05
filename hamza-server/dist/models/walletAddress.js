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
exports.WalletAddress = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const utils_1 = require("@medusajs/medusa/dist/utils");
let WalletAddress = class WalletAddress extends medusa_1.SoftDeletableEntity {
    // @ManyToOne(() => User, user => user.walletAddresses)
    // user!: User;
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, 'walletAddress');
    }
};
exports.WalletAddress = WalletAddress;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], WalletAddress.prototype, "walletAddress", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WalletAddress.prototype, "beforeInsert", null);
exports.WalletAddress = WalletAddress = __decorate([
    (0, typeorm_1.Entity)()
], WalletAddress);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0QWRkcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvd2FsbGV0QWRkcmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBa0U7QUFDbEUsNkNBQXVEO0FBQ3ZELHVEQUErRDtBQUt4RCxJQUFNLGFBQWEsR0FBbkIsTUFBTSxhQUFjLFNBQVEsNEJBQW1CO0lBS2xELHVEQUF1RDtJQUN2RCxlQUFlO0lBR1AsWUFBWTtRQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUEsd0JBQWdCLEVBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN6RCxDQUFDO0NBQ0osQ0FBQTtBQVpZLHNDQUFhO0FBR3RCO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDOztvREFDRjtBQU1mO0lBRFAsSUFBQSxzQkFBWSxHQUFFOzs7O2lEQUdkO3dCQVhRLGFBQWE7SUFEekIsSUFBQSxnQkFBTSxHQUFFO0dBQ0ksYUFBYSxDQVl6QiJ9