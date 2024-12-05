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
exports.CustomerNotification = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const utils_1 = require("@medusajs/medusa/dist/utils");
const customer_1 = require("@medusajs/medusa/dist/models/customer");
let CustomerNotification = class CustomerNotification extends medusa_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.object = 'customer_notification';
    }
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, 'notification');
    }
};
exports.CustomerNotification = CustomerNotification;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], CustomerNotification.prototype, "customer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_1.Customer)
], CustomerNotification.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notification_type' }),
    __metadata("design:type", String)
], CustomerNotification.prototype, "notification_type", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CustomerNotification.prototype, "beforeInsert", null);
exports.CustomerNotification = CustomerNotification = __decorate([
    (0, typeorm_1.Entity)()
], CustomerNotification);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItbm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy9jdXN0b21lci1ub3RpZmljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBT2lCO0FBQ2pCLDZDQUE4QztBQUM5Qyx1REFBK0Q7QUFDL0Qsb0VBQWlFO0FBRzFELElBQU0sb0JBQW9CLEdBQTFCLE1BQU0sb0JBQXFCLFNBQVEsbUJBQVU7SUFBN0M7O1FBQ00sV0FBTSxHQUFHLHVCQUF1QixDQUFDO0lBaUI5QyxDQUFDO0lBSFcsWUFBWTtRQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUEsd0JBQWdCLEVBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0osQ0FBQTtBQWxCWSxvREFBb0I7QUFLN0I7SUFGQyxJQUFBLGVBQUssR0FBRTtJQUNQLElBQUEsZ0JBQU0sRUFBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQzs7eURBQ1I7QUFJcEI7SUFGQyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxFQUFFLENBQUMsbUJBQVEsQ0FBQztJQUN6QixJQUFBLG9CQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUM7OEJBQzFCLG1CQUFRO3NEQUFDO0FBR25CO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLENBQUM7OytEQUNaO0FBR2xCO0lBRFAsSUFBQSxzQkFBWSxHQUFFOzs7O3dEQUdkOytCQWpCUSxvQkFBb0I7SUFEaEMsSUFBQSxnQkFBTSxHQUFFO0dBQ0ksb0JBQW9CLENBa0JoQyJ9