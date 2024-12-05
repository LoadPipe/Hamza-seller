"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWalletAndStore1708674950308 = void 0;
class UserWalletAndStore1708674950308 {
    constructor() {
        this.name = "UserWalletAndStore1708674950308";
    }
    async up(queryRunner) {
        // await queryRunner.query(`CREATE TABLE "wallet_address" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "walletAddress" character varying NOT NULL, "userId" character varying, CONSTRAINT "UQ_c86ee3052475cd979ce83c88d97" UNIQUE ("walletAddress"), CONSTRAINT "PK_65a8186afe80354699bfa8c630f" PRIMARY KEY ("id"))`);
        // await queryRunner.query(`ALTER TABLE "wallet_address" ADD CONSTRAINT "FK_5dc18be17cee71018517e1df272" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE "user"
                ADD COLUMN "wallet_address" VARCHAR NOT NULL DEFAULT '';
        `);
    }
    async down(queryRunner) {
        //     await queryRunner.query(`ALTER TABLE "wallet_address" DROP CONSTRAINT "FK_5dc18be17cee71018517e1df272"`);
        //     await queryRunner.query(`DROP TABLE "wallet_address"`);
        // }
        await queryRunner.query(`
            ALTER TABLE "customer"
                DROP COLUMN "wallet_address";
        `);
    }
}
exports.UserWalletAndStore1708674950308 = UserWalletAndStore1708674950308;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcwODY3NDk1MDMwOC1Vc2VyV2FsbGV0QW5kU3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xNzA4Njc0OTUwMzA4LVVzZXJXYWxsZXRBbmRTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLCtCQUErQjtJQUE1QztRQUNFLFNBQUksR0FBRyxpQ0FBaUMsQ0FBQztJQW9CM0MsQ0FBQztJQWxCUSxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3RDLCtjQUErYztRQUMvYyxrTUFBa007UUFDbE0sTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDOzs7U0FHbkIsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDeEMsZ0hBQWdIO1FBQ2hILDhEQUE4RDtRQUM5RCxJQUFJO1FBQ0osTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDOzs7U0FHbkIsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztDQUNGO0FBckJELDBFQXFCQyJ9