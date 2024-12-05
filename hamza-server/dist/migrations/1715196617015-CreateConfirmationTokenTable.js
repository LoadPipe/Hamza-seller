"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConfirmationTokenTable1715196617015 = void 0;
class CreateConfirmationTokenTable1715196617015 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "confirmation_token" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "token" character varying NOT NULL, "email_address" character varying NOT NULL, "redeemed" boolean DEFAULT false, "expiration_hours" int DEFAULT 3, "customer_id" character varying NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("token"))`);
        await queryRunner.query(`ALTER TABLE "confirmation_token" ADD CONSTRAINT "FK_auvt4ec8rnokwoadgpxqf9bf66" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('confirmation_token');
    }
}
exports.CreateConfirmationTokenTable1715196617015 = CreateConfirmationTokenTable1715196617015;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxNTE5NjYxNzAxNS1DcmVhdGVDb25maXJtYXRpb25Ub2tlblRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMTcxNTE5NjYxNzAxNS1DcmVhdGVDb25maXJtYXRpb25Ub2tlblRhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEseUNBQXlDO0lBRzNDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixpYUFBaWEsQ0FDcGEsQ0FBQztRQUNGLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsaUxBQWlMLENBQ3BMLENBQUM7SUFDTixDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN0QyxNQUFNLFdBQVcsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN0RCxDQUFDO0NBQ0o7QUFmRCw4RkFlQyJ9