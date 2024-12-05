"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiVenderPrice1904904849023 = void 0;
class MultiVenderPrice1904904849023 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "price_list" ADD COLUMN "store_id" VARCHAR NOT NULL`);
        await queryRunner.query(`ALTER TABLE "price_list" ADD CONSTRAINT "FK_Price_List_Store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "price_list" DROP CONSTRAINT "FK_Product_Collection_Store"`);
        await queryRunner.query(`ALTER TABLE "price_list" DROP COLUMN "store_id"`);
    }
}
exports.MultiVenderPrice1904904849023 = MultiVenderPrice1904904849023;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTkwNDkwNDg0OTAyMy1NdWx0aVZlbmRvclByaWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMTkwNDkwNDg0OTAyMy1NdWx0aVZlbmRvclByaWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsNkJBQTZCO0lBQy9CLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixpRUFBaUUsQ0FDcEUsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsc0pBQXNKLENBQ3pKLENBQUM7SUFDTixDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN0QyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHdFQUF3RSxDQUMzRSxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixpREFBaUQsQ0FDcEQsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQWxCRCxzRUFrQkMifQ==