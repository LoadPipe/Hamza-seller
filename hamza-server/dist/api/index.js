"use strict";
// DOCS: https://docs.medusajs.com/development/api-routes/extend-validator
// Creating extended validators to add new properties
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
exports.StorePostAuthReq = void 0;
const medusa_1 = require("@medusajs/medusa");
const auth_1 = require("@medusajs/medusa/dist/api/routes/store/auth");
const class_validator_1 = require("class-validator");
class StorePostAuthReq extends auth_1.StorePostAuthReq {
}
exports.StorePostAuthReq = StorePostAuthReq;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorePostAuthReq.prototype, "wallet_address", void 0);
(0, medusa_1.registerOverriddenValidators)(StorePostAuthReq);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwRUFBMEU7QUFDMUUscURBQXFEOzs7Ozs7Ozs7Ozs7QUFFckQsNkNBQWdFO0FBQ2hFLHNFQUF5RztBQUN6RyxxREFBMkM7QUFFM0MsTUFBYSxnQkFBaUIsU0FBUSx1QkFBc0I7Q0FHM0Q7QUFIRCw0Q0FHQztBQURHO0lBREMsSUFBQSwwQkFBUSxHQUFFOzt3REFDWTtBQUczQixJQUFBLHFDQUE0QixFQUFDLGdCQUFnQixDQUFDLENBQUMifQ==