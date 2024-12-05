"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreEscrowContract1784923758602 = void 0;
class StoreEscrowContract1784923758602 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "store" ADD "escrow_contract_address" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "escrow_contract_address"`);
    }
}
exports.StoreEscrowContract1784923758602 = StoreEscrowContract1784923758602;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTc4NDkyMzc1ODYwMi1TdG9yZUVzY3Jvd0NvbnRyYWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMTc4NDkyMzc1ODYwMi1TdG9yZUVzY3Jvd0NvbnRyYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsZ0NBQWdDO0lBQ2xDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQixxRUFBcUUsQ0FDeEUsQ0FBQztJQUNOLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCO1FBQ3RDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FDbkIsMkRBQTJELENBQzlELENBQUM7SUFDTixDQUFDO0NBQ0o7QUFaRCw0RUFZQyJ9