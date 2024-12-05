"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiVendorOrder1907365738273 = void 0;
class MultiVendorOrder1907365738273 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" ADD COLUMN "store_id" VARCHAR NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_Order_Store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "REL_c99a206eb11ad45f6b7f04f2dc"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_Order_Store"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "store_id"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "REL_c99a206eb11ad45f6b7f04f2dc" UNIQUE ("cart_id")`);
    }
}
exports.MultiVendorOrder1907365738273 = MultiVendorOrder1907365738273;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTkwNzM2NTczODI3My1NdWx0aVZlbmRvck9yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMTkwNzM2NTczODI3My1NdWx0aVZlbmRvck9yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsNkJBQTZCO0lBQy9CLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQix3REFBd0QsQ0FDM0QsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsNElBQTRJLENBQy9JLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHNFQUFzRSxDQUN6RSxDQUFDO0lBQ04sQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixzREFBc0QsQ0FDekQsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsd0ZBQXdGLENBQzNGLENBQUM7SUFDTixDQUFDO0NBQ0o7QUF0QkQsc0VBc0JDIn0=