"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuckyOrder3595867849494 = void 0;
class BuckyOrder3595867849494 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" ADD COLUMN "bucky_metadata" jsonb`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "bucky_metadata"`);
    }
}
exports.BuckyOrder3595867849494 = BuckyOrder3595867849494;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMzU5NTg2Nzg0OTQ5NC1CdWNreU9yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGlvbnMvMzU5NTg2Nzg0OTQ5NC1CdWNreU9yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsdUJBQXVCO0lBQ3pCLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBd0I7UUFDcEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUNuQix1REFBdUQsQ0FDMUQsQ0FBQztJQUNOLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQXdCO1FBQ3RDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7Q0FDSjtBQVZELDBEQVVDIn0=