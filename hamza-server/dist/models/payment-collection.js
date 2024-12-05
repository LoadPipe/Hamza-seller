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
exports.PaymentCollection = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const store_1 = require("./store");
let PaymentCollection = class PaymentCollection extends medusa_1.PaymentCollection {
};
exports.PaymentCollection = PaymentCollection;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', primary: true }),
    __metadata("design:type", String)
], PaymentCollection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: '' }),
    __metadata("design:type", String)
], PaymentCollection.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id', referencedColumnName: 'id' }),
    __metadata("design:type", store_1.Store)
], PaymentCollection.prototype, "store", void 0);
exports.PaymentCollection = PaymentCollection = __decorate([
    (0, typeorm_1.Entity)()
], PaymentCollection);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy9wYXltZW50LWNvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBT2lCO0FBQ2pCLDZDQUFnRjtBQUNoRixtQ0FBZ0M7QUFHekIsSUFBTSxpQkFBaUIsR0FBdkIsTUFBTSxpQkFBa0IsU0FBUSwwQkFBdUI7Q0FVN0QsQ0FBQTtBQVZZLDhDQUFpQjtBQUUxQjtJQURDLElBQUEsdUJBQWEsRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDOzs2Q0FDdkM7QUFHWDtJQURDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDOzttREFDeEI7QUFJakI7SUFGQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsYUFBSyxDQUFDO0lBQ3RCLElBQUEsb0JBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLENBQUM7OEJBQ3JELGFBQUs7Z0RBQUM7NEJBVEwsaUJBQWlCO0lBRDdCLElBQUEsZ0JBQU0sR0FBRTtHQUNJLGlCQUFpQixDQVU3QiJ9