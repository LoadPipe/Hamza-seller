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
exports.PriceList = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const store_1 = require("./store");
let PriceList = class PriceList extends medusa_1.PriceList {
};
exports.PriceList = PriceList;
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: '' }),
    __metadata("design:type", String)
], PriceList.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id', referencedColumnName: 'id' }),
    __metadata("design:type", store_1.Store)
], PriceList.prototype, "store", void 0);
exports.PriceList = PriceList = __decorate([
    (0, typeorm_1.Entity)()
], PriceList);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2UtbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcHJpY2UtbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBdUU7QUFDdkUsNkNBRzBCO0FBQzFCLG1DQUFnQztBQUd6QixJQUFNLFNBQVMsR0FBZixNQUFNLFNBQVUsU0FBUSxrQkFBZTtDQU83QyxDQUFBO0FBUFksOEJBQVM7QUFFbEI7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQzs7MkNBQ3hCO0FBSWpCO0lBRkMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLGFBQUssQ0FBQztJQUN0QixJQUFBLG9CQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxDQUFDOzhCQUNyRCxhQUFLO3dDQUFDO29CQU5MLFNBQVM7SUFEckIsSUFBQSxnQkFBTSxHQUFFO0dBQ0ksU0FBUyxDQU9yQiJ9