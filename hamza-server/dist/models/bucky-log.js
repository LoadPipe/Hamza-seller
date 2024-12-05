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
exports.BuckyLog = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const utils_1 = require("@medusajs/medusa/dist/utils");
// - endpoint: string → the url endpoint (e.g. /api/v1/order/details)
// - input: jsonb → the json that we sent in the request
// - output: jsonb → the response that came back
// - context: jsonb → optional, leave blank for now. This I expect we will use to indicate from where, for what customer, etc.
let BuckyLog = class BuckyLog extends medusa_1.SoftDeletableEntity {
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, 'log');
    }
};
exports.BuckyLog = BuckyLog;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], BuckyLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'endpoint' }),
    __metadata("design:type", String)
], BuckyLog.prototype, "endpoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'input', type: 'jsonb' }),
    __metadata("design:type", Object)
], BuckyLog.prototype, "input", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'output', type: 'jsonb' }),
    __metadata("design:type", Object)
], BuckyLog.prototype, "output", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'context', type: 'jsonb' }),
    __metadata("design:type", Object)
], BuckyLog.prototype, "context", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BuckyLog.prototype, "beforeInsert", null);
exports.BuckyLog = BuckyLog = __decorate([
    (0, typeorm_1.Entity)('bucky_logs')
], BuckyLog);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja3ktbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy9idWNreS1sb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEscUNBQXNFO0FBQ3RFLDZDQUF1RDtBQUN2RCx1REFBK0Q7QUFFL0QscUVBQXFFO0FBQ3JFLHdEQUF3RDtBQUN4RCxnREFBZ0Q7QUFDaEQsOEhBQThIO0FBR3ZILElBQU0sUUFBUSxHQUFkLE1BQU0sUUFBUyxTQUFRLDRCQUFtQjtJQW1CckMsWUFBWTtRQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUEsd0JBQWdCLEVBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0osQ0FBQTtBQXRCWSw0QkFBUTtBQUVqQjtJQURDLElBQUEsdUJBQWEsR0FBRTs7b0NBQ0w7QUFHWDtJQURDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQzs7MENBQ1o7QUFLakI7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQzs7dUNBQzlCO0FBR1g7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQzs7d0NBQzdCO0FBR2I7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQzs7eUNBQzdCO0FBR047SUFEUCxJQUFBLHNCQUFZLEdBQUU7Ozs7NENBR2Q7bUJBckJRLFFBQVE7SUFEcEIsSUFBQSxnQkFBTSxFQUFDLFlBQVksQ0FBQztHQUNSLFFBQVEsQ0FzQnBCIn0=