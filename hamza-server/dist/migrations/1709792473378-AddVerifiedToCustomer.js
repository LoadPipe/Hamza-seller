"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVerifiedToCustomer1709792473378 = void 0;
class AddVerifiedToCustomer1709792473378 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "customer" ADD COLUMN "is_verified" boolean NOT NULL DEFAULT false;
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "customer" DROP COLUMN "is_verified";
    `);
    }
}
exports.AddVerifiedToCustomer1709792473378 = AddVerifiedToCustomer1709792473378;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcwOTc5MjQ3MzM3OC1BZGRWZXJpZmllZFRvQ3VzdG9tZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xNzA5NzkyNDczMzc4LUFkZFZlcmlmaWVkVG9DdXN0b21lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLGtDQUFrQztJQUVwQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQzs7U0FFdkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDOztLQUUzQixDQUFDLENBQUM7SUFDSCxDQUFDO0NBRUo7QUFkRCxnRkFjQyJ9