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
exports.Wishlist = void 0;
const typeorm_1 = require("typeorm");
const customer_1 = require("@medusajs/medusa/dist/models/customer");
const medusa_1 = require("@medusajs/medusa");
const utils_1 = require("@medusajs/medusa/dist/utils");
const wishlist_item_1 = require("./wishlist-item");
let Wishlist = class Wishlist extends medusa_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.object = 'wishlist';
    }
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, 'wish');
    }
};
exports.Wishlist = Wishlist;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Wishlist.prototype, "customer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_1.Customer)
], Wishlist.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wishlist_item_1.WishlistItem, (wishlistItem) => wishlistItem.wishlist, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Wishlist.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Wishlist.prototype, "beforeInsert", null);
exports.Wishlist = Wishlist = __decorate([
    (0, typeorm_1.Entity)()
], Wishlist);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lzaGxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL3dpc2hsaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHFDQVFpQjtBQUVqQixvRUFBaUU7QUFFakUsNkNBQThDO0FBQzlDLHVEQUErRDtBQUMvRCxtREFBK0M7QUFHeEMsSUFBTSxRQUFRLEdBQWQsTUFBTSxRQUFTLFNBQVEsbUJBQVU7SUFBakM7O1FBQ00sV0FBTSxHQUFHLFVBQVUsQ0FBQztJQW1CakMsQ0FBQztJQUhXLFlBQVk7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFBLHdCQUFnQixFQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNKLENBQUE7QUFwQlksNEJBQVE7QUFLakI7SUFGQyxJQUFBLGVBQUssR0FBRTtJQUNQLElBQUEsZ0JBQU0sRUFBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7NkNBQ1A7QUFJcEI7SUFGQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsbUJBQVEsQ0FBQztJQUN6QixJQUFBLG9CQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUM7OEJBQzFCLG1CQUFROzBDQUFDO0FBS25CO0lBSEMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsRUFBRSxDQUFDLDRCQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUU7UUFDcEUsUUFBUSxFQUFFLFNBQVM7S0FDdEIsQ0FBQzs7dUNBQ29CO0FBR2Q7SUFEUCxJQUFBLHNCQUFZLEdBQUU7Ozs7NENBR2Q7bUJBbkJRLFFBQVE7SUFEcEIsSUFBQSxnQkFBTSxHQUFFO0dBQ0ksUUFBUSxDQW9CcEIifQ==