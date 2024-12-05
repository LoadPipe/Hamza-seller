"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStoreIdToDiscount1714992866655 = void 0;
class AddStoreIdToDiscount1714992866655 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "discount"
                ADD "store_id" character varying`);
        await queryRunner.query(`CREATE INDEX "DiscountStoreId" ON "discount" ("store_id")`);
        await queryRunner.query(`ALTER TABLE "discount"
                ADD CONSTRAINT "fk_discount_store" FOREIGN KEY ("store_id") REFERENCES "store"("id")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."DiscountStoreId"`);
        await queryRunner.query(`ALTER TABLE "discount"
            DROP COLUMN "store_id"`);
        await queryRunner.query(`ALTER TABLE "discount"
                DROP CONSTRAINT "fk_discount_store"`);
    }
}
exports.AddStoreIdToDiscount1714992866655 = AddStoreIdToDiscount1714992866655;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxNDk5Mjg2NjY1NS1BZGRTdG9yZUlkVG9EaXNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWdyYXRpb25zLzE3MTQ5OTI4NjY2NTUtQWRkU3RvcmVJZFRvRGlzY291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxpQ0FBaUM7SUFDbkMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUF3QjtRQUNwQyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CO2lEQUNxQyxDQUN4QyxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQiwyREFBMkQsQ0FDOUQsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkI7cUdBQ3lGLENBQzVGLENBQUM7SUFDTixDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN0QyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztRQUNqRSxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUM7bUNBQ0csQ0FBQyxDQUFDO1FBQzdCLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkI7b0RBQ3dDLENBQzNDLENBQUM7SUFDTixDQUFDO0NBQ0o7QUF4QkQsOEVBd0JDIn0=