"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuckyProduct5828595666725 = void 0;
class BuckyProduct5828595666725 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "product" ADD "bucky_metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "bucky_metadata" jsonb`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "bucky_metadata"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "bucky_metadata"`);
    }
}
exports.BuckyProduct5828595666725 = BuckyProduct5828595666725;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNTgyODU5NTY2NjcyNS1CdWNreVByb2R1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy81ODI4NTk1NjY2NzI1LUJ1Y2t5UHJvZHVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLHlCQUF5QjtJQUMzQixLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsa0RBQWtELENBQ3JELENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLDBEQUEwRCxDQUM3RCxDQUFDO0lBQ04sQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixvREFBb0QsQ0FDdkQsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsNERBQTRELENBQy9ELENBQUM7SUFDTixDQUFDO0NBQ0o7QUFsQkQsOERBa0JDIn0=