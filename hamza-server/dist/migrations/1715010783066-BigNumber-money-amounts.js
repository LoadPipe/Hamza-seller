"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigNumberMoneyAmounts1715010783066 = void 0;
class BigNumberMoneyAmounts1715010783066 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "money_amount"
            ALTER COLUMN "amount" TYPE INT8`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "money_amount"
            ALTER COLUMN "amount" TYPE INT4`);
    }
}
exports.BigNumberMoneyAmounts1715010783066 = BigNumberMoneyAmounts1715010783066;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTcxNTAxMDc4MzA2Ni1CaWdOdW1iZXItbW9uZXktYW1vdW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWdyYXRpb25zLzE3MTUwMTA3ODMwNjYtQmlnTnVtYmVyLW1vbmV5LWFtb3VudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxrQ0FBa0M7SUFFcEMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUF3QjtRQUNwQyxNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQ25COzRDQUNnQyxDQUNuQyxDQUFDO0lBQ04sQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBd0I7UUFDdEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQjs0Q0FDZ0MsQ0FDbkMsQ0FBQztJQUNOLENBQUM7Q0FFSjtBQWhCRCxnRkFnQkMifQ==