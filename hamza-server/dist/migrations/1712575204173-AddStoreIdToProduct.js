"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStoreIdToProduct1712575204173 = void 0;
class AddStoreIdToProduct1712575204173 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "product"
                ADD "store_id" character varying`);
        await queryRunner.query(`CREATE INDEX "ProductStoreId" ON "product" ("store_id")`);
        await queryRunner.query(`ALTER TABLE "product"
                ADD CONSTRAINT "fk_product_store" FOREIGN KEY ("store_id") REFERENCES "store"("id")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."ProductStoreId"`);
        await queryRunner.query(`ALTER TABLE "product"
            DROP COLUMN "store_id"`);
        await queryRunner.query(`ALTER TABLE "product"
                DROP CONSTRAINT "fk_product_store"`);
    }
}
exports.AddStoreIdToProduct1712575204173 = AddStoreIdToProduct1712575204173;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxMjU3NTIwNDE3My1BZGRTdG9yZUlkVG9Qcm9kdWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMTcxMjU3NTIwNDE3My1BZGRTdG9yZUlkVG9Qcm9kdWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsZ0NBQWdDO0lBQ3BDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNyQjtpREFDMkMsQ0FDNUMsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDckIseURBQXlELENBQzFELENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ3JCO29HQUM4RixDQUMvRixDQUFDO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDeEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDaEUsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDO21DQUNPLENBQUMsQ0FBQztRQUNqQyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ3JCO21EQUM2QyxDQUM5QyxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBeEJELDRFQXdCQyJ9