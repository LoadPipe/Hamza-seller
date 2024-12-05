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
exports.WhiteList = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
let WhiteList = class WhiteList extends medusa_1.SoftDeletableEntity {
};
exports.WhiteList = WhiteList;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WhiteList.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WhiteList.prototype, "wallet_address", void 0);
exports.WhiteList = WhiteList = __decorate([
    (0, typeorm_1.Entity)()
], WhiteList);
/*
@Entity()
@Unique(['whitelist_id', 'customer_address'])
export class WhitelistItem extends BaseEntity {
    @Column()
    whitelist_id: string;

    @ManyToOne(() => WhiteList, (whitelist) => whitelist.items)
    @JoinColumn({ name: 'whitelist_id' })
    whitelist: WhiteList;

    @Column()
    customer_address: string;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'wi');
    }
}
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hpdGVsaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy93aGl0ZWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBSWlCO0FBQ2pCLDZDQUF1RDtBQUtoRCxJQUFNLFNBQVMsR0FBZixNQUFNLFNBQVUsU0FBUSw0QkFBbUI7Q0FXakQsQ0FBQTtBQVhZLDhCQUFTO0FBRWxCO0lBREMsSUFBQSxnQkFBTSxHQUFFOzsyQ0FDUTtBQUdqQjtJQURDLElBQUEsZ0JBQU0sR0FBRTs7aURBQ2M7b0JBTGQsU0FBUztJQURyQixJQUFBLGdCQUFNLEdBQUU7R0FDSSxTQUFTLENBV3JCO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFtQkUifQ==