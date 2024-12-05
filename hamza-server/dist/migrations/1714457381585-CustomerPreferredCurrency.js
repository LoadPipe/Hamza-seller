"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerPreferredCurrency1714457381585 = void 0;
class CustomerPreferredCurrency1714457381585 {
    constructor() {
        this.name = 'CustomerPreferredCurrency1714457381585';
    }
    async up(queryRunner) {
        // Add preferred_currency_id column
        await queryRunner.query(`
            ALTER TABLE "customer"
            ADD COLUMN IF NOT EXISTS "preferred_currency_id" varchar;
        `);
        // Create a foreign key relation
        await queryRunner.query(`
            ALTER TABLE "customer"
            ADD CONSTRAINT "fk_customer_currency"
            FOREIGN KEY ("preferred_currency_id") REFERENCES "currency"("code");
        `);
    }
    async down(queryRunner) {
        // Remove foreign key relation
        await queryRunner.query(`
            ALTER TABLE "customer"
            DROP CONSTRAINT "fk_customer_currency";
        `);
        // Remove preferred_currency_id column
        await queryRunner.query(`
            ALTER TABLE "customer"
            DROP COLUMN "preferred_currency_id";
        `);
    }
}
exports.CustomerPreferredCurrency1714457381585 = CustomerPreferredCurrency1714457381585;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxNDQ1NzM4MTU4NS1DdXN0b21lclByZWZlcnJlZEN1cnJlbmN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMTcxNDQ1NzM4MTU4NS1DdXN0b21lclByZWZlcnJlZEN1cnJlbmN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsc0NBQXNDO0lBQW5EO1FBQ0ksU0FBSSxHQUFHLHdDQUF3QyxDQUFDO0lBOEJwRCxDQUFDO0lBNUJVLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsbUNBQW1DO1FBQ25DLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQzs7O1NBR3ZCLENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUNoQyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUM7Ozs7U0FJdkIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsOEJBQThCO1FBQzlCLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQzs7O1NBR3ZCLENBQUMsQ0FBQztRQUVILHNDQUFzQztRQUN0QyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUM7OztTQUd2QixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUEvQkQsd0ZBK0JDIn0=