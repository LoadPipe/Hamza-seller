"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCollection1990838575665 = void 0;
class ProductCollection1990838575665 {
    async up(queryRunner) {
        await queryRunner.query(
        //TODO: make nullable after we've created our own admin
        `ALTER TABLE "product_collection" ADD COLUMN "store_id" VARCHAR NULL`);
        await queryRunner.query(`ALTER TABLE "product_collection" ADD CONSTRAINT "FK_Product_Collection_Store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "product_collection" DROP CONSTRAINT "FK_Product_Collection_Store"`);
        await queryRunner.query(`ALTER TABLE "product_collection" DROP COLUMN "store_id"`);
    }
}
exports.ProductCollection1990838575665 = ProductCollection1990838575665;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTk5MDgzODU3NTY2NS1Qcm9kdWN0Q29sbGVjdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xOTkwODM4NTc1NjY1LVByb2R1Y3RDb2xsZWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLDhCQUE4QjtJQUNoQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUs7UUFDbkIsdURBQXVEO1FBQ3ZELHFFQUFxRSxDQUN4RSxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixzS0FBc0ssQ0FDekssQ0FBQztJQUNOLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCO1FBQ3RDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsZ0ZBQWdGLENBQ25GLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHlEQUF5RCxDQUM1RCxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBbkJELHdFQW1CQyJ9