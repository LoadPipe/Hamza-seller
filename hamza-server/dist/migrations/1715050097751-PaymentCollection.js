"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCollection1715050097751 = void 0;
class PaymentCollection1715050097751 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "payment_collection" ADD COLUMN "store_id" VARCHAR NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_collection" ADD CONSTRAINT "FK_payment_collection_store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON UPDATE CASCADE`);
    }
    async down(queryRunner) { }
}
exports.PaymentCollection1715050097751 = PaymentCollection1715050097751;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxNTA1MDA5Nzc1MS1QYXltZW50Q29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWdyYXRpb25zLzE3MTUwNTAwOTc3NTEtUGF5bWVudENvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSw4QkFBOEI7SUFDaEMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUF3QjtRQUNwQyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25CLHlFQUF5RSxDQUM1RSxDQUFDO1FBQ0YsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixtSkFBbUosQ0FDdEosQ0FBQztJQUNOLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCLElBQWtCLENBQUM7Q0FDaEU7QUFYRCx3RUFXQyJ9