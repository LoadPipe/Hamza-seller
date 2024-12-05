"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedExchangeRate1726040698132 = void 0;
class CachedExchangeRate1726040698132 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "cached_exchange_rate" (
                "id" character varying NOT NULL,
                "to_currency_code" character varying NOT NULL,
                "from_currency_code" character varying NOT NULL,
                "rate" float NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_currency_code" UNIQUE ("from_currency_code", "to_currency_code"),
                CONSTRAINT "PK_cached_exchange_rate" PRIMARY KEY ("id"),
                CONSTRAINT "FK_to_currency_code" FOREIGN KEY ("to_currency_code") REFERENCES "currency"("code") ON DELETE CASCADE,
                CONSTRAINT "FK_from_currency_code" FOREIGN KEY ("from_currency_code") REFERENCES "currency"("code") ON DELETE CASCADE
            )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "cached_exchange_rate"`);
    }
}
exports.CachedExchangeRate1726040698132 = CachedExchangeRate1726040698132;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcyNjA0MDY5ODEzMi1DYWNoZWRFeGNoYW5nZVJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xNzI2MDQwNjk4MTMyLUNhY2hlZEV4Y2hhbmdlUmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLCtCQUErQjtJQUNqQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQzs7Ozs7Ozs7Ozs7OztLQWEzQixDQUFDLENBQUM7SUFDSCxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN0QyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztJQUNqRSxDQUFDO0NBQ0o7QUFyQkQsMEVBcUJDIn0=