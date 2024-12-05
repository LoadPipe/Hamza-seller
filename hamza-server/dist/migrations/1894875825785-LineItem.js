"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineItem1894875825785 = void 0;
class LineItem1894875825785 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "line_item" ADD COLUMN "currency_code" VARCHAR NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line_item" ADD CONSTRAINT "FK_LineItem_Currency" FOREIGN KEY ("currency_code") REFERENCES "currency"("code")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "currency_code"`);
        await queryRunner.query(`ALTER TABLE "line_item" DROP CONSTRAINT "FK_LineItem_Currency"`);
    }
}
exports.LineItem1894875825785 = LineItem1894875825785;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTg5NDg3NTgyNTc4NS1MaW5lSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWdyYXRpb25zLzE4OTQ4NzU4MjU3ODUtTGluZUl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxxQkFBcUI7SUFDdkIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUF3QjtRQUNwQyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHFFQUFxRSxDQUN4RSxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQiwySEFBMkgsQ0FDOUgsQ0FBQztJQUNOLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCO1FBQ3RDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsbURBQW1ELENBQ3RELENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLGdFQUFnRSxDQUNuRSxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBbEJELHNEQWtCQyJ9