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
exports.WishlistItem = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const utils_1 = require("@medusajs/medusa/dist/utils");
const product_variant_1 = require("./product-variant");
const wishlist_1 = require("./wishlist");
let WishlistItem = class WishlistItem extends medusa_1.BaseEntity {
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, 'item');
    }
};
exports.WishlistItem = WishlistItem;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WishlistItem.prototype, "wishlist_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => wishlist_1.Wishlist, (wishlist) => wishlist.items),
    (0, typeorm_1.JoinColumn)({ name: 'wishlist_id' }),
    __metadata("design:type", wishlist_1.Wishlist)
], WishlistItem.prototype, "wishlist", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WishlistItem.prototype, "variant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_1.ProductVariant)
], WishlistItem.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WishlistItem.prototype, "beforeInsert", null);
exports.WishlistItem = WishlistItem = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['wishlist_id', 'variant_id'])
], WishlistItem);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lzaGxpc3QtaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvd2lzaGxpc3QtaXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FPaUI7QUFDakIsNkNBQThDO0FBQzlDLHVEQUErRDtBQUMvRCx1REFBbUQ7QUFDbkQseUNBQXNDO0FBSS9CLElBQU0sWUFBWSxHQUFsQixNQUFNLFlBQWEsU0FBUSxtQkFBVTtJQWdCaEMsWUFBWTtRQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUEsd0JBQWdCLEVBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0osQ0FBQTtBQW5CWSxvQ0FBWTtBQUVyQjtJQURDLElBQUEsZ0JBQU0sR0FBRTs7aURBQ1c7QUFJcEI7SUFGQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsbUJBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUN2RCxJQUFBLG9CQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUM7OEJBQzFCLG1CQUFROzhDQUFDO0FBR25CO0lBREMsSUFBQSxnQkFBTSxHQUFFOztnREFDVTtBQUluQjtJQUZDLElBQUEsbUJBQVMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxnQ0FBYyxDQUFDO0lBQy9CLElBQUEsb0JBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsQ0FBQzs4QkFDMUIsZ0NBQWM7NkNBQUM7QUFHaEI7SUFEUCxJQUFBLHNCQUFZLEdBQUU7Ozs7Z0RBR2Q7dUJBbEJRLFlBQVk7SUFGeEIsSUFBQSxnQkFBTSxHQUFFO0lBQ1IsSUFBQSxnQkFBTSxFQUFDLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO0dBQ3pCLFlBQVksQ0FtQnhCIn0=