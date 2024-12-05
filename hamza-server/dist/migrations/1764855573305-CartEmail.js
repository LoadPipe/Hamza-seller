"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartEmail1764855573305 = void 0;
class CartEmail1764855573305 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "cart_email" ( 
            "id" character varying NOT NULL,
            "email_address" character varying,
            CONSTRAINT "PK_gknmp6lnigjkskgfghssahv1dgs912" PRIMARY KEY ("id") )`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "cart_email"`);
    }
}
exports.CartEmail1764855573305 = CartEmail1764855573305;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTc2NDg1NTU3MzMwNS1DYXJ0RW1haWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlncmF0aW9ucy8xNzY0ODU1NTczMzA1LUNhcnRFbWFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLHNCQUFzQjtJQUN4QixLQUFLLENBQUMsRUFBRSxDQUFDLFdBQXdCO1FBQ3BDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkI7OztnRkFHb0UsQ0FDdkUsQ0FBQztJQUNOLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCO1FBQ3RDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIseUJBQXlCLENBQzVCLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFmRCx3REFlQyJ9