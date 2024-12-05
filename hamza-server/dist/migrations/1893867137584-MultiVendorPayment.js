"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiVendorPayment1893867137584 = void 0;
class MultiVendorPayment1893867137584 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "payment" ADD COLUMN "blockchain_data" jsonb NULL`);
        await queryRunner.query(`DROP INDEX "UniquePaymentActive"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "blockchain_data"`);
    }
}
exports.MultiVendorPayment1893867137584 = MultiVendorPayment1893867137584;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTg5Mzg2NzEzNzU4NC1NdWx0aVZlbmRvclBheW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xODkzODY3MTM3NTg0LU11bHRpVmVuZG9yUGF5bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLCtCQUErQjtJQUNqQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsK0RBQStELENBQ2xFLENBQUM7UUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN0QyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHFEQUFxRCxDQUN4RCxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBYkQsMEVBYUMifQ==