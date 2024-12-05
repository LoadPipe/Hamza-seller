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
exports.CachedExchangeRate = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const utils_1 = require("@medusajs/medusa/dist/utils");
// cached_exchange_rate
//
// - currency_code: FK to currency table (unique)
// - rate: number (floating point)
// - date_cached
let CachedExchangeRate = class CachedExchangeRate extends medusa_1.BaseEntity {
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, 'cached-exchange-rate');
    }
};
exports.CachedExchangeRate = CachedExchangeRate;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], CachedExchangeRate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medusa_1.Currency),
    (0, typeorm_1.JoinColumn)({ name: 'from_currency_code' }),
    __metadata("design:type", String)
], CachedExchangeRate.prototype, "from_currency_code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => medusa_1.Currency),
    (0, typeorm_1.JoinColumn)({ name: 'to_currency_code' }),
    __metadata("design:type", String)
], CachedExchangeRate.prototype, "to_currency_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rate', type: 'float' }),
    __metadata("design:type", Number)
], CachedExchangeRate.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CachedExchangeRate.prototype, "beforeInsert", null);
exports.CachedExchangeRate = CachedExchangeRate = __decorate([
    (0, typeorm_1.Entity)()
], CachedExchangeRate);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGVkLWV4Y2hhbmdlLXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL2NhY2hlZC1leGNoYW5nZS1yYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQVFpQjtBQUNqQiw2Q0FBd0Q7QUFDeEQsdURBQStEO0FBRS9ELHVCQUF1QjtBQUN2QixFQUFFO0FBQ0YsaURBQWlEO0FBQ2pELGtDQUFrQztBQUNsQyxnQkFBZ0I7QUFHVCxJQUFNLGtCQUFrQixHQUF4QixNQUFNLGtCQUFtQixTQUFRLG1CQUFVO0lBZ0J0QyxZQUFZO1FBQ2hCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBQSx3QkFBZ0IsRUFBQyxJQUFJLENBQUMsRUFBRSxFQUFFLHNCQUFzQixDQUFDLENBQUM7SUFDaEUsQ0FBQztDQUNKLENBQUE7QUFuQlksZ0RBQWtCO0FBRTNCO0lBREMsSUFBQSx1QkFBYSxHQUFFOzs4Q0FDTDtBQUlYO0lBRkMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLGlCQUFRLENBQUM7SUFDekIsSUFBQSxvQkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLENBQUM7OzhEQUNoQjtBQUkzQjtJQUZDLElBQUEsbUJBQVMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBUSxDQUFDO0lBQ3pCLElBQUEsb0JBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxDQUFDOzs0REFDaEI7QUFHekI7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQzs7Z0RBQzNCO0FBR0w7SUFEUCxJQUFBLHNCQUFZLEdBQUU7Ozs7c0RBR2Q7NkJBbEJRLGtCQUFrQjtJQUQ5QixJQUFBLGdCQUFNLEdBQUU7R0FDSSxrQkFBa0IsQ0FtQjlCIn0=