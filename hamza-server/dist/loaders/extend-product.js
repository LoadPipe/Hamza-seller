"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
async function default_1() {
    const imports = (await Promise.resolve().then(() => __importStar(require('@medusajs/medusa/dist/api/routes/store/products/index'))));
    imports.allowedStoreProductsFields = [
        ...imports.allowedStoreProductsFields,
        'store_id',
    ];
    imports.defaultStoreProductsFields = [
        ...imports.defaultStoreProductsFields,
        'store_id',
    ];
}
// export default async function () {
//   const imports = (await import(
//     "@medusajs/medusa/dist/api/routes/admin/products/index"
//   )) as any;
//   imports.allowedAdminProductsFields = [
//     ...imports.allowedAdminProductsFields,
//     "store_id",
//   ];
//   imports.defaultAdminProductsFields = [
//     ...imports.defaultAdminProductsFields,
//     "store_id",
//   ];
// }
// ^^ This works for adding store_id to the /store route but following
// the same pattern for /admin route doesn't work. This is because the
// /admin route is not using the registerOverriddenValidators function?
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kLXByb2R1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbG9hZGVycy9leHRlbmQtcHJvZHVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNEJBWUM7QUFaYyxLQUFLO0lBQ2hCLE1BQU0sT0FBTyxHQUFHLENBQUMsd0RBQ2IsdURBQXVELEdBQzFELENBQVEsQ0FBQztJQUNWLE9BQU8sQ0FBQywwQkFBMEIsR0FBRztRQUNqQyxHQUFHLE9BQU8sQ0FBQywwQkFBMEI7UUFDckMsVUFBVTtLQUNiLENBQUM7SUFDRixPQUFPLENBQUMsMEJBQTBCLEdBQUc7UUFDakMsR0FBRyxPQUFPLENBQUMsMEJBQTBCO1FBQ3JDLFVBQVU7S0FDYixDQUFDO0FBQ04sQ0FBQztBQUVELHFDQUFxQztBQUNyQyxtQ0FBbUM7QUFDbkMsOERBQThEO0FBQzlELGVBQWU7QUFDZiwyQ0FBMkM7QUFDM0MsNkNBQTZDO0FBQzdDLGtCQUFrQjtBQUNsQixPQUFPO0FBQ1AsMkNBQTJDO0FBQzNDLDZDQUE2QztBQUM3QyxrQkFBa0I7QUFDbEIsT0FBTztBQUNQLElBQUk7QUFFSixzRUFBc0U7QUFDdEUsc0VBQXNFO0FBQ3RFLHVFQUF1RSJ9