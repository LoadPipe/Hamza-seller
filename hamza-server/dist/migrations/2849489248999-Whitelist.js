"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWhiteListTable2849489248999 = void 0;
class CreateWhiteListTable2849489248999 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "white_list" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "store_id" character varying NOT NULL, "wallet_address" character varying NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdbn" PRIMARY KEY ("id"))`);
        //await queryRunner.query(
        //    `CREATE TABLE "whitelist_items" ("id"  character varying NOT NULL, "whitelist_id" character varying NOT NULL, "customer_address" character varying NOT NULL, CONSTRAINT "PK_whitelist_item" PRIMARY KEY ("id"))`
        //);
        //await queryRunner.query(
        //    `ALTER TABLE "whitelist_items"
        //        ADD CONSTRAINT "fk_whitelist" FOREIGN KEY ("whitelist_id") REFERENCES "white_list"("id")`,
        //);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('white_list');
        await queryRunner.dropTable('whitelist_items');
    }
}
exports.CreateWhiteListTable2849489248999 = CreateWhiteListTable2849489248999;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjg0OTQ4OTI0ODk5OS1XaGl0ZWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8yODQ5NDg5MjQ4OTk5LVdoaXRlbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLGlDQUFpQztJQUNuQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsb1hBQW9YLENBQ3ZYLENBQUM7UUFDRiwwQkFBMEI7UUFDMUIsc05BQXNOO1FBQ3ROLElBQUk7UUFDSiwwQkFBMEI7UUFDMUIsb0NBQW9DO1FBQ3BDLG9HQUFvRztRQUNwRyxJQUFJO0lBQ1IsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFDLE1BQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDSjtBQWxCRCw4RUFrQkMifQ==