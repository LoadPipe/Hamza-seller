"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassMarket2849489248924 = void 0;
class MassMarket2849489248924 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "store" ADD COLUMN "massmarket_store_id" VARCHAR NULL`);
        await queryRunner.query(`ALTER TABLE "store" ADD COLUMN "massmarket_keycard" VARCHAR NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "massmarket_prod_id" VARCHAR NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD COLUMN "massmarket_order_id" VARCHAR NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD COLUMN "massmarket_amount" VARCHAR NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD COLUMN "massmarket_ttl" BIGINT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "massmarket_store_id"`);
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "massmarket_keycard"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "massmarket_prod_id"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "massmarket_order_id"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "massmarket_amount"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "massmarket_ttl"`);
    }
}
exports.MassMarket2849489248924 = MassMarket2849489248924;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjg0OTQ4OTI0ODkyNC1NYXNzTWFya2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMjg0OTQ4OTI0ODkyNC1NYXNzTWFya2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsdUJBQXVCO0lBQ3pCLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixtRUFBbUUsQ0FDdEUsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsa0VBQWtFLENBQ3JFLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLG9FQUFvRSxDQUN2RSxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixtRUFBbUUsQ0FDdEUsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsaUVBQWlFLENBQ3BFLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLDZEQUE2RCxDQUNoRSxDQUFDO0lBQ04sQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQix1REFBdUQsQ0FDMUQsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsc0RBQXNELENBQ3pELENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHdEQUF3RCxDQUMzRCxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQix1REFBdUQsQ0FDMUQsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIscURBQXFELENBQ3hELENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLGtEQUFrRCxDQUNyRCxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBMUNELDBEQTBDQyJ9