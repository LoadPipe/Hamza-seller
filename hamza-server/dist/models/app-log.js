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
exports.AppLog = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const utils_1 = require("@medusajs/medusa/dist/utils");
let AppLog = class AppLog extends medusa_1.SoftDeletableEntity {
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, 'log');
    }
};
exports.AppLog = AppLog;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], AppLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id' }),
    __metadata("design:type", String)
], AppLog.prototype, "session_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_id' }),
    __metadata("design:type", String)
], AppLog.prototype, "request_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", String)
], AppLog.prototype, "customer_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'log_level' }),
    __metadata("design:type", String)
], AppLog.prototype, "log_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'text' }),
    __metadata("design:type", String)
], AppLog.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content' }),
    __metadata("design:type", String)
], AppLog.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'timestamp' }),
    __metadata("design:type", Number)
], AppLog.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppLog.prototype, "beforeInsert", null);
exports.AppLog = AppLog = __decorate([
    (0, typeorm_1.Entity)()
], AppLog);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvYXBwLWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBc0U7QUFDdEUsNkNBQXVEO0FBQ3ZELHVEQUErRDtBQUd4RCxJQUFNLE1BQU0sR0FBWixNQUFNLE1BQU8sU0FBUSw0QkFBbUI7SUEwQm5DLFlBQVk7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFBLHdCQUFnQixFQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUNKLENBQUE7QUE3Qlksd0JBQU07QUFFZjtJQURDLElBQUEsdUJBQWEsR0FBRTs7a0NBQ0w7QUFHWDtJQURDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsQ0FBQzs7MENBQ1o7QUFHbkI7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLENBQUM7OzBDQUNaO0FBR25CO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzsyQ0FDWjtBQUdwQjtJQURDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQzs7eUNBQ1o7QUFHbEI7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7O29DQUNaO0FBR2I7SUFEQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7O3VDQUNaO0FBR2hCO0lBREMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDOzt5Q0FDWjtBQUdWO0lBRFAsSUFBQSxzQkFBWSxHQUFFOzs7OzBDQUdkO2lCQTVCUSxNQUFNO0lBRGxCLElBQUEsZ0JBQU0sR0FBRTtHQUNJLE1BQU0sQ0E2QmxCIn0=